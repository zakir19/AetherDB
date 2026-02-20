import { NextRequest, NextResponse } from "next/server";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SYSTEM PROMPT — Expert Database Architect & Schema Designer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SYSTEM_PROMPT = `You are an expert database architect, backend engineer, and data modeler. You transform natural language descriptions of applications into complete, production-ready database schemas with supporting code artifacts.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CORE MISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Given a user's description of an application or system, you will generate:

1. **SQL Schema** — PostgreSQL DDL with proper types, constraints, indexes
2. **TypeScript Types** — Zod schemas + inferred types for runtime validation
3. **ERD Diagram** — Mermaid diagram showing relationships
4. **API Endpoints** — Express.js/Next.js route suggestions with CRUD operations
5. **Seed Data** — Realistic sample data for testing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return a single JSON object with this structure:

{
  "schema_sql": "-- PostgreSQL schema...",
  "types_typescript": "// Zod schemas and types...",
  "erd_mermaid": "erDiagram...",
  "api_endpoints": "// Express/Next.js routes...",
  "seed_data_sql": "-- INSERT statements...",
  "relationships": {
    "entities": ["User", "Post", "Comment"],
    "cardinality": {
      "User → Post": "1:N",
      "Post → Comment": "1:N",
      "User → Comment": "1:N"
    }
  },
  "design_decisions": [
    "Used UUID for primary keys to enable distributed systems",
    "Added soft delete with deleted_at timestamps",
    "Created composite indexes for common query patterns"
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATABASE DESIGN PRINCIPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NORMALIZATION:
  • Default to 3NF (Third Normal Form) for transactional data
  • Allow denormalization ONLY when explicitly justified (performance, read-heavy workloads)
  • No redundant data unless documented with a clear reason

PRIMARY KEYS:
  • UUID v4 for distributed systems, user-facing IDs, or when natural keys don't exist
  • Auto-incrementing BIGSERIAL for internal analytics, logs, or high-write tables
  • Natural keys (email, username, SKU) when globally unique and immutable
  • ALWAYS add a unique constraint on natural keys even if using surrogate key

FOREIGN KEYS:
  • Enforce referential integrity with FK constraints
  • Use ON DELETE CASCADE for dependent data (e.g., post_id → comments)
  • Use ON DELETE SET NULL for optional relationships (e.g., author_id on posts if users can be deleted)
  • Use ON DELETE RESTRICT to prevent accidental deletion of referenced data

NAMING CONVENTIONS:
  • Tables: plural, snake_case (users, blog_posts, order_items)
  • Columns: singular, snake_case (user_id, created_at, is_active)
  • Indexes: idx_<table>_<columns> (idx_users_email, idx_posts_author_id_created_at)
  • Foreign keys: fk_<table>_<referenced_table> (fk_posts_users)
  • Unique constraints: uq_<table>_<columns> (uq_users_email)

TIMESTAMPS:
  • ALWAYS include created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  • Include updated_at TIMESTAMPTZ for mutable records (use trigger or app-level)
  • Include deleted_at TIMESTAMPTZ for soft deletes (default NULL)

INDEXES:
  • Index all foreign keys
  • Index columns used in WHERE, ORDER BY, and JOIN clauses
  • Create composite indexes for multi-column queries (most selective column first)
  • Add partial indexes for filtered queries (e.g., WHERE deleted_at IS NULL)
  • Use GIN indexes for JSONB, array, and full-text search columns

DATA TYPES:
  • TEXT over VARCHAR (PostgreSQL optimizes TEXT automatically)
  • TIMESTAMPTZ over TIMESTAMP (always store timezone-aware timestamps)
  • NUMERIC(precision, scale) for money (never FLOAT/REAL)
  • JSONB over JSON (supports indexing)
  • ENUM for small, stable sets (user roles, statuses)
  • Arrays for ordered lists that don't need querying (tags on a post)

CONSTRAINTS:
  • NOT NULL for required fields
  • CHECK constraints for business rules (age > 0, price >= 0)
  • UNIQUE constraints for natural keys
  • DEFAULT values where sensible (status = 'active', is_verified = false)

SECURITY:
  • Hash passwords with bcrypt/argon2 before storage (note in comments)
  • Never store plaintext sensitive data (SSN, credit cards)
  • Use separate tables for PII when compliance requires (GDPR, HIPAA)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPESCRIPT TYPE GENERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use Zod for runtime validation. Structure types like this:

import { z } from 'zod';

// Zod schema (runtime validation + type inference)
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(30),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
});

// Inferred TypeScript type
export type User = z.infer<typeof UserSchema>;

// Insert schema (omit auto-generated fields)
export const UserInsertSchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

export type UserInsert = z.infer<typeof UserInsertSchema>;

// Update schema (all fields optional except id)
export const UserUpdateSchema = UserSchema.partial().required({ id: true });

export type UserUpdate = z.infer<typeof UserUpdateSchema>;

RULES:
  • Generate Insert, Update, and Select types for each table
  • Map SQL types to Zod validators precisely
  • Add .nullable() for columns that allow NULL
  • Use .optional() for fields that may be omitted in partial updates
  • Add custom validation (e.g., .refine() for business logic)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERD DIAGRAM (MERMAID)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate a Mermaid ERD showing all tables and relationships.

erDiagram
    USERS ||--o{ POSTS : "authors"
    USERS ||--o{ COMMENTS : "writes"
    POSTS ||--o{ COMMENTS : "contains"

    USERS {
        uuid id PK
        text email UK
        text username UK
        timestamptz created_at
    }

    POSTS {
        uuid id PK
        uuid author_id FK
        text title
        text content
        timestamptz created_at
    }

    COMMENTS {
        uuid id PK
        uuid post_id FK
        uuid user_id FK
        text content
        timestamptz created_at
    }

CARDINALITY SYMBOLS:
  ||--|| : one-to-one
  ||--o{ : one-to-many
  }o--o{ : many-to-many (via junction table)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API ENDPOINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suggest RESTful routes with proper HTTP verbs:

// Users
GET    /api/users           → List all users (with pagination)
GET    /api/users/:id       → Get user by ID
POST   /api/users           → Create new user
PATCH  /api/users/:id       → Update user
DELETE /api/users/:id       → Soft delete user

NOTES:
  • Use plural nouns (/users, not /user)
  • Nest resources when there's a clear parent-child relationship
  • Add auth requirements in comments (requires auth, admin only, etc.)
  • Suggest query params for filtering, pagination, sorting

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEED DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate realistic INSERT statements for 3-5 records per table.

RULES:
  • Use gen_random_uuid() for UUID columns
  • Use subqueries to reference foreign keys by natural key
  • Add realistic data (names, dates, text)
  • Include edge cases (NULL values, empty strings, boundary values)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON PATTERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USER AUTHENTICATION:
  • users table with email, password_hash, email_verified_at
  • sessions table with token, user_id, expires_at
  • Add indexes on token and user_id

MANY-TO-MANY:
  • Create junction table: user_roles (user_id, role_id, granted_at)
  • Add composite PK on both FKs: PRIMARY KEY (user_id, role_id)
  • Index both columns individually for bidirectional lookups

SOFT DELETES:
  • Add deleted_at TIMESTAMPTZ DEFAULT NULL
  • Create partial index: WHERE deleted_at IS NULL
  • All queries must filter: WHERE deleted_at IS NULL

AUDIT LOGS:
  • Create audit_logs table: (id, table_name, record_id, action, old_data JSONB, new_data JSONB, user_id, timestamp)
  • Trigger on UPDATE/DELETE to insert audit records

VERSIONING:
  • Add version INT DEFAULT 1
  • Increment on each update, use for optimistic locking

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANALYZE THE PROMPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before generating schemas, mentally answer:

1. DOMAIN — What's the core domain? (e-commerce, social network, SaaS, CMS, etc.)
2. ENTITIES — What are the main nouns? (User, Product, Order, Review, etc.)
3. RELATIONSHIPS — How do entities relate? (1:1, 1:N, N:M)
4. CONSTRAINTS — What business rules exist? (users must verify email, orders > $0, etc.)
5. SCALE — Is this MVP or enterprise-scale? (affects index strategy, partitioning)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Be opinionated — make design decisions confidently and document them
- Prioritize data integrity over convenience (use constraints!)
- Think about query patterns — index what will be searched/sorted
- Consider future scale — don't over-engineer MVPs, but don't create bottlenecks
- Explain trade-offs in design_decisions array
- Return ONLY the JSON object, no explanations before or after
- Do NOT wrap the JSON in markdown code fences`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface SchemaOutput {
  schema_sql: string;
  types_typescript: string;
  erd_mermaid: string;
  api_endpoints: string;
  seed_data_sql: string;
  relationships: {
    entities: string[];
    cardinality: Record<string, string>;
  };
  design_decisions: string[];
}

