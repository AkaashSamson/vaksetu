import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getHydratedQuizById } from '@/lib/db/queries/quizzes';
import { isMockMode } from '@/lib/env';
import { mockQuizzes } from '@/lib/mock/data';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (isMockMode) {
            const quiz = mockQuizzes.find(q => q.id === id);
            return quiz ? NextResponse.json(quiz) : NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const quiz = await getHydratedQuizById(id);
        
        if (!quiz) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        
        return NextResponse.json(quiz);
    } catch (e) {
        console.error("Error fetching quiz:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

