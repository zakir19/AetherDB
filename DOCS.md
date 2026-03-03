<p align="center">
  <img src="https://raw.githubusercontent.com/aether-db/react/main/.github/logo.svg" alt="Aether DB" width="96" />
</p>

<h1 align="center">Aether DB</h1>

<p align="center">
  <strong>AI-powered database schema generation.</strong><br/>
  Describe your application in plain English — get production-ready PostgreSQL schemas,<br/>
  TypeScript types, ERD diagrams, API routes, and seed data. Instantly.
</p>

<p align="center">
  <a href="https://aether-db.dev">Website</a> ·
  <a href="https://aether-db.dev/builder">Launch Builder</a>
</p>

---

## Table of Contents

1. [What is Aether DB?](#1-what-is-aether-db)
2. [How It Works](#2-how-it-works)
3. [AI Outputs](#3-ai-outputs)
   - [SQL Schema](#31-sql-schema)
   - [TypeScript Types](#32-typescript-types)
   - [ERD Diagram](#33-erd-diagram)
   - [API Routes](#34-api-routes)
   - [Seed Data](#35-seed-data)
   - [Design Decisions](#36-design-decisions)
4. [The Builder Interface](#4-the-builder-interface)
5. [AI Providers](#5-ai-providers)
6. [Authentication & Sessions](#6-authentication--sessions)
7. [API Reference](#7-api-reference)
8. [Tech Stack](#8-tech-stack)
9. [Self-Hosting](#9-self-hosting)

---

## 1. What is Aether DB?

Aether DB is a **conversational AI tool** that turns a plain-English description of your application into a complete, production-ready database foundation. Instead of spending hours planning tables, writing migration SQL, and syncing TypeScript types — you describe what you want to build and Aether DB generates everything in seconds.

**Example prompt:**

> *"A SaaS project management tool with teams, workspaces, projects, tasks with priorities and due dates, comments, file attachments, and per-workspace billing."*

**What you get back:**
- ✅ PostgreSQL schema with proper indexes, constraints, foreign keys, and RLS policies
- ✅ Zod schemas + TypeScript types for every table
- ✅ Entity-relationship diagram (rendered live)
- ✅ RESTful API endpoint definitions with typed request/response bodies
- ✅ Realistic seed data with relational integrity
- ✅ AI explanation of every architectural decision

---

## 2. How It Works

```
You type a description
        ↓
Aether sends it to the AI provider (Grok → Groq → Gemini fallback chain)
        ↓
AI returns a structured JSON response with all 6 outputs
        ↓
Aether renders each output in a tabbed, copyable code block
        ↓
You can ask follow-up questions to refine the schema
        ↓
Use the Schema Editor to make targeted instruction-based edits
```

The AI response is a single structured object of type `SchemaOutput`:

```typescript
interface SchemaOutput {
  schema_sql:        string;            // PostgreSQL DDL
  types_typescript:  string;            // Zod schemas + TS interfaces
  erd_mermaid:       string;            // Mermaid erDiagram syntax
  api_endpoints:     string;            // REST endpoint list
  seed_data_sql:     string;            // INSERT statements
  relationships: {
    entities:        string[];          // Table names
    cardinality:     Record<string, string>;
  };
  design_decisions:  string[];          // Numbered rationale points
  follow_ups?:       string[];          // Suggested next questions
}
```

---

## 3. AI Outputs

### 3.1 SQL Schema

Production-ready **PostgreSQL DDL** that you can paste directly into a migration file.

**Features:**
- `UUID PRIMARY KEY DEFAULT gen_random_uuid()` by default (distributed-safe)
- `TIMESTAMPTZ` for all timestamps (timezone-aware)
- Proper `REFERENCES ... ON DELETE CASCADE/SET NULL` foreign keys
- Indexes on all foreign keys and high-cardinality query columns
- `CHECK` constraints and `NOT NULL` where semantically correct
- Enum types for fixed-value columns

**Example output:**

```sql
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  role       user_role DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE projects (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  owner_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  visibility visibility DEFAULT 'private',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_projects_owner ON projects(owner_id);
```

---

### 3.2 TypeScript Types

**Zod schemas** and **TypeScript interfaces** that exactly mirror your database — no manual type drift.

```typescript
export const UserSchema = z.object({
  id:        z.string().uuid(),
  email:     z.string().email(),
  name:      z.string().min(1),
  role:      z.enum(['admin', 'member']),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
```

Types are named to match tables in camelCase, with `Schema` suffix for Zod objects and bare name for TypeScript types.

---

### 3.3 ERD Diagram

**Mermaid `erDiagram`** syntax is generated and rendered as a **live visual ERD** inside the interface using an iframe renderer.

```
erDiagram
  USERS ||--o{ PROJECTS : owns
  PROJECTS ||--o{ TASKS : contains
  USERS ||--o{ COMMENTS : writes
  TASKS ||--o{ COMMENTS : receives
```

The ERD tab is the default active tab whenever the visual preview is available.

---

### 3.4 API Routes

**RESTful endpoint definitions** with typed request/response bodies and HTTP status codes:

```
GET    /api/users          → UserList
POST   /api/users          → User
GET    /api/users/:id      → User
PATCH  /api/users/:id      → User
DELETE /api/users/:id      → 204

GET    /api/projects       → ProjectList
POST   /api/projects       → Project
```

These are framework-agnostic and can be implemented in any backend.

---

### 3.5 Seed Data

**Realistic, relational INSERT statements** — properly ordered to respect foreign key constraints, with semantically meaningful values (not just `foo_1`, `foo_2`):

```sql
INSERT INTO users (id, email, name, role) VALUES
  ('a1b2...', 'alice@example.com', 'Alice Chen',  'admin'),
  ('c3d4...', 'bob@example.com',   'Bob Smith',   'member'),
  ('e5f6...', 'carol@example.com', 'Carol Wu',    'member');

INSERT INTO projects (name, owner_id) VALUES
  ('Alpha Launch', 'a1b2...'),
  ('Beta Testing', 'c3d4...');
```

---

### 3.6 Design Decisions

The AI explicitly lists every architectural choice it made and explains why — so you understand the schema, can challenge its decisions, or refine them in a follow-up:

```
✓ Used UUIDs over BIGSERIAL for distributed identity safety
✓ Added partial index on active_sessions only (WHERE expires_at > now())
✓ Denormalized display_name on posts for read performance
✓ Chose JSONB over a separate table for user preferences (flexibility vs. queryability)
⚠ Consider partitioning the events table once it exceeds 10M rows
⚠ Add a covering index on (user_id, created_at) if sorting by date per user
```

This transparency makes Aether DB an educational tool, not just a code generator.

---

## 4. The Builder Interface

The builder at `/builder` is a **conversational chat interface** with a persistent sidebar.

### Chat Window

| Element | Behaviour |
|---------|-----------|
| **Prompt input** | Multi-line textarea; `Enter` sends, `Shift+Enter` adds a newline |
| **Generating state** | Animated three-dot typing indicator while the AI processes |
| **Follow-up chips** | AI suggests 2–3 follow-up questions after each schema |
| **Message history** | Scrolls automatically to the latest message |

### Schema Block (per message)

Each AI response renders an interactive, tabbed block:

| Tab | Content |
|-----|---------|
| **ERD** | Live visual entity-relationship diagram |
| **SQL Schema** | PostgreSQL DDL, syntax-highlighted |
| **TypeScript** | Zod schemas + type exports |
| **API Routes** | RESTful endpoint list |
| **Seed Data** | INSERT statements |
| **Decisions** | Numbered design rationale |

**Toolbar actions on each block:**
- 📋 **Copy** — copies the active tab's content to clipboard
- ✏️ **Edit** — opens the inline Schema Editor for instruction-based refinement

### Schema Editor (inline)

When you click the edit icon, a panel appears within the schema block:

- Shows the current SQL
- Has a free-text instruction field (e.g. *"Add a notifications table with read/unread status and link to users"*)
- The AI re-generates only the affected parts of the schema on apply

### Sidebar

The collapsible left sidebar (`Ctrl+N` for new chat) contains:

**Chats tab:**
- Sessions grouped by **Today / This Week / Older**
- Search across all session titles
- Click to switch sessions
- Hover to reveal the delete button per session

**Settings tab:**
- Live AI provider status display (priority / active / fallback)
- Keyboard shortcut reference

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line in input |
| `Ctrl + N` | New chat |

---

## 5. AI Providers

Aether DB uses a **priority fallback chain** across three AI providers to maximise uptime and speed:

| Provider | Model | Role |
|----------|-------|------|
| **Grok** | `grok-3-fast` | Priority (fastest, most capable) |
| **Groq** | `llama-3.3-70b` | Active (fallback #1) |
| **Gemini** | `2.0-flash` | Fallback #2 |

The active provider per request is returned in the API response as `provider` and `model` fields and displayed in the message footer.

---

## 6. Authentication & Sessions

### Sign-in / Sign-up

Authentication is powered by **Clerk**. Routes:

| Route | Description |
|-------|-------------|
| `/sign-in` | Email/password + OAuth sign-in |
| `/sign-up` | Registration |
| `/sign-up/sso-callback` | OAuth provider callback handler |

> **Note:** Aether DB works without signing in (guest mode). Sign-in is required to **save and resume sessions**.

### Session Persistence

Signed-in users get server-side session persistence:

- Sessions are stored by user and loaded on sign-in via `GET /api/sessions`
- Each session has a title (auto-derived from the first prompt), timestamp, and message count
- Sessions are grouped in the sidebar by recency

### Pending Query Preservation

If a guest types a query and then signs in:

1. The query is saved to `sessionStorage` as `aether-pending-query`
2. After sign-in redirect, Aether restores the query and auto-sends it
3. The intro preloader is skipped on return via `aether-skip-intro` flag

---

## 7. API Reference

### `POST /api/generate`

Generates a new schema from a prompt.

**Request body:**

```json
{
  "prompt": "A SaaS app with users, teams, and projects",
  "sessionId": "optional-session-uuid",
  "history": [
    { "role": "user",      "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**

```json
{
  "schema": {
    "schema_sql":        "CREATE TABLE ...",
    "types_typescript":  "export const ...",
    "erd_mermaid":       "erDiagram ...",
    "api_endpoints":     "GET /api/...",
    "seed_data_sql":     "INSERT INTO ...",
    "relationships": {
      "entities":    ["users", "projects"],
      "cardinality": { "users→projects": "one-to-many" }
    },
    "design_decisions": ["Used UUIDs for ..."],
    "follow_ups":       ["Should I add RLS policies?"]
  },
  "preview":   "<html>...</html>",
  "model":     "grok-3-fast",
  "provider":  "grok",
  "sessionId": "uuid"
}
```

### `GET /api/sessions`

Returns all sessions for the authenticated user.

**Response:**

```json
{
  "sessions": [
    {
      "id":           "uuid",
      "title":        "SaaS project management app",
      "timestamp":    "2026-02-26T10:00:00Z",
      "messageCount": 4
    }
  ]
}
```

### `GET /api/sessions/:id`

Returns all messages for a specific session.

### `DELETE /api/sessions/:id`

Deletes a session and all its messages.

---

## 8. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.5 (strict mode) |
| **Styling** | Tailwind CSS v4 + CSS custom properties |
| **Animation** | Framer Motion, GSAP + ScrollTrigger |
| **Authentication** | Clerk |
| **AI Providers** | Grok, Groq (Llama 3.3), Google Gemini |
| **Fonts** | Inter (UI) + JetBrains Mono (code) |
| **Deployment** | Vercel (recommended) |

---

## 9. Self-Hosting

### Prerequisites

- Node.js ≥ 20
- A Clerk account (for auth) — or set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to `CHANGE_ME` to skip auth

### Environment Variables

Create `.env.local` in `apps/web/`:

```env
# Clerk (optional — skip auth by leaving as CHANGE_ME)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# AI Providers (at least one required)
XAI_API_KEY=xai-...        # Grok (priority)
GROQ_API_KEY=gsk_...       # Groq (fallback #1)
GOOGLE_API_KEY=AIza...     # Gemini (fallback #2)
```

### Start

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev --workspace=apps/web
```

Navigate to [http://localhost:3000](http://localhost:3000).

---

<p align="center">
  <strong>Stop writing schemas by hand.</strong><br/>
  <sub>Built with obsession. Designed for developers.</sub>
</p>
