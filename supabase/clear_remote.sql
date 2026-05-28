-- Truncate all public and auth tables to prepare for a clean local data sync
BEGIN;

SET session_replication_role = replica;

TRUNCATE TABLE 
    "public"."group_member",
    "public"."quiz_group",
    "public"."quiz_attempt",
    "public"."quiz",
    "public"."user_group",
    "public"."user_profile",
    "public"."learning_resource",
    "public"."glosses",
    "auth"."refresh_tokens",
    "auth"."mfa_amr_claims",
    "auth"."sessions",
    "auth"."identities",
    "auth"."users",
    "auth"."audit_log_entries"
    CASCADE;

COMMIT;
