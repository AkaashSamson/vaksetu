-- 1. Drop type column from public.quiz table if it exists
ALTER TABLE public.quiz DROP COLUMN IF EXISTS type;

-- 2. Truncate quiz table (with cascade to delete linked attempts/group-quizzes cleanly)
TRUNCATE TABLE public.quiz CASCADE;

-- 3. Insert 5 high-quality hybrid quizzes with the correct question-level type structure
INSERT INTO public.quiz (id, title, description, difficulty, content, created_by) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Numbers Challenge',
  'Master signing numbers 1-9 with mixed visual identification drills.',
  'EASY',
  '{
    "questions": [
      {"q_no": 1, "type": "image_mcq", "q_text": "Identify the correct sign for ''1''", "q_gloss_id": 1, "options": [1, 2, 3, 4]},
      {"q_no": 2, "type": "sign_mcq", "q_gloss_id": 3, "options": [3, 5, 2, 6]},
      {"q_no": 3, "type": "image_mcq", "q_text": "Identify the correct sign for ''5''", "q_gloss_id": 5, "options": [7, 5, 8, 9]},
      {"q_no": 4, "type": "sign_mcq", "q_gloss_id": 7, "options": [6, 8, 7, 1]},
      {"q_no": 5, "type": "image_mcq", "q_text": "Identify the correct sign for ''9''", "q_gloss_id": 9, "options": [9, 8, 6, 2]},
      {"q_no": 6, "type": "sign_mcq", "q_gloss_id": 2, "options": [1, 2, 4, 3]}
    ]
  }',
  '00000000-0000-0000-0000-000000000000'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Alphabet Discovery Part 1',
  'Learn and test letters A to H with an interactive blend of sign and text matchers.',
  'EASY',
  '{
    "questions": [
      {"q_no": 1, "type": "image_mcq", "q_text": "Identify the correct sign for ''A''", "q_gloss_id": 10, "options": [10, 11, 12, 13]},
      {"q_no": 2, "type": "sign_mcq", "q_gloss_id": 11, "options": [14, 12, 11, 10]},
      {"q_no": 3, "type": "image_mcq", "q_text": "Identify the correct sign for ''C''", "q_gloss_id": 12, "options": [15, 12, 13, 11]},
      {"q_no": 4, "type": "sign_mcq", "q_gloss_id": 14, "options": [14, 15, 16, 17]},
      {"q_no": 5, "type": "image_mcq", "q_text": "Identify the correct sign for ''F''", "q_gloss_id": 15, "options": [13, 10, 17, 15]},
      {"q_no": 6, "type": "sign_mcq", "q_gloss_id": 17, "options": [11, 17, 12, 16]}
    ]
  }',
  '00000000-0000-0000-0000-000000000000'
),
(
  '33333333-3333-3333-3333-333333333333',
  'Alphabet Discovery Part 2',
  'Level up your fluency with letters I to P in a dynamic test environment.',
  'EASY',
  '{
    "questions": [
      {"q_no": 1, "type": "image_mcq", "q_text": "Identify the correct sign for ''I''", "q_gloss_id": 18, "options": [18, 19, 20, 21]},
      {"q_no": 2, "type": "sign_mcq", "q_gloss_id": 20, "options": [22, 20, 24, 25]},
      {"q_no": 3, "type": "image_mcq", "q_text": "Identify the correct sign for ''L''", "q_gloss_id": 21, "options": [21, 23, 19, 20]},
      {"q_no": 4, "type": "sign_mcq", "q_gloss_id": 23, "options": [22, 23, 24, 25]},
      {"q_no": 5, "type": "image_mcq", "q_text": "Identify the correct sign for ''O''", "q_gloss_id": 24, "options": [18, 20, 24, 21]},
      {"q_no": 6, "type": "sign_mcq", "q_gloss_id": 25, "options": [25, 23, 21, 19]}
    ]
  }',
  '00000000-0000-0000-0000-000000000000'
),
(
  '44444444-4444-4444-4444-444444444444',
  'Conversational Alphanumeric Mix',
  'An intermediate practice set blending basic numbers and letters Q to Z.',
  'MEDIUM',
  '{
    "questions": [
      {"q_no": 1, "type": "image_mcq", "q_text": "Identify the correct sign for ''Q''", "q_gloss_id": 26, "options": [26, 27, 28, 29]},
      {"q_no": 2, "type": "sign_mcq", "q_gloss_id": 28, "options": [30, 28, 26, 31]},
      {"q_no": 3, "type": "image_mcq", "q_text": "Identify the correct sign for ''5''", "q_gloss_id": 5, "options": [5, 4, 3, 6]},
      {"q_no": 4, "type": "sign_mcq", "q_gloss_id": 30, "options": [29, 31, 30, 32]},
      {"q_no": 5, "type": "image_mcq", "q_text": "Identify the correct sign for ''W''", "q_gloss_id": 32, "options": [32, 33, 34, 35]},
      {"q_no": 6, "type": "sign_mcq", "q_gloss_id": 34, "options": [33, 34, 35, 30]}
    ]
  }',
  '00000000-0000-0000-0000-000000000000'
),
(
  '55555555-5555-5555-5555-555555555555',
  'Ultimate Sign Mastery Drill',
  'The ultimate 8-question hybrid exam testing numbers and the entire alphabet.',
  'HARD',
  '{
    "questions": [
      {"q_no": 1, "type": "image_mcq", "q_text": "Identify the correct sign for ''A''", "q_gloss_id": 10, "options": [10, 20, 30, 1]},
      {"q_no": 2, "type": "sign_mcq", "q_gloss_id": 35, "options": [35, 34, 33, 32]},
      {"q_no": 3, "type": "image_mcq", "q_text": "Identify the correct sign for ''9''", "q_gloss_id": 9, "options": [9, 8, 7, 6]},
      {"q_no": 4, "type": "sign_mcq", "q_gloss_id": 22, "options": [22, 23, 24, 25]},
      {"q_no": 5, "type": "image_mcq", "q_text": "Identify the correct sign for ''G''", "q_gloss_id": 16, "options": [16, 17, 18, 19]},
      {"q_no": 6, "type": "sign_mcq", "q_gloss_id": 29, "options": [27, 28, 29, 30]},
      {"q_no": 7, "type": "image_mcq", "q_text": "Identify the correct sign for ''3''", "q_gloss_id": 3, "options": [3, 2, 1, 4]},
      {"q_no": 8, "type": "sign_mcq", "q_gloss_id": 33, "options": [33, 31, 32, 34]}
    ]
  }',
  '00000000-0000-0000-0000-000000000000'
);

-- 4. Re-link these quizzes to the onboarding group if it exists
INSERT INTO public.quiz_group (quiz_id, group_id, active_this_week)
SELECT q.id, g.id, true
FROM public.quiz q, public.user_group g
WHERE g.name = 'default_global'
ON CONFLICT DO NOTHING;
