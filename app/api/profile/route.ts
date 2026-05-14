import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { userProfile } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [profile] = await db
            .select()
            .from(userProfile)
            .where(eq(userProfile.id, user.id))
            .limit(1);

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        return NextResponse.json(profile);
    } catch (e: any) {
        console.error('Error fetching profile:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { fullName, contactNo, bioDescription } = body;

        const [updatedProfile] = await db
            .update(userProfile)
            .set({
                fullName,
                contactNo,
                bioDescription,
            })
            .where(eq(userProfile.id, user.id))
            .returning();

        if (!updatedProfile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // We also want to update Supabase Auth metadata for consistency (optional but recommended)
        await supabase.auth.updateUser({
            data: { full_name: fullName }
        });

        return NextResponse.json(updatedProfile);
    } catch (e: any) {
        console.error('Error updating profile:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
