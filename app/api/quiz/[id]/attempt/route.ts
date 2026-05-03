import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { quizAttempt } from '@/lib/db/schema';
import { eq, and, max } from 'drizzle-orm';

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
        const { correct, wrong, unanswered, total, answers } = body;

        // Calculate total score based on correct answers (e.g., 10 points per correct answer)
        // Adjust the scoring logic as needed based on the application rules
        const totalScore = correct * 10; 

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

        // Insert the attempt
        const [newAttempt] = await db.insert(quizAttempt).values({
            quizId,
            userId: user.id,
            totalScore: totalScore.toString(),
            attemptNumber: nextAttemptNumber,
            response: { correct, wrong, unanswered, total, answers },
            completedAt: new Date().toISOString(),
            // Note: We are leaving groupId null here as per our global tracking logic.
            // The leaderboard query will map it via quiz_group.
        }).returning();

        return NextResponse.json(newAttempt);
    } catch (e) {
        console.error("Error saving quiz attempt:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
