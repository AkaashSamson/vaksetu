-- Migration file to add attempt_number and time_taken columns to quiz_attempt table
ALTER TABLE "public"."quiz_attempt" ADD COLUMN IF NOT EXISTS "attempt_number" integer DEFAULT 1;
ALTER TABLE "public"."quiz_attempt" ADD COLUMN IF NOT EXISTS "time_taken" integer DEFAULT 0 NOT NULL;
