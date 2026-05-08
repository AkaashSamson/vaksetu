import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserGroupsLeaderboardPreviews } from '@/lib/db/queries/leaderboard';
import { isMockMode } from '@/lib/env';
import { mockLeaderboardPreviews } from '@/lib/mock/data';

export async function GET(request: Request) {
    try {
        if (isMockMode) {
            return NextResponse.json(mockLeaderboardPreviews);
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const timeframeParam = searchParams.get('timeframe');
        const timeframe = timeframeParam === 'weekly' ? 'weekly' : 'all-time';

        const previews = await getUserGroupsLeaderboardPreviews(user.id, timeframe);
        return NextResponse.json(previews);
    } catch (e) {
        console.error("Error fetching leaderboard previews:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
