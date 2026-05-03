-- supabase/snippets/add_quiz_group.sql

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

-- 3. Mock data: Link all current quizzes to the dummy 'Sign Language Beginners' group
-- (We use the UUID of the group we seeded earlier)
INSERT INTO public.quiz_group (quiz_id, group_id, active_this_week)
SELECT id, '11111111-1111-1111-1111-111111111111', TRUE
FROM public.quiz
ON CONFLICT DO NOTHING;
