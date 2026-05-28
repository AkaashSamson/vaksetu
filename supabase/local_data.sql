SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict IWT8HEpSbK5GRHY392TY0RbI4Rj3tGsuYSMEhvYS9iBXybAWRmYD5iCX8BexqWP

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'dbf5d48e-00d5-431f-8864-d7848ceba8b7', '{"action":"user_signedup","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-04-16 16:44:07.423556+00', ''),
	('00000000-0000-0000-0000-000000000000', '93f47422-ca30-4413-a11e-95f2c358ec43', '{"action":"login","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-16 16:44:07.439777+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d1ce2f7-7fcc-4b11-9a39-49e213106700', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-16 18:04:21.233999+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b10913ff-f6d7-41f1-a160-dbee1165ec84', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-16 18:04:21.241778+00', ''),
	('00000000-0000-0000-0000-000000000000', '39319e2c-ccb7-4497-81b4-44df2ed17304', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-16 19:07:36.616876+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d5e63fa-8917-4a23-82ed-9a0fb5f1a87c', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-16 19:07:36.62304+00', ''),
	('00000000-0000-0000-0000-000000000000', '412c4da7-1368-42be-8604-77bb040eb1fb', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 04:49:12.336654+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7977516-6a5c-415c-95ec-206585d02d01', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 04:49:12.340611+00', ''),
	('00000000-0000-0000-0000-000000000000', '5f24a94e-178d-4b7a-bfd2-4a670dac0835', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 06:08:14.01774+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ad3b88ff-7154-430a-9652-c9138eafde20', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 06:08:14.027781+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ad3c19a-986f-4c73-873c-6ae89538f1cd', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 07:21:21.277878+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b6d9114e-adc3-4faf-ae69-19b2eb255dae', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 07:21:21.280801+00', ''),
	('00000000-0000-0000-0000-000000000000', '50d52987-1a43-47aa-b617-4e659e6378b8', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 09:34:58.219197+00', ''),
	('00000000-0000-0000-0000-000000000000', '211392de-18e2-4bd2-8771-adbbc45d5144', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 09:34:58.22693+00', ''),
	('00000000-0000-0000-0000-000000000000', '84b706df-728a-485c-a443-a5143f1a06e5', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 10:48:55.868235+00', ''),
	('00000000-0000-0000-0000-000000000000', '21359394-10fa-4b05-a437-df53438eef69', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 10:48:55.874801+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fbe7b68a-7194-4326-b48f-567a0266f34d', '{"action":"login","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-03 12:43:06.286215+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0465b6c-3296-47bb-998b-91282c79e432', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-03 14:00:29.720697+00', ''),
	('00000000-0000-0000-0000-000000000000', '63620cd6-04d5-4e34-a6cf-b2a8138628c3', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-03 14:00:29.724016+00', ''),
	('00000000-0000-0000-0000-000000000000', '2dff33fe-cead-4010-aa1f-605e64a31ecd', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-03 15:15:40.73241+00', ''),
	('00000000-0000-0000-0000-000000000000', '0727d550-5100-4f57-8813-457043e7287d', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-03 15:15:40.736798+00', ''),
	('00000000-0000-0000-0000-000000000000', '760abcff-f271-4fdd-986e-341e458448cd', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-08 06:42:35.886965+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d4ab02d-7dd8-43cc-a46b-2994d80fad0e', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-08 06:42:35.895117+00', ''),
	('00000000-0000-0000-0000-000000000000', '8058f9fd-04d3-4fb7-8ee1-59037599fc30', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-08 07:43:51.390264+00', ''),
	('00000000-0000-0000-0000-000000000000', '83a99da7-bb78-4ac5-a0cb-7f6992dd26f7', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-08 07:43:51.395924+00', ''),
	('00000000-0000-0000-0000-000000000000', '87063237-c934-4678-8457-c82fb59655f0', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-13 18:30:26.201625+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dde601cb-7fc6-45a5-ab6a-f51680aa64c8', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-13 18:30:26.20397+00', ''),
	('00000000-0000-0000-0000-000000000000', '9c3d3dde-fa9d-4df5-adb5-85aa02c7eed8', '{"action":"logout","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-13 18:46:03.920288+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fe346f70-5985-4fcb-8953-554e64a38b8b', '{"action":"login","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-13 18:48:23.952311+00', ''),
	('00000000-0000-0000-0000-000000000000', '6655efdf-28ef-4c37-9032-be9cfc94a09c', '{"action":"user_modified","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-05-13 19:13:19.848947+00', ''),
	('00000000-0000-0000-0000-000000000000', '80de8f0b-0bed-4830-b7f7-93dcd320e347', '{"action":"login","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-14 10:47:20.725348+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a192442-6163-4b70-bc00-2f33b57ba52b', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-18 12:43:08.49182+00', ''),
	('00000000-0000-0000-0000-000000000000', '1462c247-fb16-4043-85cd-b5122dcc390b', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-18 12:43:08.496004+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bb1a2572-98b0-4d9f-bdeb-5fdf662732ea', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-18 13:06:28.162057+00', ''),
	('00000000-0000-0000-0000-000000000000', '6aaf97b0-3a24-430b-90d8-ee1d9cd267f0', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-19 06:37:36.895417+00', ''),
	('00000000-0000-0000-0000-000000000000', '56d41260-d1b1-4641-8622-466519de90c8', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-19 06:37:36.899423+00', ''),
	('00000000-0000-0000-0000-000000000000', '4f992d18-9ffa-4a1f-82ba-5039388921c8', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-19 06:38:22.8941+00', ''),
	('00000000-0000-0000-0000-000000000000', '5ba6de98-708d-4796-b119-14529362a136', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-19 07:46:13.430832+00', ''),
	('00000000-0000-0000-0000-000000000000', '61b50b03-1bb6-41db-8c26-b370b0234f73', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-19 07:46:13.438843+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a7950d25-165e-4c1b-8a5a-7eed6949afe4', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-20 05:02:59.911093+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc6b0730-85db-479e-95c9-1dbcd8baed19', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-20 05:02:59.91572+00', ''),
	('00000000-0000-0000-0000-000000000000', '6fa518e5-6b62-4999-986d-bbd0c16f9ea7', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-22 04:49:27.414146+00', ''),
	('00000000-0000-0000-0000-000000000000', 'acac49f5-96f9-465a-8b69-0dd6c95c4fb8', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-22 04:49:27.417871+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6aa5d3e-8b40-4e1f-8352-7532528c2bb9', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-22 05:50:31.828878+00', ''),
	('00000000-0000-0000-0000-000000000000', '356688eb-6873-4085-81c6-8bc7ddac9362', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-22 05:50:31.833213+00', ''),
	('00000000-0000-0000-0000-000000000000', '117e6979-a38e-41fb-9870-408f4ddffa5c', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-22 06:50:16.375173+00', ''),
	('00000000-0000-0000-0000-000000000000', '7670bbd7-d27b-4991-979b-6e4a409bd840', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-22 06:50:16.378122+00', ''),
	('00000000-0000-0000-0000-000000000000', 'efc881c8-4746-4fc5-b5e9-5b3ccdf07c32', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-22 07:49:36.069441+00', ''),
	('00000000-0000-0000-0000-000000000000', '216a3f13-6505-4dce-867d-2249c12c724e', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-22 07:49:36.073055+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c1febb0-6055-4ce3-88c6-5a26d4eba61e', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-22 09:00:57.274718+00', ''),
	('00000000-0000-0000-0000-000000000000', '228de4b9-6515-46e8-b176-9103d3f73166', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-22 09:00:57.279146+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6a934cb-1d71-453d-a543-a3fcd11e8001', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-22 09:00:58.149496+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a51d1d6f-17e3-4bc8-b0b0-a98e0adffe42', '{"action":"user_modified","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-05-22 09:48:31.161876+00', ''),
	('00000000-0000-0000-0000-000000000000', '9b9b2a0c-70da-46df-b232-3de77051afca', '{"action":"logout","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-22 09:48:37.751622+00', ''),
	('00000000-0000-0000-0000-000000000000', 'afaf25ec-451e-4d07-bf54-4cf454f0bc92', '{"action":"user_signedup","actor_id":"2bac4e32-222f-47b2-b7d1-33a7680318d7","actor_name":"Mr. Patrick","actor_username":"patrick@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-05-22 09:56:17.918046+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c9bc643-2f60-48f4-a6d5-6a382f86581b', '{"action":"login","actor_id":"2bac4e32-222f-47b2-b7d1-33a7680318d7","actor_name":"Mr. Patrick","actor_username":"patrick@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-22 09:56:17.93167+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c5f89088-e4d6-46c9-8206-edf1a50e7a53', '{"action":"logout","actor_id":"2bac4e32-222f-47b2-b7d1-33a7680318d7","actor_name":"Mr. Patrick","actor_username":"patrick@test.com","actor_via_sso":false,"log_type":"account"}', '2026-05-22 10:12:19.534944+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8ec04f9-faae-4039-84fc-6f7739f1ac4d', '{"action":"login","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-22 10:12:25.048025+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b9f01fce-1101-40e9-bce3-858f27c489d3', '{"action":"logout","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-22 10:13:33.380899+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c765bda3-27e9-42b9-9666-40b31d5af650', '{"action":"user_signedup","actor_id":"2a200105-bc18-46b9-b4bc-5a73ced4aded","actor_name":"Mr. Khan","actor_username":"khan@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-05-22 10:14:00.107367+00', ''),
	('00000000-0000-0000-0000-000000000000', '399af2cb-192b-4ce5-923b-57a973953acb', '{"action":"login","actor_id":"2a200105-bc18-46b9-b4bc-5a73ced4aded","actor_name":"Mr. Khan","actor_username":"khan@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-22 10:14:00.127431+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2c17e44-275d-4d66-aa69-53a961e28e2d', '{"action":"token_refreshed","actor_id":"2a200105-bc18-46b9-b4bc-5a73ced4aded","actor_name":"Mr. Khan","actor_username":"khan@test.com","actor_via_sso":false,"log_type":"token"}', '2026-05-28 10:01:22.228612+00', ''),
	('00000000-0000-0000-0000-000000000000', '08b51fde-4cc7-4c49-9bd1-a9dca0ff9a34', '{"action":"token_revoked","actor_id":"2a200105-bc18-46b9-b4bc-5a73ced4aded","actor_name":"Mr. Khan","actor_username":"khan@test.com","actor_via_sso":false,"log_type":"token"}', '2026-05-28 10:01:22.238025+00', ''),
	('00000000-0000-0000-0000-000000000000', '5f5f821a-91e6-4da7-8f34-99b44a61ed13', '{"action":"logout","actor_id":"2a200105-bc18-46b9-b4bc-5a73ced4aded","actor_name":"Mr. Khan","actor_username":"khan@test.com","actor_via_sso":false,"log_type":"account"}', '2026-05-28 10:03:11.937454+00', ''),
	('00000000-0000-0000-0000-000000000000', '34b9ee75-aab8-475d-8d72-bbb2730368ef', '{"action":"login","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-28 10:03:28.723143+00', ''),
	('00000000-0000-0000-0000-000000000000', '9fe3a8fb-d310-4b2e-9174-5532f878b373', '{"action":"token_refreshed","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-28 11:04:31.844268+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aeda2c70-009b-494c-b07d-5fe87c5de738', '{"action":"token_revoked","actor_id":"2fa311ae-cb5b-4859-a4de-9e9e7c3f121c","actor_name":"Mr. Sky","actor_username":"akaashsam22@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-28 11:04:31.847323+00', '');


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@vaksetu.com', '$2a$06$Wpigc0WTUmJPCborhlWI8uRfCRmmnL5IR3npacjarQ.nkEBJDBvCy', '2026-04-16 15:19:21.700582+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "System Admin"}', NULL, NULL, NULL, NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'fe168879-ffa6-4535-a80b-58105ccfd8f4', 'authenticated', 'authenticated', 'alice@example.com', '$2a$06$hYhTdhtKFo9874c/47LPOO2ab06CNYghBU8.wMo9mO6yfb.4cxh0y', '2026-04-16 15:19:21.700582+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Alice Test", "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"}', NULL, NULL, NULL, NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '3995ed9c-3951-4f73-85f0-10d9700c2459', 'authenticated', 'authenticated', 'bob@example.com', '$2a$06$etrQQrInU.8GaHOJiVSlS.4MPtCTkdO8w7Oiihq8DdfKKlCC3NkYS', '2026-04-16 15:19:21.700582+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Bob Test", "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"}', NULL, NULL, NULL, NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '2a200105-bc18-46b9-b4bc-5a73ced4aded', 'authenticated', 'authenticated', 'khan@test.com', '$2a$10$FmRe8mSpv6afe8NfVcTEweyxOE9AJsyFCT77wxLk8rkuZmosersX6', '2026-05-22 10:14:00.110054+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-22 10:14:00.130128+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "2a200105-bc18-46b9-b4bc-5a73ced4aded", "email": "khan@test.com", "full_name": "Mr. Khan", "email_verified": true, "phone_verified": false}', NULL, '2026-05-22 10:14:00.085817+00', '2026-05-28 10:01:22.251312+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', 'authenticated', 'authenticated', 'akaashsam22@gmail.com', '$2a$10$unOxPWTgc9ZY5HYNtgv0ROAU0dU4XzV45xhlWtBCDVAWVNWtPDTMm', '2026-04-16 16:44:07.426886+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-28 10:03:28.72569+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "2fa311ae-cb5b-4859-a4de-9e9e7c3f121c", "email": "akaashsam22@gmail.com", "full_name": "Mr. Sky", "email_verified": true, "phone_verified": false}', NULL, '2026-04-16 16:44:07.383935+00', '2026-05-28 11:04:31.852911+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '2bac4e32-222f-47b2-b7d1-33a7680318d7', 'authenticated', 'authenticated', 'patrick@test.com', '$2a$10$vxt0XdYJCgxi9Jz8DX.Dl.roIXVy0sfkRNsy7SlHbQXYSXV6PYS8y', '2026-05-22 09:56:17.91942+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-22 09:56:17.933281+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "2bac4e32-222f-47b2-b7d1-33a7680318d7", "email": "patrick@test.com", "full_name": "Mr. Patrick", "email_verified": true, "phone_verified": false}', NULL, '2026-05-22 09:56:17.874595+00', '2026-05-22 09:56:17.942887+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', '2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', '{"sub": "2fa311ae-cb5b-4859-a4de-9e9e7c3f121c", "email": "akaashsam22@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-16 16:44:07.4192+00', '2026-04-16 16:44:07.419246+00', '2026-04-16 16:44:07.419246+00', '96accfda-a366-4ad4-a3b3-4ea5d97882ad'),
	('2bac4e32-222f-47b2-b7d1-33a7680318d7', '2bac4e32-222f-47b2-b7d1-33a7680318d7', '{"sub": "2bac4e32-222f-47b2-b7d1-33a7680318d7", "email": "patrick@test.com", "full_name": "Mr. Patrick", "email_verified": false, "phone_verified": false}', 'email', '2026-05-22 09:56:17.912846+00', '2026-05-22 09:56:17.912963+00', '2026-05-22 09:56:17.912963+00', '3bb00075-4f31-4745-a6d5-7541fbf28e09'),
	('2a200105-bc18-46b9-b4bc-5a73ced4aded', '2a200105-bc18-46b9-b4bc-5a73ced4aded', '{"sub": "2a200105-bc18-46b9-b4bc-5a73ced4aded", "email": "khan@test.com", "full_name": "Mr. Khan", "email_verified": false, "phone_verified": false}', 'email', '2026-05-22 10:14:00.103235+00', '2026-05-22 10:14:00.103318+00', '2026-05-22 10:14:00.103318+00', 'c4a20368-8b40-44ab-9a3a-b41697cbe545');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('0b1c1701-ded6-4f89-a7cf-ed8415ae4af9', '2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', '2026-05-28 10:03:28.726166+00', '2026-05-28 11:04:31.856672+00', NULL, 'aal1', NULL, '2026-05-28 11:04:31.856599', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '172.19.0.1', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('0b1c1701-ded6-4f89-a7cf-ed8415ae4af9', '2026-05-28 10:03:28.735736+00', '2026-05-28 10:03:28.735736+00', 'password', 'cd247bfe-5511-4c0e-9b84-3e89f4a5f809');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 30, 'cn757tblcpjd', '2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', true, '2026-05-28 10:03:28.733083+00', '2026-05-28 11:04:31.848463+00', NULL, '0b1c1701-ded6-4f89-a7cf-ed8415ae4af9'),
	('00000000-0000-0000-0000-000000000000', 31, 'ugh2qslzqwi7', '2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', false, '2026-05-28 11:04:31.850886+00', '2026-05-28 11:04:31.850886+00', 'cn757tblcpjd', '0b1c1701-ded6-4f89-a7cf-ed8415ae4af9');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: glosses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."glosses" ("id", "gloss_name", "image_url", "gloss_descr", "gloss_tags", "created_at") VALUES
	(1, '1', '/Glosses/1.jpg', NULL, '{number,digit}', '2026-04-16 15:19:21.65399+00'),
	(2, '2', '/Glosses/2.jpg', NULL, '{number,digit}', '2026-04-16 15:19:21.65399+00'),
	(3, '3', '/Glosses/3.jpg', NULL, '{number,digit}', '2026-04-16 15:19:21.65399+00'),
	(4, '4', '/Glosses/4.jpg', NULL, '{number,digit}', '2026-04-16 15:19:21.65399+00'),
	(5, '5', '/Glosses/5.jpg', NULL, '{number,digit}', '2026-04-16 15:19:21.65399+00'),
	(6, '6', '/Glosses/6.jpg', NULL, '{number,digit}', '2026-04-16 15:19:21.65399+00'),
	(7, '7', '/Glosses/7.jpg', NULL, '{number,digit}', '2026-04-16 15:19:21.65399+00'),
	(8, '8', '/Glosses/8.jpg', NULL, '{number,digit}', '2026-04-16 15:19:21.65399+00'),
	(9, '9', '/Glosses/9.jpg', NULL, '{number,digit}', '2026-04-16 15:19:21.65399+00'),
	(10, 'A', '/Glosses/A.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(11, 'B', '/Glosses/B.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(12, 'C', '/Glosses/C.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(13, 'D', '/Glosses/D.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(14, 'E', '/Glosses/E.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(15, 'F', '/Glosses/F.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(16, 'G', '/Glosses/G.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(17, 'H', '/Glosses/H.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(18, 'I', '/Glosses/I.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(19, 'J', '/Glosses/J.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(20, 'K', '/Glosses/K.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(21, 'L', '/Glosses/L.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(22, 'M', '/Glosses/M.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(23, 'N', '/Glosses/N.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(24, 'O', '/Glosses/O.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(25, 'P', '/Glosses/P.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(26, 'Q', '/Glosses/Q.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(27, 'R', '/Glosses/R.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(28, 'S', '/Glosses/S.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(29, 'T', '/Glosses/T.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(30, 'U', '/Glosses/U.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(31, 'V', '/Glosses/V.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(32, 'W', '/Glosses/W.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(33, 'X', '/Glosses/X.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(34, 'Y', '/Glosses/Y.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00'),
	(35, 'Z', '/Glosses/Z.jpg', NULL, '{alphabet,letter}', '2026-04-16 15:19:21.65399+00');


--
-- Data for Name: user_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_profile" ("id", "full_name", "avatar_url", "email", "contact_no", "bio_description", "created_at") VALUES
	('00000000-0000-0000-0000-000000000000', 'System Admin', NULL, 'admin@vaksetu.com', NULL, 'Automated system administrator', '2026-04-16 15:19:21.700582+00'),
	('fe168879-ffa6-4535-a80b-58105ccfd8f4', 'Alice Test', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', 'alice@example.com', NULL, NULL, '2026-04-16 15:19:21.700582+00'),
	('3995ed9c-3951-4f73-85f0-10d9700c2459', 'Bob Test', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', 'bob@example.com', NULL, NULL, '2026-04-16 15:19:21.700582+00'),
	('2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', 'Mr. Sky', NULL, 'akaashsam22@gmail.com', '+91 08708 08708', 'Nice to meet you', '2026-04-16 16:44:07.381364+00'),
	('2bac4e32-222f-47b2-b7d1-33a7680318d7', 'Mr. Patrick', NULL, 'patrick@test.com', NULL, NULL, '2026-05-22 09:56:17.872438+00'),
	('2a200105-bc18-46b9-b4bc-5a73ced4aded', 'Mr. Khan', NULL, 'khan@test.com', NULL, NULL, '2026-05-22 10:14:00.084815+00');


--
-- Data for Name: user_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_group" ("id", "name", "description", "invite_code", "created_by", "is_default", "created_at", "is_public", "last_weekly_reset") VALUES
	('6ea024d6-d9c4-4f42-b8cb-bced03225d7f', 'default_global', 'The official Vak-Setu onboarding community.', 'GLOBAL2026', '00000000-0000-0000-0000-000000000000', true, '2026-04-16 15:19:21.700582+00', true, '2026-05-22 06:45:29.203571+00'),
	('41bd8a5e-a76d-43ff-982d-64cdfaa39725', 'Gen Z', 'yo guys, hope the spirit is high here..', 'PYL23B', '2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', false, '2026-05-13 18:45:05.832946+00', true, '2026-05-22 06:45:29.203571+00'),
	('d4112b66-ca49-40f4-a874-4958f790d79b', 'A New Era', 'For all who want to start something New', 'DHJI1I', '2bac4e32-222f-47b2-b7d1-33a7680318d7', false, '2026-05-22 10:11:22.134711+00', false, '2026-05-22 10:11:22.134711+00');


--
-- Data for Name: group_member; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."group_member" ("group_id", "user_id", "role", "joined_at", "weekly_score", "all_time_score", "weekly_last_updated") VALUES
	('6ea024d6-d9c4-4f42-b8cb-bced03225d7f', '00000000-0000-0000-0000-000000000000', 'admin', '2026-04-16 15:19:21.700582+00', 0, 0, '2026-05-22 06:45:29.214905+00'),
	('6ea024d6-d9c4-4f42-b8cb-bced03225d7f', 'fe168879-ffa6-4535-a80b-58105ccfd8f4', 'member', '2026-04-16 15:19:32.667816+00', 0, 0, '2026-05-22 06:45:29.214905+00'),
	('6ea024d6-d9c4-4f42-b8cb-bced03225d7f', '3995ed9c-3951-4f73-85f0-10d9700c2459', 'member', '2026-04-16 15:19:32.669538+00', 0, 0, '2026-05-22 06:45:29.214905+00'),
	('6ea024d6-d9c4-4f42-b8cb-bced03225d7f', '2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', 'member', '2026-04-16 16:44:17.525885+00', 0, 0, '2026-05-22 06:45:29.214905+00'),
	('41bd8a5e-a76d-43ff-982d-64cdfaa39725', '2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', 'admin', '2026-05-13 18:45:05.852317+00', 582, 0, '2026-05-22 07:18:09.38+00'),
	('6ea024d6-d9c4-4f42-b8cb-bced03225d7f', '2bac4e32-222f-47b2-b7d1-33a7680318d7', 'member', '2026-05-22 09:56:28.462769+00', 0, 0, '2026-05-22 09:56:28.462769+00'),
	('41bd8a5e-a76d-43ff-982d-64cdfaa39725', '2bac4e32-222f-47b2-b7d1-33a7680318d7', 'member', '2026-05-22 10:04:28.534035+00', 593, 0, '2026-05-22 10:05:12.727+00'),
	('d4112b66-ca49-40f4-a874-4958f790d79b', '2bac4e32-222f-47b2-b7d1-33a7680318d7', 'admin', '2026-05-22 10:11:22.142473+00', 0, 0, '2026-05-22 10:11:22.142473+00'),
	('d4112b66-ca49-40f4-a874-4958f790d79b', '2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', 'member', '2026-05-22 10:12:33.682048+00', 0, 0, '2026-05-22 10:12:33.682048+00'),
	('6ea024d6-d9c4-4f42-b8cb-bced03225d7f', '2a200105-bc18-46b9-b4bc-5a73ced4aded', 'member', '2026-05-22 10:14:11.025926+00', 0, 0, '2026-05-22 10:14:11.025926+00'),
	('41bd8a5e-a76d-43ff-982d-64cdfaa39725', '2a200105-bc18-46b9-b4bc-5a73ced4aded', 'member', '2026-05-22 10:18:48.950091+00', 125, 0, '2026-05-22 10:19:07.798+00');


--
-- Data for Name: learning_resource; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."learning_resource" ("id", "title", "description", "thumbnail_url", "type", "content_url", "created_at") VALUES
	('ce1be6aa-ec3f-48dd-948d-8f1e4956d071', 'ISLRTC Dictionary', 'Official Govt of India Indian Sign Language Dictionary database powered by DEPwD (Divyangjan)', 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSLYq6Rlbe_Z4MCq4APz_U3fs97ISKyLWKXFbYUUIAqNGurVA', 'web_portal', 'https://divyangjan.depwd.gov.in/islrtc/', '2026-05-19 07:19:26.148712+00'),
	('66806e6a-cb3b-418d-8ae2-a11b31be9178', 'Indian Sign Language 201', 'Indian Sign Language 201 Course Playlist', 'https://i.ytimg.com/vi/JPV-vboWfhY/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLA_xPALKRkmje1K042Cm-Nv0Kos7g', 'youtube_playlist', 'https://youtube.com/playlist?list=PLxYMaKXKMMcNfbb0sOfg5sGJCWCLyKe_K&si=E8VPdubfdDydKmBZ', '2026-05-19 07:13:50.752682+00'),
	('7acc4070-4ccf-44a5-8d1a-b28d632ea2f2', 'Indian Sign Language 101', 'Indian Sign Language 101 Course Playlist', 'https://i.ytimg.com/vi/qS2PoG0VL0I/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLB29T42OsylDGaI2l6YQFEM94jLDg', 'youtube_playlist', 'https://youtube.com/playlist?list=PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi&si=h4OqDk1aZ0PIOk5X', '2026-05-19 07:13:50.752682+00'),
	('8449fcc2-9c8a-4345-8334-7e3e41cd30dd', 'Goa Board of Education Dictionary', 'Goa Board of Education Official YouTube Channel Dictionary', 'https://i.ytimg.com/vi/sbENF6dw2FM/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCl2NNJJM_zXfqa5w0t6GMSqnRSlQ', 'youtube_channel', 'https://youtube.com/@goaboardofeducation?si=GziZoqrqBIlueYXk', '2026-05-19 07:13:50.752682+00'),
	('b4afce30-6b77-4bcc-bcf5-3c7ffd09b95b', 'ISLRTC Youtube Channel', 'Official YouTube Channel of Indian Sign Language Research and Training Centre', 'https://i.ytimg.com/vi/5PF6JXzYyUI/hqdefault.jpg?sqp=-oaymwExCNACELwBSFryq4qpAyMIARUAAIhCGAHwAQH4Af4JgALQBYoCDAgAEAEYZSBlKGUwDw==&rs=AOn4CLAD4bRytdFnJXZEncK4PB0VAs8MFw', 'youtube_channel', 'https://youtube.com/@islrtc?si=mG5LacHlNBCeibZi', '2026-05-19 07:19:26.148712+00');


--
-- Data for Name: quiz; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quiz" ("id", "title", "description", "difficulty", "created_by", "content", "created_at", "type") VALUES
	('87cc7edd-7b07-4d76-8b8a-8d70294cbb11', 'Number Quiz 1', 'Practice session', 'EASY', '00000000-0000-0000-0000-000000000000', '{"questions": [{"q_no": 1, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [25, 12, 34, 19], "q_gloss_id": 34}, {"q_no": 2, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [10, 7, 4, 6], "q_gloss_id": 7}, {"q_no": 3, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [18, 8, 19, 6], "q_gloss_id": 6}, {"q_no": 4, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [23, 11, 22, 13], "q_gloss_id": 13}, {"q_no": 5, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [1, 24, 5, 22], "q_gloss_id": 24}, {"q_no": 6, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [19, 3, 5, 17], "q_gloss_id": 3}]}', '2026-04-16 15:19:21.700582+00', 'image_mcq'),
	('5dea11e3-1f9e-485f-a642-19ce312b16d2', 'Number Quiz 2', 'Practice session', 'EASY', '00000000-0000-0000-0000-000000000000', '{"questions": [{"q_no": 1, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [15, 10, 21, 33], "q_gloss_id": 21}, {"q_no": 2, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [14, 6, 31, 21], "q_gloss_id": 6}, {"q_no": 3, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [19, 17, 14, 31], "q_gloss_id": 17}, {"q_no": 4, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [27, 2, 31, 6], "q_gloss_id": 2}, {"q_no": 5, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [4, 11, 12, 3], "q_gloss_id": 4}, {"q_no": 6, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [11, 14, 3, 15], "q_gloss_id": 3}]}', '2026-04-16 15:19:21.700582+00', 'image_mcq'),
	('4dcdcac7-a64c-4dcb-aaa9-2ea4f7353631', 'Alpha Mix', 'Practice session', 'EASY', '00000000-0000-0000-0000-000000000000', '{"questions": [{"q_no": 1, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [19, 13, 28, 16], "q_gloss_id": 13}, {"q_no": 2, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [3, 30, 9, 17], "q_gloss_id": 17}, {"q_no": 3, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [10, 21, 29, 23], "q_gloss_id": 10}, {"q_no": 4, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [32, 8, 29, 13], "q_gloss_id": 29}, {"q_no": 5, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [10, 5, 20, 7], "q_gloss_id": 7}, {"q_no": 6, "q_text": "Identify the correct sign", "q_type": "image_mcq", "options": [11, 9, 7, 15], "q_gloss_id": 15}]}', '2026-04-16 15:19:21.700582+00', 'image_mcq'),
	('ced0e167-6d40-477a-a7cb-6d1930913f40', 'Sign Matcher 1', 'Practice session', 'EASY', '00000000-0000-0000-0000-000000000000', '{"questions": [{"q_no": 1, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [25, 33, 26, 30], "q_gloss_id": 26}, {"q_no": 2, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [32, 31, 6, 34], "q_gloss_id": 32}, {"q_no": 3, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [22, 15, 7, 9], "q_gloss_id": 22}, {"q_no": 4, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [20, 19, 10, 7], "q_gloss_id": 20}, {"q_no": 5, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [25, 2, 11, 24], "q_gloss_id": 2}, {"q_no": 6, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [6, 5, 34, 15], "q_gloss_id": 6}]}', '2026-04-16 15:19:21.700582+00', 'image_mcq'),
	('7529b5dc-5fa7-45b1-88be-92eee0c09e10', 'Sign Matcher 2', 'Practice session', 'EASY', '00000000-0000-0000-0000-000000000000', '{"questions": [{"q_no": 1, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [17, 15, 16, 14], "q_gloss_id": 17}, {"q_no": 2, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [11, 18, 8, 14], "q_gloss_id": 11}, {"q_no": 3, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [5, 1, 13, 23], "q_gloss_id": 23}, {"q_no": 4, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [30, 6, 19, 15], "q_gloss_id": 30}, {"q_no": 5, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [4, 15, 19, 33], "q_gloss_id": 4}, {"q_no": 6, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [17, 18, 13, 11], "q_gloss_id": 18}]}', '2026-04-16 15:19:21.700582+00', 'image_mcq'),
	('50523d8a-79e1-4208-926d-0d4f4d61cef1', 'Foundational Mix', 'Practice session', 'EASY', '00000000-0000-0000-0000-000000000000', '{"questions": [{"q_no": 1, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [29, 33, 15, 35], "q_gloss_id": 35}, {"q_no": 2, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [1, 9, 20, 7], "q_gloss_id": 20}, {"q_no": 3, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [5, 8, 35, 22], "q_gloss_id": 22}, {"q_no": 4, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [1, 14, 4, 9], "q_gloss_id": 1}, {"q_no": 5, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [4, 33, 30, 25], "q_gloss_id": 25}, {"q_no": 6, "q_text": "Identify the correct sign", "q_type": "sign_mcq", "options": [29, 30, 25, 5], "q_gloss_id": 30}]}', '2026-04-16 15:19:21.700582+00', 'image_mcq'),
	('e5bff840-bf57-472e-ab13-a30a6956d71d', 'Beginner Numbers 1', 'Basic number practice', 'EASY', '00000000-0000-0000-0000-000000000000', '{"questions": [{"q_no": 1, "q_text": "Identify the correct sign", "options": [28, 30, 8, 6], "q_gloss_id": 6}, {"q_no": 2, "q_text": "Identify the correct sign", "options": [16, 9, 5, 28], "q_gloss_id": 28}, {"q_no": 3, "q_text": "Identify the correct sign", "options": [7, 8, 14, 25], "q_gloss_id": 25}, {"q_no": 4, "q_text": "Identify the correct sign", "options": [4, 31, 10, 32], "q_gloss_id": 32}, {"q_no": 5, "q_text": "Identify the correct sign", "options": [3, 20, 25, 10], "q_gloss_id": 20}, {"q_no": 6, "q_text": "Identify the correct sign", "options": [35, 26, 12, 14], "q_gloss_id": 35}]}', '2026-04-16 15:19:21.700582+00', 'image_mcq'),
	('b33ee41f-6a00-460a-8d9d-48750d1a3ef1', 'Beginner Numbers 2', 'More basic number practice', 'EASY', '00000000-0000-0000-0000-000000000000', '{"questions": [{"q_no": 1, "q_text": "Identify the correct sign", "options": [23, 25, 30, 6], "q_gloss_id": 25}, {"q_no": 2, "q_text": "Identify the correct sign", "options": [2, 10, 4, 24], "q_gloss_id": 10}, {"q_no": 3, "q_text": "Identify the correct sign", "options": [33, 12, 32, 7], "q_gloss_id": 33}, {"q_no": 4, "q_text": "Identify the correct sign", "options": [19, 26, 31, 32], "q_gloss_id": 19}, {"q_no": 5, "q_text": "Identify the correct sign", "options": [24, 12, 25, 35], "q_gloss_id": 35}, {"q_no": 6, "q_text": "Identify the correct sign", "options": [14, 6, 5, 12], "q_gloss_id": 6}]}', '2026-04-16 15:19:21.700582+00', 'image_mcq'),
	('6648e5ac-e430-4b90-8631-d72d739eb073', 'Alphabet Intro 1', 'Starting with letters', 'EASY', '00000000-0000-0000-0000-000000000000', '{"questions": [{"q_no": 1, "q_text": "Identify the correct sign", "options": [6, 3, 28, 20], "q_gloss_id": 3}, {"q_no": 2, "q_text": "Identify the correct sign", "options": [6, 11, 30, 12], "q_gloss_id": 12}, {"q_no": 3, "q_text": "Identify the correct sign", "options": [32, 28, 24, 8], "q_gloss_id": 32}, {"q_no": 4, "q_text": "Identify the correct sign", "options": [1, 4, 15, 20], "q_gloss_id": 1}, {"q_no": 5, "q_text": "Identify the correct sign", "options": [25, 2, 16, 20], "q_gloss_id": 20}, {"q_no": 6, "q_text": "Identify the correct sign", "options": [30, 34, 16, 9], "q_gloss_id": 9}]}', '2026-04-16 15:19:21.700582+00', 'image_mcq'),
	('a26d4f3e-1925-40c9-814c-023e95e01ae6', 'Sign Matcher 1', 'Sign recognition basics', 'EASY', '00000000-0000-0000-0000-000000000000', '{"questions": [{"q_no": 1, "q_text": "Identify the correct sign", "options": [15, 35, 6, 28], "q_gloss_id": 6}, {"q_no": 2, "q_text": "Identify the correct sign", "options": [8, 2, 27, 28], "q_gloss_id": 8}, {"q_no": 3, "q_text": "Identify the correct sign", "options": [33, 9, 26, 25], "q_gloss_id": 25}, {"q_no": 4, "q_text": "Identify the correct sign", "options": [5, 1, 2, 32], "q_gloss_id": 2}, {"q_no": 5, "q_text": "Identify the correct sign", "options": [25, 5, 27, 4], "q_gloss_id": 27}, {"q_no": 6, "q_text": "Identify the correct sign", "options": [33, 8, 6, 24], "q_gloss_id": 33}]}', '2026-04-16 15:19:21.700582+00', 'sign_mcq'),
	('443871d6-6494-4bab-b771-5c0a1ba8184f', 'Sign Matcher 2', 'Quick sign identification', 'EASY', '00000000-0000-0000-0000-000000000000', '{"questions": [{"q_no": 1, "q_text": "Identify the correct sign", "options": [12, 25, 32, 14], "q_gloss_id": 12}, {"q_no": 2, "q_text": "Identify the correct sign", "options": [2, 7, 4, 34], "q_gloss_id": 7}, {"q_no": 3, "q_text": "Identify the correct sign", "options": [29, 12, 15, 19], "q_gloss_id": 15}, {"q_no": 4, "q_text": "Identify the correct sign", "options": [6, 16, 2, 10], "q_gloss_id": 2}, {"q_no": 5, "q_text": "Identify the correct sign", "options": [30, 17, 29, 34], "q_gloss_id": 34}, {"q_no": 6, "q_text": "Identify the correct sign", "options": [1, 20, 2, 9], "q_gloss_id": 9}]}', '2026-04-16 15:19:21.700582+00', 'sign_mcq'),
	('12018281-c4e9-4cf6-8ed0-1f4f28c6a787', 'Foundational Mix', 'Mixed alphanumeric basics', 'EASY', '00000000-0000-0000-0000-000000000000', '{"questions": [{"q_no": 1, "q_text": "Identify the correct sign", "options": [25, 16, 24, 31], "q_gloss_id": 24}, {"q_no": 2, "q_text": "Identify the correct sign", "options": [25, 35, 18, 15], "q_gloss_id": 15}, {"q_no": 3, "q_text": "Identify the correct sign", "options": [16, 22, 31, 23], "q_gloss_id": 16}, {"q_no": 4, "q_text": "Identify the correct sign", "options": [27, 23, 17, 25], "q_gloss_id": 17}, {"q_no": 5, "q_text": "Identify the correct sign", "options": [14, 9, 35, 12], "q_gloss_id": 35}, {"q_no": 6, "q_text": "Identify the correct sign", "options": [6, 10, 34, 7], "q_gloss_id": 6}]}', '2026-04-16 15:19:21.700582+00', 'sign_mcq');


--
-- Data for Name: quiz_attempt; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quiz_attempt" ("id", "quiz_id", "user_id", "started_at", "completed_at", "total_score", "response", "attempt_number", "time_taken") VALUES
	('fc3c2ec0-c0e7-4bfc-b4be-9af286df6923', '4dcdcac7-a64c-4dcb-aaa9-2ea4f7353631', '2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', '2026-05-22 07:01:21.38369+00', '2026-05-22 07:01:21.377+00', 3, '{"1": 19, "2": 17, "3": 29, "4": 8, "5": 7, "6": 15}', 1, 0),
	('06778ed3-cd27-4a7d-b0e3-15dc0f299bb7', '87cc7edd-7b07-4d76-8b8a-8d70294cbb11', '2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', '2026-05-22 07:18:09.368087+00', '2026-05-22 07:18:09.362+00', 582, '{"total": 6, "wrong": 1, "answers": {"1": 34, "2": 7, "3": 19, "4": 13, "5": 24, "6": 3}, "correct": 5, "unanswered": 0}', 1, 41),
	('e8518107-edf2-45d1-ab20-fef0347da89d', '4dcdcac7-a64c-4dcb-aaa9-2ea4f7353631', '2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', '2026-05-22 07:57:15.763816+00', '2026-05-22 07:57:15.754+00', 734, '{"total": 6, "wrong": 0, "answers": {"1": 13, "2": 17, "3": 10, "4": 29, "5": 7, "6": 15}, "correct": 6, "unanswered": 0}', 2, 23),
	('1ebe764c-8593-4333-9167-560ea7c40057', 'b33ee41f-6a00-460a-8d9d-48750d1a3ef1', '2fa311ae-cb5b-4859-a4de-9e9e7c3f121c', '2026-05-22 09:13:07.996784+00', '2026-05-22 09:13:08.046+00', 378, '{"total": 6, "wrong": 3, "answers": {"1": 30, "2": 10, "3": 7, "4": 19, "5": 35, "6": 12}, "correct": 3, "unanswered": 0}', 1, 12),
	('97418ab5-ad3c-4553-b66f-3b23ad8a8ba2', 'ced0e167-6d40-477a-a7cb-6d1930913f40', '2bac4e32-222f-47b2-b7d1-33a7680318d7', '2026-05-22 10:05:12.714707+00', '2026-05-22 10:05:12.711+00', 593, '{"total": 6, "wrong": 1, "answers": {"1": 33, "2": 32, "3": 22, "4": 20, "5": 2, "6": 6}, "correct": 5, "unanswered": 0}', 1, 34),
	('4e3cbc4b-729c-42be-82a8-e6d453b06a22', '50523d8a-79e1-4208-926d-0d4f4d61cef1', '2bac4e32-222f-47b2-b7d1-33a7680318d7', '2026-05-22 10:11:56.973501+00', '2026-05-22 10:11:57.049+00', 126, '{"total": 6, "wrong": 5, "answers": {"1": 15, "2": 9, "3": 22, "4": 4, "5": 33, "6": 5}, "correct": 1, "unanswered": 0}', 1, 12),
	('4bccadcc-c9f2-4e95-bf72-c2620c47af5e', '87cc7edd-7b07-4d76-8b8a-8d70294cbb11', '2a200105-bc18-46b9-b4bc-5a73ced4aded', '2026-05-22 10:19:07.725009+00', '2026-05-22 10:19:07.768+00', 125, '{"total": 6, "wrong": 4, "answers": {"1": 25, "2": 7, "3": 18, "4": 23, "5": 1, "6": null}, "correct": 1, "unanswered": 1}', 1, 14);


--
-- Data for Name: quiz_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quiz_group" ("quiz_id", "group_id", "date_added", "active_this_week") VALUES
	('5dea11e3-1f9e-485f-a642-19ce312b16d2', '41bd8a5e-a76d-43ff-982d-64cdfaa39725', '2026-05-14 11:35:31.792754+00', false),
	('4dcdcac7-a64c-4dcb-aaa9-2ea4f7353631', '41bd8a5e-a76d-43ff-982d-64cdfaa39725', '2026-05-14 11:35:31.799424+00', false),
	('7529b5dc-5fa7-45b1-88be-92eee0c09e10', '41bd8a5e-a76d-43ff-982d-64cdfaa39725', '2026-05-14 11:35:31.813129+00', false),
	('ced0e167-6d40-477a-a7cb-6d1930913f40', '41bd8a5e-a76d-43ff-982d-64cdfaa39725', '2026-05-14 11:35:31.806852+00', true),
	('87cc7edd-7b07-4d76-8b8a-8d70294cbb11', '41bd8a5e-a76d-43ff-982d-64cdfaa39725', '2026-05-14 11:35:31.784799+00', true),
	('e5bff840-bf57-472e-ab13-a30a6956d71d', 'd4112b66-ca49-40f4-a874-4958f790d79b', '2026-05-22 10:11:35.989023+00', false),
	('50523d8a-79e1-4208-926d-0d4f4d61cef1', 'd4112b66-ca49-40f4-a874-4958f790d79b', '2026-05-22 10:11:35.996353+00', false),
	('7529b5dc-5fa7-45b1-88be-92eee0c09e10', 'd4112b66-ca49-40f4-a874-4958f790d79b', '2026-05-22 10:11:36.002426+00', true);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

-- SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 31, true);


--
-- Name: glosses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."glosses_id_seq"', 35, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

-- SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict IWT8HEpSbK5GRHY392TY0RbI4Rj3tGsuYSMEhvYS9iBXybAWRmYD5iCX8BexqWP

RESET ALL;
