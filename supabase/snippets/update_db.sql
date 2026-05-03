-- supabase/snippets/update_db.sql

-- 1. Create quiz_group table
CREATE TABLE IF NOT EXISTS public.quiz_group (
  quiz_id UUID REFERENCES public.quiz(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.user_group(id) ON DELETE CASCADE,
  date_added TIMESTAMPTZ DEFAULT NOW(),
  active_this_week BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (quiz_id, group_id)
);

-- 2. Add attempt_number to quiz_attempt
ALTER TABLE public.quiz_attempt
ADD COLUMN IF NOT EXISTS attempt_number INTEGER DEFAULT 1;

-- 3. Drop group_id from quiz_attempt
ALTER TABLE public.quiz_attempt
DROP COLUMN IF EXISTS group_id CASCADE;
