// app/api/communities/index.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserCommunities, createCommunityGroup } from '@/lib/db/queries/communities';
import { isMockMode } from '@/lib/env';
import { mockCommunities } from '@/lib/mock/data';

export async function GET(request: Request) {
  try {
    if (isMockMode) {
      return NextResponse.json(mockCommunities);
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const groups = await getUserCommunities(user.id);
    return NextResponse.json(groups);
  } catch (e) {
    console.error("Error fetching communities:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (isMockMode) {
      console.log("MOCK: Created community group", body);
      return NextResponse.json({
        id: `grp-mock-${Date.now()}`,
        name: body.name,
        description: body.description,
        inviteCode: body.code,
        ownerId: "me",
        memberIds: ["me"],
        quizIds: body.quizIds,
      });
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const newGroup = await createCommunityGroup(
      body.name,
      body.description,
      body.code,
      user.id,
      body.quizIds || []
    );
    return NextResponse.json(newGroup);
  } catch (e) {
    console.error("Error creating community:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
