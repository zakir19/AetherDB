<p align="center">
  <img src="https://raw.githubusercontent.com/aether-db/react/main/.github/logo.svg" alt="Aether DB" width="100" />
</p>

<h1 align="center">Aether DB</h1>

<p align="center">
  <strong>AI-powered database schema generation.</strong><br/>
  Describe your app → get production-ready PostgreSQL schemas, TypeScript types, ERD diagrams, API routes, and seed data. Instantly.
</p>

<p align="center">
  <a href="https://aether-db.dev">Website</a> ·
  <a href="https://aether-db.dev/builder">Launch Builder</a> ·
  <a href="./DOCS.md">Full Docs</a>
</p>

---

## ✨ What You Get

Type a plain-English description of your application. Aether DB generates:

| Output | Description |
|--------|-------------|
| 🗄️ **SQL Schema** | PostgreSQL DDL with indexes, constraints, foreign keys, and enums |
| 🔷 **TypeScript Types** | Zod schemas + TS interfaces that mirror your database exactly |
| 📊 **ERD Diagram** | Live entity-relationship diagram rendered in real-time |
| 🔗 **API Routes** | RESTful endpoint definitions with typed request/response bodies |
| 🌱 **Seed Data** | Realistic INSERT statements with proper relational integrity |
| 🧠 **Design Decisions** | AI explanation of every architectural choice it made |

---

## 🚀 Try It

Go to **[aether-db.dev/builder](https://aether-db.dev/builder)** and type something like:

> *"A SaaS project management tool with teams, projects, tasks, priorities, comments, and file attachments"*

You'll get a full database foundation in seconds.

---

## 🤖 AI Providers

Aether DB routes requests through a **priority fallback chain**:

| Provider | Model | Role |
|----------|-------|------|
| **Grok** | `grok-3-fast` | Priority |
| **Groq** | `llama-3.3-70b` | Fallback #1 |
| **Gemini** | `2.0-flash` | Fallback #2 |

---

## 🏗️ Architecture

```
aether-db/
├── apps/
│   └── web/                  # Next.js 15 App Router — the main application
│       └── src/
│           ├── app/
│           │   ├── (auth)/   # Clerk sign-in / sign-up pages
│           │   ├── api/      # AI generation + session API routes
│           │   └── builder/  # Schema Builder page
│           └── components/
│               └── ai/       # SchemaBuilder, SchemaEditor, Sidebar
└── packages/
    └── cli/                  # (internal tooling)
```

---

## ⚙️ Self-Hosting

### 1. Clone & Install

```bash
git clone https://github.com/aether-db/react.git
cd react
npm install
```

### 2. Environment Variables

Create `apps/web/.env.local`:

```env
# AI Providers (at least one required)
XAI_API_KEY=xai-...       # Grok  (priority)
GROQ_API_KEY=gsk_...      # Groq  (fallback #1)
GOOGLE_API_KEY=AIza...    # Gemini (fallback #2)

# Clerk — optional (skip by leaving as CHANGE_ME)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 3. Run

```bash
npm run dev --workspace=apps/web
# → http://localhost:3000
```

---

## 🛠️ Tech Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.5 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion + GSAP |
| Auth | Clerk |
| AI | Grok · Groq · Gemini |

---

## 📄 License

MIT © [Aether DB](https://aether-db.dev)

---

<p align="center">
  <strong>Stop writing schemas by hand.</strong><br/>
  <sub>Built with obsession. Designed for developers.</sub>
</p>