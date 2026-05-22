import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { quiz, quizAttempt, userGroup, groupMember, quizGroup } from '@/lib/db/schema';
import { eq, and, max, gte, sql } from 'drizzle-orm';
import { isMockMode } from '@/lib/env';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (isMockMode) {
            console.log("MOCK: Submitted quiz", body.quizId, body);
            return NextResponse.json({ ok: true, score: body.totalScore });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { quizId, totalScore, response } = body;

        // 1. Fetch the quiz to determine number of questions and calculate accurate results
        const [quizRow] = await db
            .select()
            .from(quiz)
            .where(eq(quiz.id, quizId))
            .limit(1);

        if (!quizRow) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }

        const content = quizRow.content as any;
        const questions = content?.questions || [];
        const total = questions.length;

        let correct = 0;
        let wrong = 0;
        let unanswered = 0;

        if (response && typeof response === 'object') {
            for (const q of questions) {
                const selected = response[q.q_no];
                if (selected == null) {
                    unanswered++;
                } else if (Number(selected) === Number(q.q_gloss_id)) {
                    correct++;
                } else {
                    wrong++;
                }
            }
        } else {
            correct = typeof totalScore === 'number' ? totalScore : 0;
            wrong = total - correct;
            unanswered = 0;
        }

        // List page submissions do not track a timer. They default to the standard target time (15s per question)
        const targetTime = total * 15;
        const timeTakenSeconds = targetTime;
        
        const baseScore = correct * 100;
        const finalAttemptScore = baseScore; // Zero speed bonus since timeTaken matches targetTime

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
            response: { correct, wrong, unanswered, total, answers: response },
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

        return NextResponse.json({ ok: true, attempt: newAttempt });
    } catch (e) {
        console.error("Error submitting quiz:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