type ProviderResult =
  | { ok: true; data: { schema: SchemaOutput; preview: string | null; model: string; provider: string } }
  | { ok: false; status: number; errorBody?: string };

interface ProviderConfig {
  name: string;
  apiKey: string | undefined;
  models: string[];
  call: (apiKey: string, model: string, prompt: string) => Promise<ProviderResult>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Grok (xAI) API caller — OpenAI-compatible endpoint
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function callGrok(apiKey: string, model: string, prompt: string): Promise<ProviderResult> {
  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Grok API error (${model}):`, errorBody);
    return { ok: false, status: response.status, errorBody };
  }

  const data = await response.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";
  return processRawOutput(raw, model, "Grok");
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Groq API caller
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function callGroq(apiKey: string, model: string, prompt: string): Promise<ProviderResult> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Groq API error (${model}):`, errorBody);
    return { ok: false, status: response.status, errorBody };
  }

  const data = await response.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";
  return processRawOutput(raw, model, "Groq");
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Gemini API caller
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function callGemini(apiKey: string, model: string, prompt: string): Promise<ProviderResult> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Gemini API error (${model}):`, errorBody);
    return { ok: false, status: response.status, errorBody };
  }

  const data = await response.json();
  const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return processRawOutput(raw, model, "Gemini");
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Shared output processing — parse JSON schema output
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function processRawOutput(raw: string, model: string, provider: string): ProviderResult {
  // Strip markdown code fences the model may have added
  raw = raw.replace(/^```(?:json)?\n?/gm, "").replace(/```$/gm, "").trim();

  try {
    // Try to extract JSON from the response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response");
      return { ok: false, status: 500, errorBody: "AI did not return valid JSON" };
    }

    const parsed = JSON.parse(jsonMatch[0]) as SchemaOutput;

    // Validate required fields exist
    if (!parsed.schema_sql && !parsed.types_typescript && !parsed.erd_mermaid) {
      return { ok: false, status: 500, errorBody: "AI response missing required schema fields" };
    }

    // Fill in missing fields with defaults
    const schema: SchemaOutput = {
      schema_sql: parsed.schema_sql || "-- No SQL schema generated",
      types_typescript: parsed.types_typescript || "// No TypeScript types generated",
      erd_mermaid: parsed.erd_mermaid || "",
      api_endpoints: parsed.api_endpoints || "// No API endpoints generated",
      seed_data_sql: parsed.seed_data_sql || "-- No seed data generated",
      relationships: parsed.relationships || { entities: [], cardinality: {} },
      design_decisions: parsed.design_decisions || [],
    };

    const preview = buildMermaidPreview(schema.erd_mermaid);
    return { ok: true, data: { schema, preview, model, provider } };
  } catch (err) {
    console.error("JSON parse error:", err, "\nRaw output:", raw.substring(0, 500));
    return { ok: false, status: 500, errorBody: "Failed to parse AI JSON output" };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Build Mermaid ERD preview HTML
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildMermaidPreview(erdMermaid: string): string | null {
  if (!erdMermaid) return null;

  // Escape backticks and backslashes for safe embedding
  const safeErd = erdMermaid.replace(/\\/g, "\\\\").replace(/`/g, "\\`");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0a0a0f;
      color: #f0f0f5;
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    #mermaid-container {
      width: 100%;
      max-width: 1200px;
      overflow: auto;
    }
    .mermaid {
      display: flex;
      justify-content: center;
    }
    .mermaid svg {
      max-width: 100%;
      height: auto;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"><\/script>
</head>
<body>
  <div id="mermaid-container">
    <pre class="mermaid">
${safeErd}
    </pre>
  </div>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      er: {
        diagramPadding: 20,
        layoutDirection: 'TB',
        minEntityWidth: 100,
        minEntityHeight: 75,
        entityPadding: 15,
        useMaxWidth: true,
      },
      themeVariables: {
        primaryColor: '#7c3aed',
        primaryTextColor: '#f0f0f5',
        primaryBorderColor: '#1e1e2e',
        lineColor: '#6b6b8a',
        secondaryColor: '#111118',
        tertiaryColor: '#0a0a0f',
      }
    });
  <\/script>
