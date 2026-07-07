# 🌉 VakSetu (वाक्सेतु)

VakSetu is a premium, state-of-the-art assistive learning and real-time translation portal designed to bridge the communication gap between hearing-impaired individuals and the general public. The platform reinforces Indian Sign Language (ISL) vocabulary, alphabet fingerspelling, and alphanumeric structures through real-time camera-based translation, multilingual speech transcription, interactive 3D rendering, gamified quizzes, and collaborative community leaderboards.

---

## 📑 Table of Contents
1. [Key Features](#-key-features)
2. [Architecture & System Flow](#%EF%B8%8F-architecture--system-flow)
3. [Quick Start (Instant Setup)](#%EF%B8%8F-quick-start-instant-setup)
4. [Full Local Development Setup](#%EF%B8%8F-full-local-development-setup)
5. [Database Operations & Commands](#%EF%B8%8F-database-operations--commands)
6. [FastAPI Integration Protocol](#%EF%B8%8F-fastapi-integration-protocol)
7. [Environment Variables Reference](#-environment-variables-reference)
8. [Directory Layout](#-directory-layout)
9. [Design System & Styling Standards](#%EF%B8%8F-design-system--styling-standards)

---

## 🚀 Key Features

*   **Real-time Sign-to-Text Translation**: Tracks hand and facial gestures client-side using browser-native MediaPipe JS, formats them into normalized 506-dimensional vectors, and streams predictions over WebSockets for low-latency (<30ms) machine learning inference.
*   **Multilingual Speech-to-Text**: Integrates Sarvam AI API to transcribe 22 regional Indian languages with high dialect accuracy and translates native voice inputs to English.
*   **Double-Channel Sign Output**:
    *   **3D Animated Avatar**: Interactive 3D character mesh built on Three.js and `@react-three/fiber` for procedural real-time animations.
    *   **Gloss Video Player**: Sequentially chains video assets for translation, including an automated fingerspelling fallback for words missing from the lexicon.
*   **Gamified Hybrid Quizzes**: Combines visual identification (`image_mcq`) and sign translation (`sign_mcq`) question structures, utilizing a database hydration layer to batch-fetch media references.
*   **Collaborative Communities & Leaderboards**: Live user-created learning spaces featuring invite codes, weekly challenge toggles, and scoring formulas that scale with accuracy, speed, and multi-attempt score decay.

---

## 🏗️ Architecture & System Flow

```mermaid
graph TD
    classDef client fill:#dbeafe,stroke:#1e40af,stroke-width:2px;
    classDef server fill:#dcfce7,stroke:#166534,stroke-width:2px;
    classDef db fill:#fef3c7,stroke:#92400e,stroke-width:2px;

    subgraph Client ["Client Side (Next.js / React 19)"]
        Pages["App Routes (RSCs & Client Pages)"]:::client
        Sidebar["Navigation & Sidebar Inset"]:::client
        Comp["Reusable UI Components & 3D Canvas"]:::client
        MP["MediaPipe JS Landmark Extractor"]:::client
    end

    subgraph Server ["Next.js Node/Edge Server"]
        MW["middleware.ts (Supabase Session Refresh)"]:::server
        AuthGate["AuthGate (Route Access Gating)"]:::server
        API["API Routes (app/api/*)"]:::server
        Drizzle["Drizzle ORM Connection"]:::server
    end

    subgraph External ["External Services"]
        FastAPI["Python FastAPI Server (8000)"]:::server
        Sarvam["Sarvam AI API"]:::server
        Groq["Groq LLM API"]:::server
    end

    subgraph Database ["Supabase Cloud"]
        DB[(PostgreSQL Database)]:::db
        AuthStore[(Supabase Authentication)]:::db
    end

    Pages -->|Includes| Sidebar
    Sidebar -->|Displays| Comp
    Comp -->|Capture Frame| MP
    MP -->|Websockets Feature Stream| FastAPI
    Comp -->|Audio Blob| API
    API -->|Transcribe & Translate| Sarvam
    API -->|Sentence Synthesis| Groq
    MW -->|Intercepts & Refreshes| AuthStore
    AuthGate -->|Session Checks| AuthStore
    API -->|Fetch & Hydrate Quizzes| Drizzle
    Drizzle -->|SQL Queries| DB
```

For a detailed breakdown of codebase design rules and styling structures, see [docs/frontend_architecture_best_practices.md](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/docs/frontend_architecture_best_practices.md).

---

## ⚡ Quick Start (Instant Setup)

You can run the frontend instantly in **Mock Mode**, which bypasses the need for local Docker database installations, Supabase links, or external API keys.

1.  **Clone & Install Dependencies**:
    ```bash
    git clone <repository-url>
    cd vaksetu
    npm install
    ```
2.  **Configure Mock Env**:
    Create a [`.env.local`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/.env.local) file in the root directory:
    ```env
    NEXT_PUBLIC_USE_MOCK_DATA=true
    ```
3.  **Launch Dev Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser. All API requests for quizzes, communities, and leaderboards will resolve instantly using local mock datasets!

---

## 🛠️ Full Local Development Setup

To run the application with live databases and full API support, follow these steps:

### Prerequisites
*   Node.js (>= 20.9.0)
*   Docker Desktop (for running local Supabase containers)
*   Supabase CLI (run via `npx` automatically, or install globally)

### Step 1: Initialize Local Supabase
Start the local Supabase environment (which spins up Docker containers for PostgreSQL, GoTrue Auth, Realtime, and Studio):
```bash
npx supabase start
```
*Note: Make sure Docker Desktop is active.*

### Step 2: Configure Environment Variables
Create a [`.env.local`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/.env.local) file and populate it with the local keys displayed in the terminal output from `supabase start`:
```env
# Database & Auth Connection Configurations
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Mock Mode (Set to false to query database)
NEXT_PUBLIC_USE_MOCK_DATA=false

# External AI Model Integrations
SARVAM_API_KEY=your_sarvam_ai_api_key
GROQ_API_KEY=your_groq_api_key

# External Python Backend URLs
NEXT_PUBLIC_GLOSS_API_URL=http://localhost:8000/convert-text-to-gloss
```

### Step 3: Run Database Migrations and Seed Data
Apply all migration files to set up the schemas, triggers, and functions, then seed standard database profiles and initial challenges:
```bash
# Reset database and run seed files
npx supabase db reset
```
This command applies all migrations located in the [`supabase/migrations`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/supabase/migrations) folder and automatically executes the static inserts inside [`supabase/seed.sql`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/supabase/seed.sql).

### Step 4: Run the Development Server
```bash
npm run dev
```

---

## 🗄️ Database Operations & Commands

The project defines its PostgreSQL schema inside [`lib/db/schema.ts`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/lib/db/schema.ts) using Drizzle ORM and mirrors changes directly to Supabase migrations. Dedicated command scripts are provided in [`package.json`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/package.json):

*   **Apply Schema Changes locally (Drizzle)**:
    ```bash
    # Generate SQL files
    npx drizzle-kit generate
    # Push schema alterations to your local DB without generating SQL
    npx drizzle-kit push
    ```
*   **Push Schemas to Cloud Project (`npm run db:push`)**:
    Pushes any new migrations to the linked Supabase cloud instance.
*   **Pull Schemas from Cloud (`npm run db:pull`)**:
    Pulls cloud database schema changes back down to the local environment.
*   **Full Staging Data Sync (`npm run db:replicate`)**:
    Establishes perfect data parity between local development and the cloud staging server. It dumps current local table contents, clears all remote tables, and synchronizes the local records to the cloud.
*   **Seed Remote Cloud Database (`npm run db:seed-remote`)**:
    Applies the static seeds defined in [`supabase/seed.sql`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/supabase/seed.sql) to the remote cloud database without wiping existing tables.

---

## 🔌 FastAPI Integration Protocol

The Next.js client connects to an external Python FastAPI backend to process audio mappings and gesture predictions:

1.  **WebSocket Inference Endpoint**:
    *   **URL**: `ws://localhost:8000/ws/translate`
    *   **Payload Format**: streams a `JSON` message frame every ~33ms containing client-side MediaPipe-extracted coordinate arrays:
        ```json
        {
          "type": "landmarks",
          "schema_version": "1.0",
          "features": [...506 floats...]
        }
        ```
    *   For detail on coordinate extraction, hand normalization, and velocity rules, refer to [docs/FEATURE_CONTRACT.md](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/docs/FEATURE_CONTRACT.md) and [docs/sign_to_text_api_protocol.md](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/docs/sign_to_text_api_protocol.md).
2.  **Gloss Mapping Rest API**:
    *   **URL**: `http://localhost:8000/convert-text-to-gloss`
    *   **Payload Format**: `POST` request with `{ "text": "English text" }`
    *   **Expected Response**: `{ "glosses": ["HELLO", "FRIEND"] }`

---

## 🔑 Environment Variables Reference

Here is a reference of the environment variables used in the project:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Toggles Mock Mode (requires zero database/API setups) | `true` (instant setup), `false` (real database) |
| `NEXT_PUBLIC_SUPABASE_URL` | The URL endpoint of the local or cloud Supabase instance | `http://127.0.0.1:54321` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side anonymous Supabase API key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `DATABASE_URL` | Direct connection URI used by Drizzle ORM to run migrations | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |
| `SARVAM_API_KEY` | Developer access token to integrate Sarvam AI transcription models | `sk_owth6oll...` |
| `GROQ_API_KEY` | API token for natural English sentence synthesis using Groq SDK | `gsk_wrOcayM...` |
| `NEXT_PUBLIC_GLOSS_API_URL` | Endpoint of the FastAPI backend to fetch gloss strings | `http://localhost:8000/convert-text-to-gloss` |

---

## 📂 Directory Layout

*   [`app/`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/app): Next.js App Router folders.
    *   [`app/(protected)/`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/app/\(protected\)): User dashboard and features wrapped inside an authentication gate.
    *   [`app/api/`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/app/api): Next.js backend API routes (e.g., quiz hydration, translation proxies).
*   [`components/`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/components): Segmented, reusable UI components.
    *   [`components/auth/`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/components/auth): Routing blockers and login overlays.
    *   [`components/avatar/`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/components/avatar): 3D Avatar canvas and gloss video player elements.
    *   [`components/ui/`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/components/ui): Foundational Shadcn UI layout primitives.
*   [`docs/`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/docs): System architectural manuals, API blueprints, and contract structures.
*   [`lib/`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/lib): Drizzle database schemas, SDK clients, and authentication action files.
*   [`supabase/`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/supabase): Local Docker configuration, SQL migrations, schemas, and seeds.

---

## 🎨 Design System & Styling Standards

The project utilizes **Tailwind CSS v4** combined with curated dark emerald accents to enforce a premium, consistent visual identity.

> [!IMPORTANT]
> Do **NOT** use default Tailwind green classes (e.g., `bg-green-600`, `border-green-300`) inside components.
> Always use the semantic brand colors defined inside [`app/globals.css`](file:///c:/DEV/Project/Final_Year/vak_setu_2/vaksetu/app/globals.css):
> *   **Primary Brand Accent**: `brand-800` (`#166534`)
> *   **Card Borders / Subtle Accents**: `border-brand-800/30` or `brand-200`
> *   **Light Backgrounds**: `bg-brand-50`
