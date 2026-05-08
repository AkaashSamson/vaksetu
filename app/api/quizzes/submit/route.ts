import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { recordQuizAttempt } from '@/lib/db/queries/quizzes';
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

        await recordQuizAttempt(body.quizId, user.id, body.totalScore, body.response);

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("Error submitting quiz:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
