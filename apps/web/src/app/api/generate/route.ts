import { NextRequest, NextResponse } from "next/server";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SYSTEM PROMPT — Expert Database Architect & Schema Designer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SYSTEM_PROMPT = `You are an expert database architect. Given a user's application description, generate a complete production-ready database schema.

RETURN A SINGLE JSON OBJECT with exactly these keys:
{
  "schema_sql": "-- PostgreSQL DDL (CREATE TABLE, indexes, constraints, triggers)",
  "types_typescript": "// Zod schemas with inferred TS types (Insert, Update, Select per table)",
  "erd_mermaid": "erDiagram\\n  USERS ||--o{ POSTS : \\"writes\\"\\n  ...",
  "api_endpoints": "// RESTful Express/Next.js routes with CRUD",
  "seed_data_sql": "-- 3-5 realistic INSERT statements per table using gen_random_uuid()",
  "relationships": { "entities": ["User","Post"], "cardinality": { "User → Post": "1:N" } },
  "design_decisions": ["Reason for each key design choice"]
}

SCHEMA RULES:
• Tables: plural snake_case. Columns: singular snake_case
• UUIDs for PKs (gen_random_uuid()). BIGSERIAL only for logs/analytics
• ALWAYS: created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at, deleted_at (soft delete)
• TEXT over VARCHAR, TIMESTAMPTZ over TIMESTAMP, NUMERIC for money, JSONB over JSON
• 3NF by default. Index all FKs and WHERE/ORDER BY columns
• NOT NULL for required fields, CHECK constraints for business rules, UNIQUE on natural keys
• CASCADE for dependent children, SET NULL for optional refs, RESTRICT for critical refs
• Naming: idx_<table>_<cols>, fk_<table>_<ref>, uq_<table>_<cols>

TYPESCRIPT: Use Zod. Generate Insert (omit auto fields), Update (partial + required id), Select schemas per table.

ERD: Valid Mermaid erDiagram syntax. Show all tables, columns with PK/FK/UK markers, and relationship cardinality.

API: RESTful with plural nouns, pagination, auth annotations.

CRITICAL:
- Return ONLY the JSON object — no markdown fences, no explanations
- Be opinionated: make confident design decisions and list them
- Think about query patterns before adding indexes`;

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
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: "json_object" },
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
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: "json_object" },
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
        generationConfig: { temperature: 0.3, maxOutputTokens: 4096, responseMimeType: "application/json" },
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