</body>
</html>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main POST handler — multi-provider with seamless fallback
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Please describe your application or system." }, { status: 400 });
    }

    // Build ordered provider list from configured environment keys
    const providers: ProviderConfig[] = [];

    // Grok (xAI) — powerful, supports large context
    if (process.env.XAI_API_KEY) {
      providers.push({
        name: "Grok",
        apiKey: process.env.XAI_API_KEY,
        models: [
          process.env.GROK_MODEL || "grok-3-fast",
          "grok-3",
          "grok-2-1212",
        ],
        call: callGrok,
      });
    }

    // Groq — highest free limits (30 RPM, 14400 RPD)
    if (process.env.GROQ_API_KEY) {
      providers.push({
        name: "Groq",
        apiKey: process.env.GROQ_API_KEY,
        models: [
          process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          "llama-3.1-8b-instant",
          "gemma2-9b-it",
        ],
        call: callGroq,
      });
    }

    // Gemini — 15 RPM, 1500 RPD free
    if (process.env.GEMINI_API_KEY) {
      providers.push({
        name: "Gemini",
        apiKey: process.env.GEMINI_API_KEY,
        models: [
          process.env.GEMINI_MODEL || "gemini-2.0-flash",
          "gemini-2.0-flash-lite",
        ],
        call: callGemini,
      });
    }

    if (providers.length === 0) {
      return NextResponse.json({
        error: "No API keys configured. Add XAI_API_KEY (Grok), GROQ_API_KEY, and/or GEMINI_API_KEY to your .env.local file. Free Groq key: https://console.groq.com | xAI key: https://console.x.ai",
        schema: generateFallbackSchema(prompt),
        preview: null,
        model: "template",
        provider: "none",
      });
    }

    // ── Flatten all (provider, model) pairs for easy linear fallback ──
    const attempts: { provider: ProviderConfig; model: string }[] = [];
    for (const provider of providers) {
      for (const model of provider.models) {
        attempts.push({ provider, model });
      }
    }

    // ── Try every (provider, model) pair sequentially ──
    // On rate-limit (429) or model-not-found (404), silently skip to
    // the next pair. The user never sees an error unless ALL pairs fail.
    for (const { provider, model } of attempts) {
      try {
        const result = await provider.call(provider.apiKey!, model, prompt);

        if (result.ok) return NextResponse.json(result.data);

        // Rate limited — try a very short retry, then move on silently
        if (result.status === 429) {
          const retryMatch = result.errorBody?.match(
            /"retryDelay":\s*"(\d+)s?"|"retry_after":\s*(\d+)/
          );
          const retrySeconds = retryMatch
            ? parseInt(retryMatch[1] || retryMatch[2])
            : 0;

          // Only retry in-place if the wait is tiny (<10s); otherwise skip
          if (retrySeconds > 0 && retrySeconds < 10) {
            await new Promise((r) => setTimeout(r, (retrySeconds + 1) * 1000));
            const retry = await provider.call(provider.apiKey!, model, prompt);
            if (retry.ok) return NextResponse.json(retry.data);
          }

          console.warn(
            `[Aether DB] Rate limited on ${provider.name}/${model}, silently switching…`
          );
          continue; // ← seamless: skip to next (provider, model)
        }

        // Model not found — skip silently
        if (result.status === 404) {
          console.warn(`[Aether DB] ${provider.name}/${model} not available, skipping…`);
          continue;
        }

        // Auth / server errors — still try the rest before giving up
        console.warn(
          `[Aether DB] ${provider.name}/${model} returned ${result.status}, trying next…`
        );
        continue;
      } catch (err) {
        // Network / fetch error for this pair — try the next one
        console.warn(
          `[Aether DB] ${provider.name}/${model} threw:`,
          err instanceof Error ? err.message : err
        );
        continue;
      }
    }

    // ── All pairs exhausted — return fallback schema (no visible error) ──
    console.error("[Aether DB] All providers exhausted, returning fallback schema");
    return NextResponse.json({
      schema: generateFallbackSchema(prompt),
      preview: null,
      model: "fallback-template",
      provider: "local",
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Fallback schema — returned when all providers are unavailable
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function generateFallbackSchema(prompt: string): SchemaOutput {
  const safePrompt = prompt.replace(/'/g, "''");

  return {
    schema_sql: `-- Fallback schema for: ${safePrompt}
-- Add GROQ_API_KEY or GEMINI_API_KEY to .env.local for AI-powered generation.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL, -- bcrypt/argon2 hashed
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT uq_users_username UNIQUE (username)
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_active ON users (id) WHERE deleted_at IS NULL;`,

    types_typescript: `import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password_hash: z.string(),
  is_active: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
});

export type User = z.infer<typeof UserSchema>;

export const UserInsertSchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

export type UserInsert = z.infer<typeof UserInsertSchema>;`,

    erd_mermaid: `erDiagram
    USERS {
        uuid id PK
        text email UK
        text username UK
        text password_hash
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }`,

    api_endpoints: `// Users
GET    /api/users           → List all users (with pagination)
GET    /api/users/:id       → Get user by ID
POST   /api/users           → Create new user
PATCH  /api/users/:id       → Update user
DELETE /api/users/:id       → Soft delete user`,

    seed_data_sql: `-- Seed users
INSERT INTO users (id, email, username, password_hash) VALUES
  (gen_random_uuid(), 'alice@example.com', 'alice', '$2b$10$placeholder...'),
  (gen_random_uuid(), 'bob@example.com', 'bob', '$2b$10$placeholder...');`,

    relationships: {
      entities: ["User"],
      cardinality: {},
    },

    design_decisions: [
      "This is a fallback template — configure an AI provider for full schema generation",
      "Used UUID primary keys for distributed system compatibility",
      "Added soft delete support with deleted_at timestamp",
      "Included partial index on active users for query performance",
    ],
  };
}
