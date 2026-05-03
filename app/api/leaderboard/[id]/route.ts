import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getGroupLeaderboard } from '@/lib/db/queries/leaderboard';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const timeframeParam = searchParams.get('timeframe');
        const timeframe = timeframeParam === 'weekly' ? 'weekly' : 'all-time';

        const { id } = await params;
        const leaderboard = await getGroupLeaderboard(id, timeframe);
        
        return NextResponse.json(leaderboard);
    } catch (e) {
        console.error("Error fetching group leaderboard:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
