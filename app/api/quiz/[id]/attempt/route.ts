import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { quizAttempt, userGroup, groupMember, quizGroup } from '@/lib/db/schema';
import { eq, and, max, gte, sql } from 'drizzle-orm';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: quizId } = await params;
        const body = await request.json();
        const { correct, wrong, unanswered, total, answers, timeTaken } = body;

        const timeTakenSeconds = typeof timeTaken === 'number' ? timeTaken : 0;

        // 1. Calculate the final attempt score: base score + time bonus scaled by accuracy
        const baseScore = correct * 100;
        const targetTime = total * 15; // 15 seconds per question target
        const timeBonus = Math.max(0, targetTime - timeTakenSeconds) * 2; // 2 bonus points per second saved
        const accuracyMultiplier = total > 0 ? (correct / total) : 0;
        const finalAttemptScore = Math.round(baseScore + (timeBonus * accuracyMultiplier));

        // Get the current max attempt number for this user and quiz
        const [maxAttempt] = await db
            .select({ max: max(quizAttempt.attemptNumber) })
            .from(quizAttempt)
            .where(
                and(
                    eq(quizAttempt.userId, user.id),
                    eq(quizAttempt.quizId, quizId)
                )
            );

        const nextAttemptNumber = (maxAttempt?.max || 0) + 1;

        // 2. Insert the attempt
        const [newAttempt] = await db.insert(quizAttempt).values({
            quizId,
            userId: user.id,
            totalScore: finalAttemptScore.toString(),
            attemptNumber: nextAttemptNumber,
            response: { correct, wrong, unanswered, total, answers },
            completedAt: new Date().toISOString(),
            timeTaken: timeTakenSeconds,
        }).returning();

        // 3. Find all groups this quiz belongs to
        const quizGroupsList = await db
            .select({ groupId: quizGroup.groupId, activeThisWeek: quizGroup.activeThisWeek })
            .from(quizGroup)
            .where(eq(quizGroup.quizId, quizId));

        // 4. Update group member scores for each group
        for (const qg of quizGroupsList) {
            const groupId = qg.groupId;

            // Fetch the group to check weekly reset
            const [group] = await db
                .select({ lastWeeklyReset: userGroup.lastWeeklyReset })
                .from(userGroup)
                .where(eq(userGroup.id, groupId))
                .limit(1);

            if (!group) continue;

            // Check if user is a member of this group
            const [membership] = await db
                .select({ weeklyScore: groupMember.weeklyScore })
                .from(groupMember)
                .where(
                    and(
                        eq(groupMember.groupId, groupId),
                        eq(groupMember.userId, user.id)
                    )
                )
                .limit(1);

            if (!membership) continue;

            const lastResetDate = new Date(group.lastWeeklyReset);
            const now = new Date();
            const timeDiff = now.getTime() - lastResetDate.getTime();
            const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

            let resetOccurred = false;
            let currentResetTimestamp = group.lastWeeklyReset;

            // Lazy Weekly Rollover check
            if (timeDiff >= sevenDaysInMs) {
                resetOccurred = true;
                const newResetTime = now.toISOString();

                // Roll over weekly score to all-time score and reset weekly scores for ALL members
                await db
                    .update(groupMember)
                    .set({
                        allTimeScore: sql`all_time_score + weekly_score`,
                        weeklyScore: 0,
                        weeklyLastUpdated: newResetTime,
                    })
                    .where(eq(groupMember.groupId, groupId));

                // Update group reset timestamp
                await db
                    .update(userGroup)
                    .set({ lastWeeklyReset: newResetTime })
                    .where(eq(userGroup.id, groupId));

                currentResetTimestamp = newResetTime;
            }

            // 5. Weekly score calculation logic for this user
            // Find all active quizzes in the group for this week
            const activeQuizzes = await db
                .select({ quizId: quizGroup.quizId })
                .from(quizGroup)
                .where(
                    and(
                        eq(quizGroup.groupId, groupId),
                        eq(quizGroup.activeThisWeek, true)
                    )
                );

            let newWeeklyScore = 0;

            for (const activeQuiz of activeQuizzes) {
                // Fetch attempts for this quiz after the currentResetTimestamp
                const attempts = await db
                    .select({
                        totalScore: quizAttempt.totalScore,
                        completedAt: quizAttempt.completedAt,
                    })
                    .from(quizAttempt)
                    .where(
                        and(
                            eq(quizAttempt.userId, user.id),
                            eq(quizAttempt.quizId, activeQuiz.quizId),
                            gte(quizAttempt.completedAt, currentResetTimestamp)
                        )
                    )
                    .orderBy(quizAttempt.completedAt); // chronological order

                if (attempts.length === 0) continue;

                // Find the first attempt with the highest score
                let bestScore = 0;
                let attemptsRequired = 1;

                for (let i = 0; i < attempts.length; i++) {
                    const score = Number(attempts[i].totalScore || 0);
                    if (score > bestScore) {
                        bestScore = score;
                        attemptsRequired = i + 1;
                    }
                }

                // Compute effective score with attempt penalty (20 points deduction per extra attempt)
                const attemptPenalty = (attemptsRequired - 1) * 20;
                const effectiveScore = Math.max(0, bestScore - attemptPenalty);
                newWeeklyScore += effectiveScore;
            }

            // Get current weekly score of the member (which might have been reset to 0 if rollover happened)
            const currentWeeklyScore = resetOccurred ? 0 : membership.weeklyScore;

            // Only update weekly score and tie-breaking timestamp if the score actually improved!
            if (newWeeklyScore > currentWeeklyScore || resetOccurred) {
                await db
                    .update(groupMember)
                    .set({
                        weeklyScore: newWeeklyScore,
                        weeklyLastUpdated: now.toISOString(),
                    })
                    .where(
                        and(
                            eq(groupMember.groupId, groupId),
                            eq(groupMember.userId, user.id)
                        )
                    );
            }
        }

        return NextResponse.json(newAttempt);
    } catch (e) {
        console.error("Error saving quiz attempt:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
