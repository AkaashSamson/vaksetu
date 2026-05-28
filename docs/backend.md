5.3 API Architecture & Endpoints
We used Next.js API Routes to create a standard interface for the frontend. These routes are kept minimalist; they primarily handle the incoming request and call the corresponding Drizzle queries to return the necessary data.

### 5.3.1 Endpoint Overview
The API is organized under the `/api/quiz` directory with the following primary endpoints:

* **`GET /api/quiz` (Discovery)**: This returns a list of all available quizzes. It only sends metadata—like the `id`, `title`, `description`, `difficulty`, and `type`—so the frontend can show a library of quizzes without downloading all the question data at once.

* **`GET /api/quiz/[id]` (Specific Quiz)**: This is the main endpoint for the quiz engine. It takes a unique ID and returns the fully **Hydrated Quiz Object**.

### 5.3.2 The Hydration Process
In our database, the `quiz` table stores questions as lightweight JSON references (e.g., pointing to `q_gloss_id: 101` and `options: [101, 102, 103, 104]`). To prevent the frontend from having to make dozens of requests to turn those references into actual text and pictures, the backend performs **Hydration**.

When `/api/quiz/[id]` is called, the Drizzle query layer (`quizzes.ts`) does the following:
1.  **Extracts relationships:** It scans the quiz JSON and collects a unique `Set` of all gloss IDs needed for the questions and options.
2.  **Batch Fetches:** It queries the `glosses` PostgreSQL table once using an `IN (...)` array, efficiently grabbing all names and image references in a single database round-trip.
3.  **Formats based on Type:** It dynamically maps the returning data. For an `"image_mcq"`, it populates the option array with images. For a `"sign_mcq"`, it populates the primary question with an image and leaves the options as pure text strings. 

### 5.3.3 Separation of Concerns
This API structure guarantees that the frontend and backend remain strictly independent. 

The frontend uses strict TypeScript Types (`ImageMCQQuestion` and `SignMCQQuestion`) when rendering the UI. Our Drizzle queries guarantee that the JSON returned from `/api/quiz/[id]` conforms 100% to those frontend definitions. The frontend developer only needs to interact with these JSON endpoints and never touches Drizzle or the PostgreSQL constraints. This makes the project highly maintainable, as the database can be scaled or migrated (as we did when we moved `type` to the root `quiz` table) without breaking the client-side code.

---

## 5.4 Supabase Database & Synchronization

We support a dual-database environment with a local Docker-based Supabase development instance and a remote managed Supabase cloud instance. The schemas are unified using a structured migrations-first approach, and data can be securely synchronized using single Git-like commands.

### 5.4.1 Command Workflows (`package.json`)

To make managing the remote database as easy as Git, we have registered several dedicated scripts:

#### 1. Push Schema (`npm run db:push`)
Pushes any new local schema migrations located in `supabase/migrations/` directly to the remote database. Use this command whenever you change the database schema (e.g., adding a table or modifying columns) and want the cloud database to mirror the schema without clearing any existing remote data.

#### 2. Pull Schema (`npm run db:pull`)
Pulls remote schema modifications back down into the local migrations folder.

#### 3. Full Parity Sync / Replication (`npm run db:replicate`)
Establishes a perfect replica of your current local database into the remote cloud database. 
- **What it does**: 
  1. Dynamically dumps the *current up-to-date local data* into `supabase/local_data.sql`.
  2. Runs `supabase/clear_remote.sql` using a transactional cascading truncate to safely empty all remote tables (bypassing triggers).
  3. Restores and inserts all local records from `supabase/local_data.sql` to the remote database under replica mode.
- **When to use**: Use this when you have new local test users, profiles, glosses, or quizzes that you want to publish cleanly to the cloud database.

#### 4. Incremental Seed Upload (`npm run db:seed-remote`)
Uploads raw seed records in `supabase/seed.sql` to the remote database without wiping or modifying any existing remote tables.

---

### 5.4.2 Security Warning: Row Level Security (RLS)
> [!WARNING]
> Both the local development and remote databases currently have Row Level Security (RLS) disabled for several key public tables (`glosses`, `group_member`, `learning_resource`, `quiz`, `quiz_attempt`, `quiz_group`, `user_group`, `user_profile`).
>
> To secure the application for production release, RLS must be enabled with correct policies:
> ```sql
> ALTER TABLE public.glosses ENABLE ROW LEVEL SECURITY;
> ALTER TABLE public.group_member ENABLE ROW LEVEL SECURITY;
> ALTER TABLE public.learning_resource ENABLE ROW LEVEL SECURITY;
> ALTER TABLE public.quiz ENABLE ROW LEVEL SECURITY;
> ALTER TABLE public.quiz_attempt ENABLE ROW LEVEL SECURITY;
> ALTER TABLE public.quiz_group ENABLE ROW LEVEL SECURITY;
> ALTER TABLE public.user_group ENABLE ROW LEVEL SECURITY;
> ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
> ```

