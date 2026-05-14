// app/api/communities/[groupId]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCommunityById, createCommunityGroup } from '@/lib/db/queries/communities';
import { getGroupLeaderboard } from '@/lib/db/queries/leaderboard';
import { isMockMode } from '@/lib/env';
import { mockCommunities } from '@/lib/mock/data';

/**
 * GET /api/communities/:groupId
 * Returns the populated community group with the given ID.
 * In mock mode we simply look it up from `mockCommunities`.
 */
export async function GET(request: Request, { params }: { params: { groupId: string } }) {
  try {
    const { groupId } = await params;
    console.log('Fetching groupId:', groupId, 'params awaited');

    // Mock mode shortcut
    if (isMockMode) {
      const mock = mockCommunities.find((g) => g.id === groupId);
      if (!mock) return NextResponse.json({ error: 'Group not found' }, { status: 404 });
      return NextResponse.json({ currentUser: 'me', group: mock, leaderboard: [] });
    }

    // Real mode – fetch from Supabase
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const group = await getCommunityById(groupId);
    if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 });

    const leaderboard = await getGroupLeaderboard(group.id);
    const formattedLeaderboard = leaderboard.map(l => ({
        userId: l.userId,
        name: l.fullName || 'Unknown User',
        score: l.totalScore
    }));

    return NextResponse.json({ currentUser: user.id, group, leaderboard: formattedLeaderboard });
  } catch (e) {
    console.error('Error fetching community group:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/communities/:groupId (optional – placeholder for future extensions)
 */
export async function POST() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
