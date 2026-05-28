import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { addQuizToGroup, getCommunityById } from '@/lib/db/queries/communities';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {
        const { groupId } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const group = await getCommunityById(groupId);
        if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 });

        // Ensure user is admin (owner)
        if (group.ownerId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const quizIds = body.quizIds;

        if (!quizIds || !Array.isArray(quizIds)) {
            return NextResponse.json({ error: 'Invalid quizIds' }, { status: 400 });
        }

        for (const quizId of quizIds) {
            await addQuizToGroup(groupId, quizId);
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('Error adding quizzes to group:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
