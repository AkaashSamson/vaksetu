import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateQuizWeeklyStatus, getCommunityById } from '@/lib/db/queries/communities';

export async function PATCH(
    request: Request,
    { params }: { params: { groupId: string; quizId: string } }
) {
    try {
        const { groupId, quizId } = await params;
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
        const { activeThisWeek } = body;

        if (typeof activeThisWeek !== 'boolean') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        await updateQuizWeeklyStatus(groupId, quizId, activeThisWeek);

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('Error updating quiz weekly status:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
