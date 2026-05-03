-- supabase/snippets/seed_leaderboard.sql
-- Run this script to populate mock data for leaderboard testing

-- 1. Create a new dummy group
INSERT INTO public.user_group (id, name, description, invite_code, is_default, created_by)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Sign Language Beginners',
  'A group for beginners learning sign language together.',
  'BEGINNER2026',
  FALSE,
  '00000000-0000-0000-0000-000000000000' -- System Admin
) ON CONFLICT DO NOTHING;

-- 2. Add users to the group (Admin, Alice, Bob)
INSERT INTO public.group_member (group_id, user_id, role)
SELECT '11111111-1111-1111-1111-111111111111', id, 'member'
FROM public.user_profile
ON CONFLICT (group_id, user_id) DO NOTHING;

-- 3. Add mock quiz attempts with random scores for users
DO $$
DECLARE
    user_record RECORD;
    group_record RECORD;
    quiz_record RECORD;
BEGIN
    FOR user_record IN SELECT id FROM public.user_profile LOOP
        FOR group_record IN SELECT group_id FROM public.group_member WHERE user_id = user_record.id LOOP
            FOR quiz_record IN SELECT id FROM public.quiz LIMIT 3 LOOP
                INSERT INTO public.quiz_attempt (quiz_id, user_id, group_id, total_score)
                VALUES (
                    quiz_record.id,
                    user_record.id,
                    group_record.group_id,
                    floor(random() * 100 + 1) -- Random score between 1 and 100
                );
            END LOOP;
        END LOOP;
    END LOOP;
END $$;
