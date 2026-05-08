import { eq } from 'drizzle-orm';
import { db } from '../index';
import { quiz, quizAttempt } from '../schema';

export interface PopulatedQuiz {
    id: string;
    title: string;
    description: string | null;
    difficulty: string | null;
    type: string;
    content: any; // jsonb
}

/**
 * Retrieves all available quizzes
 */
export async function getAllQuizzes(): Promise<PopulatedQuiz[]> {
    const results = await db
        .select({
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            difficulty: quiz.difficulty,
            type: quiz.type,
            content: quiz.content,
        })
        .from(quiz);
        
    return results;
}

/**
 * Records a quiz attempt
 */
export async function recordQuizAttempt(
    quizId: string,
    userId: string,
    totalScore: number,
    response: any
): Promise<void> {
    await db.insert(quizAttempt).values({
        quizId,
        userId,
        totalScore: totalScore.toString(),
        completedAt: new Date().toISOString(),
        response,
    });
}
