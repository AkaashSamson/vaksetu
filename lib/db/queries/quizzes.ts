import { eq, inArray } from 'drizzle-orm';
import { db } from '../index';
import { quiz, quizAttempt, glosses } from '../schema';

export interface PopulatedQuiz {
    id: string;
    title: string;
    description: string | null;
    difficulty: string | null;
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

/**
 * Retrieves all quizzes
 */
export async function getQuizzesList() {
    return db.select().from(quiz);
}

/**
 * Retrieves a single quiz by ID
 */
export async function getQuizById(id: string) {
    const results = await db.select().from(quiz).where(eq(quiz.id, id));
    return results[0] || null;
}

/**
 * Retrieves a single quiz by ID with fully resolved and hydrated questions/options
 */
export async function getHydratedQuizById(id: string) {
    const [quizRow] = await db.select().from(quiz).where(eq(quiz.id, id)).limit(1);
    if (!quizRow) return null;

    const content = quizRow.content as any;
    const rawQuestions = content?.questions || [];

    if (rawQuestions.length === 0) {
        return {
            id: quizRow.id,
            title: quizRow.title,
            description: quizRow.description || '',
            difficulty: quizRow.difficulty || 'EASY',
            questions: []
        };
    }

    // Collect all unique gloss IDs referenced in questions and options
    const glossIdsSet = new Set<number>();
    for (const q of rawQuestions) {
        if (q.q_gloss_id) glossIdsSet.add(Number(q.q_gloss_id));
        if (Array.isArray(q.options)) {
            for (const optId of q.options) {
                glossIdsSet.add(Number(optId));
            }
        }
    }

    const glossIds = Array.from(glossIdsSet);
    const fetchedGlosses = glossIds.length > 0
        ? await db
            .select({
                id: glosses.id,
                glossName: glosses.glossName,
                imageUrl: glosses.imageUrl,
            })
            .from(glosses)
            .where(inArray(glosses.id, glossIds.map(BigInt)))
        : [];

    const glossMap = new Map(fetchedGlosses.map(g => [Number(g.id), g]));

    const questions = rawQuestions.map((q: any) => {
        const correctGloss = glossMap.get(Number(q.q_gloss_id));
        const options = Array.isArray(q.options)
            ? q.options.map((optId: number) => {
                const g = glossMap.get(Number(optId));
                return {
                    id: optId,
                    name: g ? g.glossName : optId.toString(),
                    image_url: g ? g.imageUrl : undefined
                };
            })
            : [];

        const questionType = q.type || 'image_mcq';

        if (questionType === 'sign_mcq') {
            const question_image = correctGloss ? (correctGloss.imageUrl || `/glosses/${correctGloss.glossName}.jpg`) : '';
            return {
                type: 'sign_mcq',
                q_no: q.q_no,
                question_image,
                correct_id: Number(q.q_gloss_id),
                options
            };
        } else {
            // default is image_mcq
            let displayQuestionText = q.q_text || "Identify the correct sign";
            if (displayQuestionText.toLowerCase().trim() === "identify the correct sign" && correctGloss) {
                displayQuestionText = `Identify the correct sign for '${correctGloss.glossName}'`;
            }
            return {
                type: 'image_mcq',
                q_no: q.q_no,
                q_text: displayQuestionText,
                correct_id: Number(q.q_gloss_id),
                options
            };
        }
    });

    return {
        id: quizRow.id,
        title: quizRow.title,
        description: quizRow.description || '',
        difficulty: quizRow.difficulty || 'EASY',
        questions
    };
}

