import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAllQuizzes } from '@/lib/db/queries/quizzes';
import { isMockMode } from '@/lib/env';
import { mockQuizzes } from '@/lib/mock/data';

export async function GET(request: Request) {
    try {
        if (isMockMode) {
            return NextResponse.json(mockQuizzes);
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const quizzes = await getAllQuizzes();
        return NextResponse.json(quizzes);
    } catch (e) {
        console.error("Error fetching quizzes:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
