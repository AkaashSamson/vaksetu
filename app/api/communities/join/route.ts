import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { joinCommunityWithCode } from '@/lib/db/queries/communities';
import { isMockMode } from '@/lib/env';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (isMockMode) {
            console.log("MOCK: Joined community via code", body.code);
            return NextResponse.json({ ok: true, groupId: "grp-mock" });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const result = await joinCommunityWithCode(body.code, user.id);
        
        if (!result.ok) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (e) {
        console.error("Error joining community:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
