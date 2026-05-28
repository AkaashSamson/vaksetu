-- Migration to align the schema history with the local database (adding quiz_group, updating group_member / user_group)

ALTER TABLE "public"."quiz_attempt" DROP CONSTRAINT IF EXISTS "quiz_attempt_group_id_fkey";

CREATE TABLE IF NOT EXISTS "public"."quiz_group" (
    "quiz_id" uuid NOT NULL,
    "group_id" uuid NOT NULL,
    "date_added" timestamp with time zone DEFAULT now(),
    "active_this_week" boolean DEFAULT true
);

ALTER TABLE "public"."group_member" ADD COLUMN IF NOT EXISTS "all_time_score" integer NOT NULL DEFAULT 0;
ALTER TABLE "public"."group_member" ADD COLUMN IF NOT EXISTS "weekly_last_updated" timestamp with time zone NOT NULL DEFAULT now();
ALTER TABLE "public"."group_member" ADD COLUMN IF NOT EXISTS "weekly_score" integer NOT NULL DEFAULT 0;

ALTER TABLE "public"."quiz_attempt" DROP COLUMN IF EXISTS "group_id";

ALTER TABLE "public"."user_group" ADD COLUMN IF NOT EXISTS "is_public" boolean DEFAULT true;
ALTER TABLE "public"."user_group" ADD COLUMN IF NOT EXISTS "last_weekly_reset" timestamp with time zone NOT NULL DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS quiz_group_pkey ON public.quiz_group USING btree (quiz_id, group_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'quiz_group_pkey'
    ) THEN
        ALTER TABLE "public"."quiz_group" ADD CONSTRAINT "quiz_group_pkey" PRIMARY KEY USING INDEX "quiz_group_pkey";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'quiz_group_group_id_fkey'
    ) THEN
        ALTER TABLE "public"."quiz_group" ADD CONSTRAINT "quiz_group_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.user_group(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'quiz_group_quiz_id_fkey'
    ) THEN
        ALTER TABLE "public"."quiz_group" ADD CONSTRAINT "quiz_group_quiz_id_fkey" FOREIGN KEY (quiz_id) REFERENCES public.quiz(id) ON DELETE CASCADE;
    END IF;
END $$;

GRANT DELETE ON TABLE "public"."quiz_group" TO "anon";
GRANT INSERT ON TABLE "public"."quiz_group" TO "anon";
GRANT REFERENCES ON TABLE "public"."quiz_group" TO "anon";
GRANT SELECT ON TABLE "public"."quiz_group" TO "anon";
GRANT TRIGGER ON TABLE "public"."quiz_group" TO "anon";
GRANT TRUNCATE ON TABLE "public"."quiz_group" TO "anon";
GRANT UPDATE ON TABLE "public"."quiz_group" TO "anon";

GRANT DELETE ON TABLE "public"."quiz_group" TO "authenticated";
GRANT INSERT ON TABLE "public"."quiz_group" TO "authenticated";
GRANT REFERENCES ON TABLE "public"."quiz_group" TO "authenticated";
GRANT SELECT ON TABLE "public"."quiz_group" TO "authenticated";
GRANT TRIGGER ON TABLE "public"."quiz_group" TO "authenticated";
GRANT TRUNCATE ON TABLE "public"."quiz_group" TO "authenticated";
GRANT UPDATE ON TABLE "public"."quiz_group" TO "authenticated";

GRANT DELETE ON TABLE "public"."quiz_group" TO "service_role";
GRANT INSERT ON TABLE "public"."quiz_group" TO "service_role";
GRANT REFERENCES ON TABLE "public"."quiz_group" TO "service_role";
GRANT SELECT ON TABLE "public"."quiz_group" TO "service_role";
GRANT TRIGGER ON TABLE "public"."quiz_group" TO "service_role";
GRANT TRUNCATE ON TABLE "public"."quiz_group" TO "service_role";
GRANT UPDATE ON TABLE "public"."quiz_group" TO "service_role";
