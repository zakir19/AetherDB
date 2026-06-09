"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sidebar, type ChatSession } from "./sidebar";
import { CustomCursor, SvgBackground, MagneticWrap, SpotlightCard, ParallaxScroll } from "../animations/awwward-elements";
import { LogoReveal } from "../animations/logo-reveal";
import { ScrollProgressIndicator } from "../animations/scroll-progress";
import { CardDeal, CounterReveal, CTAreveal } from "../animations/section-reveal";
import { SchemaEditor } from "./schema-editor";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useToast } from "@/components/ui/toast";

/* ── Clerk auth bridge ────────────────────────────────────────
   Renders null but lifts auth state out of the ClerkProvider
   so the parent component doesn't need to call clerk hooks
   directly (which would fail when ClerkProvider is absent). */
interface ClerkAuthState {
  isSignedIn: boolean;
  user: {
    name: string;
    email: string;
    imageUrl?: string;
    initials: string;
  } | null;
}
function ClerkAuthBridge({ onAuthChange }: { onAuthChange: (s: ClerkAuthState) => void }) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  useEffect(() => {
    const name = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "User" : "User";
    const email = user?.primaryEmailAddress?.emailAddress ?? "";
    const imageUrl = user?.imageUrl;
    const initials = name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    onAuthChange({ isSignedIn: !!isSignedIn, user: user ? { name, email, imageUrl, initials } : null });
  }, [isSignedIn, user, onAuthChange]);
  return null;
}

/**
 * Whether Clerk has been configured with real keys.
 * When false we skip Clerk components so the navbar renders normally.
 */
const CLERK_ENABLED =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("CHANGE_ME");
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Theme hook — reads from next-themes.
   Returns a stable `true` (dark) on BOTH server and first client
   render so the HTML matches and there's no hydration mismatch.
   After mount it reads the real theme from localStorage/system. */
const useIsDark = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Before mount, always return dark (matches defaultTheme="dark")
  if (!mounted) return true;
  return resolvedTheme !== "light";
};

/* ================================================================
   Landing Page Data
   ================================================================ */
const FEATURES = [
  {
    title: "SQL Schema",
    tag: "Core Output",
    description: "Production-ready PostgreSQL with indexes, constraints, foreign keys, and row-level security policies — ready to paste into your migration.",
    gradient: "from-zinc-600 to-zinc-500",
    preview: `CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  role       user_role DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);`,
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
      </svg>
    ),
  },
  {
    title: "TypeScript Types",
    tag: "Type Safety",
    description: "Zod schemas and TypeScript interfaces auto-generated to perfectly mirror your database — no more manual type drift.",
    gradient: "from-zinc-500 to-zinc-400",
    preview: `export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['admin','member']),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;`,
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: "ERD Diagrams",
    tag: "Visualization",
    description: "Entity-relationship diagrams rendered in real-time — see how your tables connect before you write a single line of code.",
    gradient: "from-zinc-700 to-zinc-600",
    preview: `erDiagram
  USERS ||--o{ PROJECTS : owns
  PROJECTS ||--o{ TASKS : contains
  USERS ||--o{ COMMENTS : writes
  TASKS ||--o{ COMMENTS : receives`,
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
  },
  {
    title: "API Routes",
    tag: "Backend Ready",
    description: "RESTful endpoint definitions with fully typed request and response bodies, status codes, and error schemas.",
    gradient: "from-zinc-500 to-zinc-400",
    preview: `GET    /api/users          → UserList
POST   /api/users          → User
GET    /api/users/:id      → User
PATCH  /api/users/:id      → User
DELETE /api/users/:id      → 204

GET    /api/projects       → ProjectList
POST   /api/projects       → Project`,
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
  {
    title: "Seed Data",
    tag: "Dev Ready",
    description: "Realistic, relational test data for every table — seeded with proper foreign keys and constraints for instant development.",
    gradient: "from-zinc-600 to-zinc-500",
    preview: `INSERT INTO users (id, email, name, role) VALUES
  ('a1b2...', 'alice@example.com', 'Alice Chen', 'admin'),
  ('c3d4...', 'bob@example.com',   'Bob Smith',  'member'),
  ('e5f6...', 'carol@example.com', 'Carol Wu',   'member');

INSERT INTO projects (name, owner_id) VALUES
  ('Alpha Launch', 'a1b2...'),
  ('Beta Testing', 'c3d4...');`,
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375" />
      </svg>
    ),
  },
  {
    title: "Design Decisions",
    tag: "AI Insights",
    description: "The AI explains every architectural choice — normalization levels, indexing strategy, naming conventions, and scalability trade-offs.",
    gradient: "from-zinc-400 to-zinc-300",
    preview: `✓ Used UUIDs over BIGSERIAL for distributed safety
✓ Added partial index on active sessions only
✓ Denormalized display_name for read performance
✓ Chose JSONB over separate table for flexibility
⚠ Consider partitioning events table at >10M rows
⚠ Add covering index if querying by (user_id, date)`,
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
];

const DEMO_SQL = `CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  avatar_url TEXT,
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

CREATE INDEX idx_projects_owner ON projects(owner_id);`;

/* ================================================================
   Animated Counter
   ================================================================ */
function AnimatedCounter({ target, suffix, label, isDark }: { target: number; suffix: string; label: string; isDark: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const initialDisplay = target % 1 !== 0 ? target.toFixed(1) : Math.round(target).toLocaleString();
  const [display, setDisplay] = useState(initialDisplay);
  const prevTarget = useRef(target);

  useEffect(() => {
    if (!isInView) return;

    const startValue = prevTarget.current;
    const endValue = target;

    if (startValue === endValue) {
      const isDecimal = target % 1 !== 0;
      setDisplay(isDecimal ? target.toFixed(1) : Math.round(target).toLocaleString());
      return;
    }

    const duration = 1000;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    const step = (now: number) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const current = startValue + (endValue - startValue) * eased;

      setDisplay(isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString());

      if (elapsed < 1) {
        requestAnimationFrame(step);
      } else {
        prevTarget.current = endValue;
      }
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <div className="text-center">
      <div className={cn("text-4xl font-black tabular-nums sm:text-5xl lg:text-6xl", isDark ? "text-zinc-100" : "text-zinc-900")}>
        <span ref={ref}>{display}</span>
        <span className={cn("text-2xl sm:text-3xl", isDark ? "text-zinc-400" : "text-zinc-600")}>{suffix}</span>
      </div>
      <p className="mt-3 text-sm font-medium text-zinc-500">{label}</p>
    </div>
  );
}

/* ================================================================
   Live Preview
   ================================================================ */
function LivePreview({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observerRef.current.observe(iframe);
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !iframeRef.current || !html) return;
    iframeRef.current.srcdoc = html;
  }, [html, isVisible]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin"
      className="h-full w-full rounded-lg border-0 bg-zinc-950"
      title="Live Preview"
    />
  );
}

/* ================================================================
   Schema Block
   ================================================================ */
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
  follow_ups?: string[];
}

interface Message {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
  schema?: SchemaOutput;
  preview?: string | null;
  model?: string;
  provider?: string;
  followUps?: string[];
}

type SchemaTab = "erd" | "sql" | "types" | "api" | "seed" | "decisions";

function SchemaBlock({
  schema,
  preview,
  onEdit,
}: {
  schema: SchemaOutput;
  preview: string | null;
  onEdit?: (instruction: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<SchemaTab>(preview ? "erd" : "sql");
  const [copied, setCopied] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const isDark = useIsDark();
  const { toast } = useToast();

  const tabs: { key: SchemaTab; label: string; icon: React.ReactNode }[] = [
    ...(preview
      ? [
        {
          key: "erd" as SchemaTab,
          label: "ERD",
          icon: (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
            </svg>
          ),
        },
      ]
      : []),
    {
      key: "sql",
      label: "SQL Schema",
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 3.75c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      ),
    },
    {
      key: "types",
      label: "TypeScript",
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      ),
    },
    {
      key: "api",
      label: "API Routes",
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      ),
    },
    {
      key: "seed",
      label: "Seed Data",
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M12 12v-1.5" />
        </svg>
      ),
    },
    {
      key: "decisions",
      label: "Decisions",
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      ),
    },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case "sql": return schema.schema_sql;
      case "types": return schema.types_typescript;
      case "api": return schema.api_endpoints;
      case "seed": return schema.seed_data_sql;
      default: return "";
    }
  };

  const handleCopy = async () => {
    const content = activeTab === "decisions"
      ? schema.design_decisions.join("\n")
      : activeTab === "erd"
        ? schema.erd_mermaid
        : getTabContent();
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast("Copied to clipboard", { variant: "success" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Relationships summary */}
      {schema.relationships?.entities?.length > 0 && (
        <div className={cn(
          "flex flex-wrap items-center gap-2 text-xs",
          isDark ? "text-white/30" : "text-zinc-500"
        )}>
          <span className="font-medium">Entities:</span>
          {schema.relationships.entities.map((e) => (
            <span key={e} className={cn(
              "rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold",
              isDark ? "bg-zinc-500/10 text-zinc-300" : "bg-zinc-100 text-zinc-700"
            )}>
              {e}
            </span>
          ))}
        </div>
      )}

      {/* Main tabbed block */}
      <div className={cn(
        "overflow-hidden rounded-xl border",
        isDark ? "border-white/[0.06] bg-[#0c0c14]" : "border-slate-200 bg-white"
      )}>
        {/* Tab bar */}
        <div className={cn(
          "flex items-center justify-between border-b px-2 py-1.5 overflow-x-auto scrollbar-hide",
          isDark ? "border-white/[0.04]" : "border-slate-200"
        )}>
          <div className="flex gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all",
                  activeTab === tab.key
                    ? isDark
                      ? "bg-white/[0.08] text-white"
                      : "bg-slate-100 text-slate-900"
                    : isDark
                      ? "text-white/30 hover:text-white/60"
                      : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className={cn(
              "ml-2 flex-none rounded-lg p-1.5 transition-colors",
              isDark
                ? "text-white/30 hover:bg-white/[0.06] hover:text-white/60"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            )}
            title="Copy to clipboard"
          >
            {copied ? (
              <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            )}
          </button>

          {/* Edit button */}
          {onEdit && (
            <button
              onClick={() => setShowEditor(!showEditor)}
              className={cn(
                "ml-1 flex-none rounded-lg p-1.5 transition-colors",
                showEditor
                  ? "bg-zinc-500/20 text-zinc-300"
                  : isDark
                    ? "text-white/30 hover:bg-white/[0.06] hover:text-white/60"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              )}
              title="Edit schema"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
          )}
        </div>

        {/* Schema Editor overlay */}
        {showEditor ? (
          <div className="p-3">
            <SchemaEditor
              schemaSql={schema.schema_sql}
              isDark={isDark}
              onApply={(_sql, instruction) => {
                setShowEditor(false);
                onEdit?.(instruction);
              }}
              onClose={() => setShowEditor(false)}
            />
          </div>
        ) : (
          /* Content */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "erd" && preview ? (
              <div className="h-[450px]">
                <LivePreview html={preview} />
              </div>
            ) : activeTab === "decisions" ? (
              <div className={cn("max-h-[450px] overflow-auto p-4 space-y-3 scrollbar-thin", isDark ? "text-white/70" : "text-zinc-700")}>
                {schema.design_decisions.map((d, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "flex gap-3 text-sm p-3 rounded-xl transition-colors",
                      isDark ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50"
                    )}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span className={cn(
                      "mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-lg text-[10px] font-bold",
                      isDark ? "bg-zinc-500/15 text-zinc-300" : "bg-zinc-100 text-zinc-600"
                    )}>
                      {i + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{d}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <pre className={cn(
                "max-h-[450px] overflow-auto p-4 text-sm leading-relaxed scrollbar-thin",
                isDark ? "text-white/70" : "text-gray-700"
              )}>
                <code>{getTabContent()}</code>
              </pre>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   Typewriter Code Preview
   ================================================================ */
function TypewriterCode({ code, className, isDark }: { code: string; className?: string; isDark: boolean }) {
  const ref = useRef<HTMLPreElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [displayedCode, setDisplayedCode] = useState("");

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const chars = code.split("");
    const interval = setInterval(() => {
      if (i < chars.length) {
        setDisplayedCode(code.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [isInView, code]);

  return (
    <pre ref={ref} className={className}>
      <code>
        {displayedCode}
        {displayedCode.length < code.length && (
          <span className={cn(
            "inline-block w-[2px] h-[1.1em] align-middle ml-0.5",
            isDark ? "bg-zinc-400" : "bg-zinc-500"
          )} style={{ animation: "typing-cursor 1s steps(1) infinite" }} />
        )}
      </code>
    </pre>
  );
}

/* ================================================================
   Social Proof Marquee
   ================================================================ */
const MARQUEE_ITEMS = [
  "Trusted by 1,500+ developers",
  "10,000+ schemas generated",
  "Sub-2s generation time",
  "PostgreSQL • MySQL • SQLite",
  "TypeScript native",
  "Production-ready output",
  "AI-powered architecture",
  "Zero config setup",
  "Open source",
  "ERD visualization",
];

function MarqueeStrip({ isDark }: { isDark: boolean }) {
  return (
    <div className={cn(
      "relative z-10 overflow-hidden border-y py-4 backdrop-blur-sm",
      isDark ? "border-white/5 bg-zinc-950/60" : "border-zinc-200/50 bg-zinc-50/60"
    )}>
      {/* Gradient fades on edges */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none",
        isDark ? "bg-gradient-to-r from-zinc-950 to-transparent" : "bg-gradient-to-r from-white to-transparent"
      )} />
      <div className={cn(
        "absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none",
        isDark ? "bg-gradient-to-l from-zinc-950 to-transparent" : "bg-gradient-to-l from-white to-transparent"
      )} />

      <div className="flex animate-marquee whitespace-nowrap">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-3 group">
            <span className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors",
              isDark ? "bg-zinc-500 group-hover:bg-zinc-400" : "bg-zinc-400 group-hover:bg-zinc-500"
            )} />
            <span className={cn(
              "text-sm font-medium tracking-wide transition-colors",
              isDark ? "text-zinc-400 group-hover:text-zinc-300" : "text-zinc-500 group-hover:text-zinc-700"
            )}>
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   Typing Indicator
   ================================================================ */
function TypingIndicator() {
  const isDark = useIsDark();
  return (
    <div className="flex items-center gap-3 px-1">
      <div className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl relative overflow-hidden",
        isDark ? "bg-white/[0.06]" : "bg-zinc-100"
      )}>
        {/* Subtle pulse background */}
        <span className={cn(
          "absolute inset-0 rounded-xl animate-pulse opacity-30",
          isDark ? "bg-zinc-500" : "bg-zinc-400"
        )} />
        <div className="flex gap-1 relative z-10">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn("h-1.5 w-1.5 rounded-full", isDark ? "bg-zinc-300" : "bg-zinc-600")}
              animate={{
                y: [0, -5, 0],
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <span className={cn("text-sm font-medium", isDark ? "text-zinc-300" : "text-zinc-600")}>
          Generating schema
        </span>
        <span className={cn("text-xs", isDark ? "text-zinc-500" : "text-zinc-400")}>
          AI is analyzing your request
        </span>
      </div>
    </div>
  );
}


/* ================================================================
   AI Workflow Flow Diagram
   ================================================================ */
function AIWorkflowDiagram({ isDark }: { isDark: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Refs for each card and hub
  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const hubRef = useRef<HTMLDivElement>(null);

  // SVG line data computed from DOM measurements
  const [lines, setLines] = useState<{ d: string; id: string }[]>([]);

  const computeLines = useCallback(() => {
    const container = containerRef.current;
    const hub = hubRef.current;
    if (!container || !hub) return;

    const cRect = container.getBoundingClientRect();
    const hRect = hub.getBoundingClientRect();

    // Center of hub relative to container
    const hx = hRect.left - cRect.left + hRect.width / 2;
    const hy = hRect.top - cRect.top + hRect.height / 2;

    const newLines: { d: string; id: string }[] = [];
    const ids = ["schema", "types", "erd", "api"];

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cr = card.getBoundingClientRect();
      const cLeft = cr.left - cRect.left;
      const cTop = cr.top - cRect.top;
      const cRight = cLeft + cr.width;
      const cBottom = cTop + cr.height;
      const cx = cLeft + cr.width / 2;
      const cy = cTop + cr.height / 2;

      // Determine if left or right card
      const isLeft = cx < hx;
      const isTop = cy < hy;

      // Exit point: from the card's inner edge (toward the hub side), vertically centered
      let ex: number, ey: number;
      if (isLeft) {
        ex = cRight;
        ey = cy;
      } else {
        ex = cLeft;
        ey = cy;
      }

      // Entry point on hub's orb edge (use ~50px radius to land on the visible orb)
      const orbRadius = 42;
      const angle = Math.atan2(ey - hy, ex - hx);
      const hEntryX = hx + Math.cos(angle) * orbRadius;
      const hEntryY = hy + Math.sin(angle) * orbRadius;

      // Control points for elegant S-curve bezier:
      // CP1: horizontally out from card edge (maintains horizontal tangent at start)
      // CP2: horizontally in toward hub entry (maintains horizontal/angled tangent at end)
      const tension = 0.55; // higher = more curve
      const dx = hEntryX - ex;
      const cp1x = ex + dx * tension;
      const cp1y = ey;
      const cp2x = hEntryX - dx * tension;
      const cp2y = hEntryY;

      const d = `M ${ex.toFixed(1)} ${ey.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${hEntryX.toFixed(1)} ${hEntryY.toFixed(1)}`;

      newLines.push({ d, id: ids[i] });
    });

    setLines(newLines);
  }, []);

  useEffect(() => {
    if (!isInView) return;
    // Small delay to let animations settle
    const t = setTimeout(computeLines, 300);
    return () => clearTimeout(t);
  }, [isInView, computeLines]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(computeLines);
    observer.observe(container);
    return () => observer.disconnect();
  }, [computeLines]);

  const flowNodes: FlowNodeData[] = [
    {
      id: "schema",
      position: "top-left",
      title: "Schema Output",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
        </svg>
      ),
      items: [
        { label: "CREATE TABLE users", status: "done" },
        { label: "Foreign keys defined", status: "done" },
        { label: "Indexes optimized", status: "live" },
      ],
      badge: null,
    },
    {
      id: "types",
      position: "top-right",
      title: "TypeScript Types",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      ),
      items: [
        { label: "export type User = z.infer<…>", status: "done" },
        { label: "Zod schema generated", status: "done" },
        { label: "Type-safe API routes", status: "live" },
      ],
      badge: "LIVE",
    },
    {
      id: "erd",
      position: "bottom-left",
      title: "ERD Diagram",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      ),
      items: [
        { label: "USERS ||--o{ PROJECTS", status: "done" },
        { label: "Relationships mapped", status: "done" },
        { label: "Mermaid rendering", status: "running" },
      ],
      badge: null,
    },
    {
      id: "api",
      position: "bottom-right",
      title: "API Routes",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      ),
      items: [
        { label: "GET /api/users → UserList", status: "done" },
        { label: "POST /api/users → User", status: "done" },
        { label: "DELETE /api/users/:id", status: "running" },
      ],
      badge: null,
    },
  ];

  const lineColor = isDark ? "rgba(113,113,122,0.55)" : "rgba(161,161,170,0.5)";
  const glowColor = isDark ? "rgba(161,161,170,0.35)" : "rgba(113,113,122,0.3)";

  return (
    <div ref={sectionRef} className="relative">
      {/* Desktop: Grid layout with SVG connector overlay */}
      <div ref={containerRef} className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:grid-rows-[1fr_auto_1fr] lg:gap-8 lg:items-center relative">

        {/* ── Connector SVG — absolutely positioned over entire grid ── */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
          style={{ zIndex: 1 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Animated glow filter */}
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Dash animation for each line */}
            {lines.map((line) => (
              <style key={`style-${line.id}`}>{`
                @keyframes flow-dash-${line.id} {
                  from { stroke-dashoffset: 200; }
                  to { stroke-dashoffset: 0; }
                }
                @keyframes flow-pulse-${line.id} {
                  0%, 100% { opacity: 0.4; }
                  50% { opacity: 0.9; }
                }
              `}</style>
            ))}
          </defs>

          {lines.map((line, i) => (
            <g key={line.id}>
              {/* Glow/shadow layer */}
              <motion.path
                d={line.d}
                fill="none"
                stroke={glowColor}
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#lineGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.0, delay: 0.6 + i * 0.12, ease: "easeOut" }}
              />
              {/* Solid base line */}
              <motion.path
                d={line.d}
                fill="none"
                stroke={lineColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.0, delay: 0.6 + i * 0.12, ease: "easeOut" }}
              />
              {/* Animated flowing dash — passes along the line continuously */}
              {isInView && (
                <path
                  d={line.d}
                  fill="none"
                  stroke={isDark ? "rgba(212,212,216,0.8)" : "rgba(82,82,91,0.7)"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="12 180"
                  strokeDashoffset="0"
                  style={{
                    animation: `flow-dash-${line.id} 2.5s linear infinite`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
              )}
              {/* Second offset dash for richer effect */}
              {isInView && (
                <path
                  d={line.d}
                  fill="none"
                  stroke={isDark ? "rgba(212,212,216,0.4)" : "rgba(82,82,91,0.35)"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="6 180"
                  strokeDashoffset="0"
                  style={{
                    animation: `flow-dash-${line.id} 2.5s linear infinite`,
                    animationDelay: `${i * 0.4 + 1.25}s`,
                  }}
                />
              )}
            </g>
          ))}
        </svg>

        {/* Top-left: Schema Output */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-start-1 lg:row-start-1 relative z-10"
          onHoverStart={() => setActiveNode("schema")}
          onHoverEnd={() => setActiveNode(null)}
        >
          <div ref={(el) => { cardRefs.current[0] = el; }}>
            <FlowCard node={flowNodes[0]} isDark={isDark} isActive={activeNode === "schema"} />
          </div>
        </motion.div>

        {/* Top-right: TypeScript Types */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-start-3 lg:row-start-1 relative z-10"
          onHoverStart={() => setActiveNode("types")}
          onHoverEnd={() => setActiveNode(null)}
        >
          <div ref={(el) => { cardRefs.current[1] = el; }}>
            <FlowCard node={flowNodes[1]} isDark={isDark} isActive={activeNode === "types"} />
          </div>
        </motion.div>

        {/* Center hub */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-start-2 lg:row-start-2 flex items-center justify-center relative z-10"
        >
          <div ref={hubRef}>
            <CentralHub isDark={isDark} />
          </div>
        </motion.div>

        {/* Bottom-left: ERD */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-start-1 lg:row-start-3 relative z-10"
          onHoverStart={() => setActiveNode("erd")}
          onHoverEnd={() => setActiveNode(null)}
        >
          <div ref={(el) => { cardRefs.current[2] = el; }}>
            <FlowCard node={flowNodes[2]} isDark={isDark} isActive={activeNode === "erd"} />
          </div>
        </motion.div>

        {/* Bottom-right: API */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-start-3 lg:row-start-3 relative z-10"
          onHoverStart={() => setActiveNode("api")}
          onHoverEnd={() => setActiveNode(null)}
        >
          <div ref={(el) => { cardRefs.current[3] = el; }}>
            <FlowCard node={flowNodes[3]} isDark={isDark} isActive={activeNode === "api"} />
          </div>
        </motion.div>
      </div>

      {/* Mobile: Vertical stack with stagger */}
      <div className="lg:hidden grid gap-4 sm:grid-cols-2">
        {/* Center hub first on mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="sm:col-span-2 flex justify-center"
        >
          <CentralHub isDark={isDark} />
        </motion.div>
        {flowNodes.slice(0, 4).map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 * (i + 1), ease: [0.16, 1, 0.3, 1] }}
          >
            <FlowCard node={node} isDark={isDark} isActive={false} />
          </motion.div>
        ))}
      </div>

      {/* Bottom note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.4 }}
        className={cn("mt-12 text-center text-sm", isDark ? "text-zinc-500" : "text-zinc-400")}
      >
        All outputs generated simultaneously in <span className={cn("font-semibold", isDark ? "text-zinc-300" : "text-zinc-600")}>under 2 seconds</span>
      </motion.p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function CentralHub({ isDark }: { isDark: boolean }) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Outer ring */}
      <div className={cn(
        "absolute h-40 w-40 rounded-full border animate-pulse",
        isDark ? "border-zinc-700/40 bg-zinc-800/10" : "border-zinc-200/60 bg-zinc-50/30"
      )} />
      {/* Middle ring */}
      <div className={cn(
        "absolute h-28 w-28 rounded-full border",
        isDark ? "border-zinc-600/50 bg-zinc-800/20" : "border-zinc-300/50 bg-zinc-100/50"
      )} />
      {/* Core orb */}
      <motion.div
        className={cn(
          "relative z-10 flex h-20 w-20 items-center justify-center rounded-full border shadow-2xl",
          isDark
            ? "border-zinc-600/60 bg-gradient-to-br from-zinc-700 to-zinc-900 shadow-zinc-900/60"
            : "border-zinc-300 bg-gradient-to-br from-white to-zinc-100 shadow-zinc-300/50"
        )}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Aether DB logo mark */}
        <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" className={isDark ? "fill-zinc-800" : "fill-zinc-100"} />
          <path d="M20 6 L20 34 M12 12 L28 28 M12 28 L28 12" stroke={isDark ? "rgba(212,212,216,0.8)" : "rgba(39,39,42,0.7)"} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="20" cy="20" r="4" fill={isDark ? "rgba(212,212,216,0.9)" : "rgba(39,39,42,0.8)"} />
        </svg>
        {/* Ping glow */}
        <span className={cn(
          "absolute inset-0 rounded-full animate-ping opacity-10",
          isDark ? "bg-zinc-400" : "bg-zinc-500"
        )} />
      </motion.div>
      {/* Label below */}
      <div className={cn(
        "absolute -bottom-10 whitespace-nowrap text-xs font-semibold tracking-wide",
        isDark ? "text-zinc-400" : "text-zinc-500"
      )}>
        Aether AI Core
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
interface FlowNodeData {
  id: string;
  position: string;
  title: string;
  icon: React.ReactNode;
  items: { label: string; status: "done" | "live" | "running" }[];
  badge: string | null;
}

function FlowCard({ node, isDark, isActive }: { node: FlowNodeData; isDark: boolean; isActive: boolean }) {
  const statusColor = {
    done: isDark ? "text-emerald-400" : "text-emerald-600",
    live: isDark ? "text-blue-400" : "text-blue-600",
    running: isDark ? "text-amber-400" : "text-amber-600",
  };
  const statusLabel = {
    done: "Done",
    live: "Live",
    running: "Running",
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 cursor-default",
        isDark
          ? "border-zinc-700/60 bg-zinc-900/70 backdrop-blur-sm hover:border-zinc-600/80 hover:bg-zinc-900/90"
          : "border-zinc-200/80 bg-white/90 backdrop-blur-sm hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/40",
        isActive && (isDark ? "border-zinc-500/60 shadow-xl shadow-zinc-900/40" : "border-zinc-300 shadow-xl shadow-zinc-200/40")
      )}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600"
          )}>
            {node.icon}
          </div>
          <span className={cn("text-sm font-semibold", isDark ? "text-zinc-200" : "text-zinc-800")}>{node.title}</span>
        </div>
        {node.badge && (
          <span className="flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-500">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            {node.badge}
          </span>
        )}
      </div>

      {/* Items list */}
      <div className="space-y-2.5">
        {node.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span className={cn("flex-1 min-w-0 truncate text-xs font-mono", isDark ? "text-zinc-400" : "text-zinc-600")}>
              {item.label}
            </span>
            <span className={cn("flex-none text-[10px] font-bold", statusColor[item.status])}>
              {item.status === "done" && (
                <span className="flex items-center gap-0.5">
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3.293L4.707 8.586 2 5.879l-.707.707 3.414 3.414L10.707 4 10 3.293z" />
                  </svg>
                  Done
                </span>
              )}
              {item.status === "live" && (
                <span className="flex items-center gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  Live
                </span>
              )}
              {item.status === "running" && (
                <span className="flex items-center gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-ping" />
                  Running
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Inner glow */}
      <div className={cn(
        "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
        isActive && "opacity-100",
        isDark ? "bg-gradient-to-br from-zinc-700/10 to-transparent" : "bg-gradient-to-br from-zinc-200/20 to-transparent"
      )} />
    </motion.div>
  );
}

/* ================================================================
   AI Pipeline Steps Section
   ================================================================ */
function AIPipelineSteps({ isDark }: { isDark: boolean }) {
  const [activeStep, setActiveStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    {
      number: "01",
      title: "Natural Language Parsing",
      description: "The AI extracts entities, attributes, and implicit relationships from your plain-English description — no formal syntax required.",
      detail: `Input: "A recipe sharing platform where users can post recipes, comment, and bookmark favorites"
↳ Entities identified: users, recipes, comments, bookmarks
↳ Implicit: many-to-many bookmarks, one-to-many comments`,
      color: isDark ? "from-zinc-600 to-zinc-700" : "from-zinc-200 to-zinc-300",
      accent: isDark ? "text-zinc-300" : "text-zinc-700",
    },
    {
      number: "02",
      title: "Schema Normalization",
      description: "Aether applies 3NF normalization rules, identifies natural primary keys, and resolves many-to-many relationships via junction tables.",
      detail: `✓ Normalized to 3NF
✓ UUID primary keys for distributed safety  
✓ Junction table: user_recipe_bookmarks
✓ Soft-delete pattern applied to recipes`,
      color: isDark ? "from-zinc-500 to-zinc-600" : "from-zinc-100 to-zinc-200",
      accent: isDark ? "text-zinc-300" : "text-zinc-700",
    },
    {
      number: "03",
      title: "Index Strategy",
      description: "The engine analyzes likely query patterns and generates precise indexes — partial, covering, and composite — to maximize read performance.",
      detail: `CREATE INDEX idx_recipes_author ON recipes(author_id);
CREATE INDEX idx_comments_recipe ON comments(recipe_id, created_at DESC);
CREATE INDEX idx_bookmarks_user ON user_recipe_bookmarks(user_id);`,
      color: isDark ? "from-zinc-400 to-zinc-500" : "from-zinc-50 to-zinc-100",
      accent: isDark ? "text-zinc-300" : "text-zinc-700",
    },
    {
      number: "04",
      title: "Type Generation",
      description: "Every table becomes a Zod schema and TypeScript interface — with strict nullability, enum types, and inferred response shapes.",
      detail: `export const RecipeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  author_id: z.string().uuid(),
  created_at: z.date(),
});
export type Recipe = z.infer<typeof RecipeSchema>;`,
      color: isDark ? "from-zinc-600 to-zinc-700" : "from-zinc-200 to-zinc-300",
      accent: isDark ? "text-zinc-300" : "text-zinc-700",
    },
    {
      number: "05",
      title: "Output Assembly",
      description: "All artifacts are assembled simultaneously: SQL schema, TypeScript, Mermaid ERD, REST API spec, seed data, and design rationale.",
      detail: `✓ schema.sql — CREATE TABLE statements + migrations
✓ types.ts — Zod schemas + TypeScript interfaces  
✓ schema.mmd — Mermaid ERD diagram
✓ api-spec.txt — REST endpoint definitions
✓ seed.sql — Realistic test data with FK integrity`,
      color: isDark ? "from-zinc-500 to-zinc-600" : "from-zinc-100 to-zinc-200",
      accent: isDark ? "text-zinc-300" : "text-zinc-700",
    },
  ];

  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16 items-start">
      {/* Steps selector */}
      <div className="space-y-3">
        {steps.map((step, i) => (
          <motion.button
            key={step.number}
            onClick={() => setActiveStep(i)}
            className={cn(
              "w-full text-left group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
              activeStep === i
                ? isDark
                  ? "border-zinc-600/80 bg-zinc-900/90 shadow-lg shadow-zinc-900/40"
                  : "border-zinc-300 bg-white shadow-lg shadow-zinc-200/40"
                : isDark
                  ? "border-zinc-800/60 bg-zinc-900/30 hover:border-zinc-700/60 hover:bg-zinc-900/60"
                  : "border-zinc-200/60 bg-zinc-50/60 hover:border-zinc-300 hover:bg-white"
            )}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "flex h-9 w-9 flex-none items-center justify-center rounded-xl text-xs font-black transition-all duration-300",
                activeStep === i
                  ? isDark
                    ? "bg-zinc-200 text-zinc-900"
                    : "bg-zinc-900 text-white"
                  : isDark
                    ? "bg-zinc-800 text-zinc-400"
                    : "bg-zinc-200 text-zinc-600"
              )}>
                {step.number}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className={cn("text-sm font-bold transition-colors", activeStep === i ? (isDark ? "text-white" : "text-zinc-900") : (isDark ? "text-zinc-400" : "text-zinc-600"))}>
                  {step.title}
                </div>
                {activeStep === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn("mt-1.5 text-xs leading-relaxed", isDark ? "text-zinc-500" : "text-zinc-500")}
                  >
                    {step.description}
                  </motion.div>
                )}
              </div>
            </div>
            {/* Active indicator line */}
            {activeStep === i && (
              <motion.div
                layoutId="stepActiveIndicator"
                className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl", isDark ? "bg-zinc-400" : "bg-zinc-700")}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Active step detail panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className={cn(
              "overflow-hidden rounded-3xl border",
              isDark ? "border-zinc-700/60 bg-zinc-900/70 backdrop-blur-sm" : "border-zinc-200/80 bg-white/90 backdrop-blur-sm shadow-xl shadow-zinc-200/30"
            )}
          >
            {/* Terminal header */}
            <div className={cn(
              "flex items-center justify-between border-b px-6 py-4",
              isDark ? "border-zinc-800 bg-zinc-950/50" : "border-zinc-100 bg-zinc-50"
            )}>
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/90" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/90" />
                  <div className="h-3 w-3 rounded-full bg-green-400/90" />
                </div>
                <span className={cn("ml-2 text-xs font-medium font-mono", isDark ? "text-zinc-400" : "text-zinc-500")}>
                  step-{steps[activeStep].number}.aether
                </span>
              </div>
              <span className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-100 text-emerald-700"
              )}>
                {activeStep < 4 ? "processing" : "complete"}
              </span>
            </div>

            {/* Step title */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black",
                  isDark ? "bg-zinc-700 text-zinc-200" : "bg-zinc-200 text-zinc-700"
                )}>
                  {steps[activeStep].number}
                </div>
                <h3 className={cn("text-lg font-bold", isDark ? "text-white" : "text-zinc-900")}>
                  {steps[activeStep].title}
                </h3>
              </div>
              <p className={cn("mt-3 text-sm leading-relaxed", isDark ? "text-zinc-400" : "text-zinc-600")}>
                {steps[activeStep].description}
              </p>
            </div>

            {/* Code/detail block */}
            <div className="px-6 pb-6">
              <div className={cn(
                "overflow-hidden rounded-xl border",
                isDark ? "border-zinc-800 bg-zinc-950/80" : "border-zinc-200 bg-zinc-50"
              )}>
                <div className={cn(
                  "border-b px-4 py-2 text-[10px] font-mono",
                  isDark ? "border-zinc-800 text-zinc-500" : "border-zinc-100 text-zinc-400"
                )}>
                  output
                </div>
                <pre className={cn(
                  "p-4 text-xs leading-relaxed overflow-auto max-h-48",
                  isDark ? "text-zinc-300" : "text-zinc-700"
                )}>
                  <code>{steps[activeStep].detail}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-all",
              activeStep === 0
                ? isDark ? "text-zinc-700 cursor-not-allowed" : "text-zinc-300 cursor-not-allowed"
                : isDark ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
            )}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  activeStep === i
                    ? isDark ? "w-6 bg-zinc-300" : "w-6 bg-zinc-700"
                    : isDark ? "w-1.5 bg-zinc-700 hover:bg-zinc-600" : "w-1.5 bg-zinc-300 hover:bg-zinc-400"
                )}
              />
            ))}
          </div>
          <button
            onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps.length - 1}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-all",
              activeStep === steps.length - 1
                ? isDark ? "text-zinc-700 cursor-not-allowed" : "text-zinc-300 cursor-not-allowed"
                : isDark ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
            )}
          >
            Next
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ================================================================
   MAIN — AISchemaBuilder
   ================================================================ */
export function AISchemaBuilder() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [navScrolled, setNavScrolled] = useState(false);
  // Skip preloader if user just returned from an auth redirect
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return true;
    const skipIntro = sessionStorage.getItem('aether-skip-intro');
    if (skipIntro) {
      sessionStorage.removeItem('aether-skip-intro');
      return false;
    }
    return true;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const landingRef = useRef<HTMLDivElement>(null);
  const landingInputRef = useRef<HTMLInputElement>(null);
  const shouldAutoSendRef = useRef(false);

  const router = useRouter();
  const [authState, setAuthState] = useState<ClerkAuthState>({ isSignedIn: false, user: null });

  /* ── Load sessions from DB on sign-in ── */
  useEffect(() => {
    if (!authState.isSignedIn) return;
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data) => {
        if (data.sessions?.length) {
          setSessions(data.sessions.map((s: any) => ({
            id: s.id,
            title: s.title,
            timestamp: new Date(s.timestamp),
            messageCount: s.messageCount,
          })));
        }
      })
      .catch(() => { });
  }, [authState.isSignedIn]);

  /* Restore pending query that was saved before the auth redirect.
     We fire auto-send only after isSignedIn is confirmed so that
     requireAuth() inside handleSend() is satisfied. */
  useEffect(() => {
    if (!authState.isSignedIn) return;
    const pending = sessionStorage.getItem("aether-pending-query");
    if (pending) {
      sessionStorage.removeItem("aether-pending-query");
      setShowLanding(false);
      // Small delay to ensure session state is fully hydrated before send
      setTimeout(() => {
        setInput(pending);
        shouldAutoSendRef.current = true;
      }, 100);
    }
  }, [authState.isSignedIn]);

  /** Returns true if the user may proceed; otherwise redirects to sign-in. */
  const requireAuth = useCallback((query?: string): boolean => {
    if (!CLERK_ENABLED || authState.isSignedIn) return true;
    if (query) sessionStorage.setItem("aether-pending-query", query);
    // Mark that we should skip the intro animation on return
    sessionStorage.setItem('aether-skip-intro', '1');
    router.push("/sign-in");
    return false;
  }, [authState.isSignedIn, router]);

  const [stats, setStats] = useState({
    uiTime: 120,
    dbActive: 99,
    aetherStarted: 2,
    usersMakingDb: 1543,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        usersMakingDb: prev.usersMakingDb + Math.floor(Math.random() * 3) + 1,
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const isDark = useIsDark();
  const { setTheme } = useTheme();
  const { toast } = useToast();
  const [inputFocused, setInputFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroFlowRef = useRef<SVGSVGElement>(null);

  /* ── Navbar scroll-shrink ── */
  useEffect(() => {
    const handler = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* ── Global keyboard shortcuts ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N — New chat
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        setActiveSessionId(null);
        setInput("");
        setShowLanding(false);
        setSidebarOpen(false);
        setTimeout(() => inputRef.current?.focus(), 50);
        toast("New chat started", { variant: "default" });
      }
      // Ctrl/Cmd + B — Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
      // Ctrl/Cmd + K — Focus input
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (showLanding) {
          landingInputRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }
      // Escape — Close sidebar
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [sidebarOpen, showLanding, toast]);

  /* ── Flowing background lines in hero ── */
  useEffect(() => {
    const svg = heroFlowRef.current;
    if (!svg || !showLanding) return;
    const ns = "http://www.w3.org/2000/svg";
    const tweens: gsap.core.Tween[] = [];

    // Colour palette: light vs dark
    const palette = isDark
      ? ["rgba(212,212,216,0.55)", "rgba(161,161,170,0.45)", "rgba(113,113,122,0.6)", "rgba(244,244,245,0.35)"]
      : ["rgba(63,63,70,0.40)", "rgba(82,82,91,0.35)", "rgba(39,39,42,0.30)", "rgba(113,113,122,0.45)"];

    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const r = (min: number, max: number) => min + Math.random() * (max - min);

    // ── Group A: Ultra-shallow diagonals (~8–18°) ──────────────
    // These drift almost horizontally — gives a horizon-line feel
    for (let i = 0; i < 18; i++) {
      const line = document.createElementNS(ns, "line");
      const startX = r(-5, 110);   // % across viewport
      const startY = r(-15, -2);   // start just above viewport
      const driftX = r(4, 14);     // very small horizontal drift
      const length = r(28, 60);    // vertical travel distance (%)
      line.setAttribute("x1", `${startX}%`);
      line.setAttribute("y1", `${startY}%`);
      line.setAttribute("x2", `${startX + driftX}%`);
      line.setAttribute("y2", `${startY + length}%`);
      line.setAttribute("stroke", pick(palette));
      line.setAttribute("stroke-width", `${r(0.4, 1.1)}`);
      line.setAttribute("opacity", `${r(0.05, 0.14)}`);
      svg.appendChild(line);

      const dur = r(6, 14);
      const t = gsap.fromTo(
        line,
        { attr: { y1: `${startY - 10}%`, y2: `${startY + length - 10}%` } },
        {
          attr: { y1: `${110 + length}%`, y2: `${110 + length * 2}%` },
          duration: dur,
          repeat: -1,
          ease: "none",
          delay: r(0, dur),
        }
      );
      tweens.push(t);
    }

    // ── Group B: Mid-angle diagonals (~30–45°) ─────────────────
    for (let i = 0; i < 14; i++) {
      const line = document.createElementNS(ns, "line");
      const startX = r(-8, 108);
      const startY = r(-20, -5);
      const driftX = r(18, 38);    // moderate rightward drift
      const length = r(35, 70);
      line.setAttribute("x1", `${startX}%`);
      line.setAttribute("y1", `${startY}%`);
      line.setAttribute("x2", `${startX + driftX}%`);
      line.setAttribute("y2", `${startY + length}%`);
      line.setAttribute("stroke", pick(palette));
      line.setAttribute("stroke-width", `${r(0.3, 0.8)}`);
      line.setAttribute("opacity", `${r(0.04, 0.10)}`);
      svg.appendChild(line);

      const dur = r(7, 16);
      const t = gsap.fromTo(
        line,
        { attr: { y1: `${startY - 10}%`, y2: `${startY + length - 10}%` } },
        {
          attr: { y1: `${110 + length}%`, y2: `${110 + length * 2}%` },
          duration: dur,
          repeat: -1,
          ease: "none",
          delay: r(0, dur),
        }
      );
      tweens.push(t);
    }

    // ── Group C: Counter-diagonals (left-leaning, -15° to -40°) ─
    for (let i = 0; i < 10; i++) {
      const line = document.createElementNS(ns, "line");
      const startX = r(5, 115);
      const startY = r(-20, -3);
      const driftX = -r(10, 30);   // drift leftward
      const length = r(30, 65);
      line.setAttribute("x1", `${startX}%`);
      line.setAttribute("y1", `${startY}%`);
      line.setAttribute("x2", `${startX + driftX}%`);
      line.setAttribute("y2", `${startY + length}%`);
      line.setAttribute("stroke", pick(palette));
      line.setAttribute("stroke-width", `${r(0.3, 0.75)}`);
      line.setAttribute("opacity", `${r(0.03, 0.09)}`);
      svg.appendChild(line);

      const dur = r(8, 17);
      const t = gsap.fromTo(
        line,
        { attr: { y1: `${startY - 8}%`, y2: `${startY + length - 8}%` } },
        {
          attr: { y1: `${110 + length}%`, y2: `${110 + length * 2}%` },
          duration: dur,
          repeat: -1,
          ease: "none",
          delay: r(0, dur),
        }
      );
      tweens.push(t);
    }

    // ── Group D: Steep near-vertical lines (~75–88°) ───────────
    // Very fine, close-to-vertical — adds depth layering
    for (let i = 0; i < 10; i++) {
      const line = document.createElementNS(ns, "line");
      const startX = r(-2, 102);
      const startY = r(-25, -5);
      const driftX = r(-2, 2);     // nearly straight down
      const length = r(40, 90);
      line.setAttribute("x1", `${startX}%`);
      line.setAttribute("y1", `${startY}%`);
      line.setAttribute("x2", `${startX + driftX}%`);
      line.setAttribute("y2", `${startY + length}%`);
      line.setAttribute("stroke", pick(palette));
      line.setAttribute("stroke-width", `${r(0.2, 0.5)}`);
      line.setAttribute("opacity", `${r(0.03, 0.08)}`);
      svg.appendChild(line);

      const dur = r(9, 18);
      const t = gsap.fromTo(
        line,
        { attr: { y1: `${startY - 12}%`, y2: `${startY + length - 12}%` } },
        {
          attr: { y1: `${110 + length}%`, y2: `${110 + length * 2}%` },
          duration: dur,
          repeat: -1,
          ease: "none",
          delay: r(0, dur),
        }
      );
      tweens.push(t);
    }

    // ── Group E: Long "shooting star" lines — large drift, thin ─
    for (let i = 0; i < 6; i++) {
      const line = document.createElementNS(ns, "line");
      const startX = r(-5, 100);
      const startY = r(-30, -8);
      const driftX = r(20, 55);    // wide diagonal
      const length = r(50, 100);
      line.setAttribute("x1", `${startX}%`);
      line.setAttribute("y1", `${startY}%`);
      line.setAttribute("x2", `${startX + driftX}%`);
      line.setAttribute("y2", `${startY + length}%`);
      line.setAttribute("stroke", pick(palette));
      line.setAttribute("stroke-width", `${r(0.2, 0.45)}`);
      line.setAttribute("opacity", `${r(0.05, 0.12)}`);
      svg.appendChild(line);

      const dur = r(4, 9);         // faster — shooting-star feel
      const t = gsap.fromTo(
        line,
        { attr: { y1: `${startY - 15}%`, y2: `${startY + length - 15}%` } },
        {
          attr: { y1: `${110 + length}%`, y2: `${110 + length * 2}%` },
          duration: dur,
          repeat: -1,
          ease: "none",
          delay: r(0, dur * 3),
        }
      );
      tweens.push(t);

      // Shimmer pulse on each shooting-star line
      const pulse = gsap.to(line, {
        attr: { opacity: r(0.08, 0.18) },
        duration: r(0.8, 2),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: r(0, 2),
      });
      tweens.push(pulse);
    }

    return () => {
      tweens.forEach((t) => t.kill());
      while (svg.firstChild) svg.removeChild(svg.firstChild);
    };
  }, [showLanding, isDark]);

  useGSAP(() => {
    if (!showLanding) return;

    // Hero animations
    const tl = gsap.timeline();

    tl.fromTo(".hero-badge",
      { y: -50, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
    )
      .fromTo(".hero-title span",
        { y: 100, opacity: 0, rotateX: -90 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.2, ease: "power4.out" },
        "-=0.5"
      )
      .fromTo(".hero-desc",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.8"
      )
      .fromTo(".hero-input",
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.6"
      )
      .fromTo(".hero-tags button",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      );

    // Features scroll animations
    gsap.utils.toArray(".feature-card").forEach((card: any, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 100, rotateY: 15, scale: 0.9 },
        {
          opacity: 1, y: 0, rotateY: 0, scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Demo section animations
    gsap.fromTo(".demo-text > *",
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".demo-section",
          start: "top center",
        }
      }
    );

    gsap.fromTo(".demo-code",
      { opacity: 0, x: 50, rotateY: -15 },
      {
        opacity: 1, x: 0, rotateY: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".demo-section",
          start: "top center",
        }
      }
    );

  }, { dependencies: [showLanding], scope: containerRef });

  const activeMessages = activeSessionId ? messagesMap[activeSessionId] ?? [] : [];

  /* ── Auto scroll messages ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  /* ── Load messages for a session from DB ── */
  const loadSessionMessages = useCallback(async (sessionId: string) => {
    if (!authState.isSignedIn || messagesMap[sessionId]?.length) return;
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.messages?.length) {
        setMessagesMap((prev) => ({
          ...prev,
          [sessionId]: data.messages.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            schema: m.schema ?? undefined,
            preview: m.preview ?? undefined,
            model: m.model ?? undefined,
            provider: m.provider ?? undefined,
          })),
        }));
      }
    } catch { }
  }, [authState.isSignedIn, messagesMap]);

  /* ── Chat Logic ── */
  const createSession = useCallback(async (title: string) => {
    let id = Date.now().toString(36) + Math.random().toString(36).slice(2);

    // Persist to Neon DB when signed in
    if (authState.isSignedIn) {
      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        });
        if (res.ok) {
          const data = await res.json();
          id = data.id; // use the DB UUID
        }
      } catch { }
    }

    setSessions((prev) => [{ id, title, timestamp: new Date(), messageCount: 0 }, ...prev]);
    setActiveSessionId(id);
    setShowLanding(false);
    return id;
  }, [authState.isSignedIn]);

  const handleSend = useCallback(async (directPrompt?: string) => {
    const prompt = (directPrompt || input).trim();
    if (!prompt || isGenerating) return;
    if (!requireAuth(prompt)) return;   // redirect to sign-in if not authenticated
    let sessionId = activeSessionId || await createSession(prompt.length > 40 ? prompt.slice(0, 40) + "…" : prompt);

    const userMsg: Message = { id: Date.now().toString(36), role: "user", content: prompt };
    setMessagesMap((prev) => ({ ...prev, [sessionId]: [...(prev[sessionId] ?? []), userMsg] }));
    setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, messageCount: s.messageCount + 1, timestamp: new Date() } : s));
    setInput("");
    setIsGenerating(true);
    setShowLanding(false);

    // Persist user message to Neon DB
    if (authState.isSignedIn) {
      fetch(`/api/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", content: prompt }),
      }).catch(() => { });
    }

    try {
      // Build compact conversation history from last 6 messages
      const historyMsgs = (messagesMap[sessionId] ?? []).slice(-6).map((m) => {
        if (m.role === "assistant" && m.schema) {
          // Summarize schema to save tokens
          const entities = m.schema.relationships?.entities?.join(", ") || "";
          return { role: "assistant" as const, content: `Generated schema with tables: ${entities}. SQL:\n${m.schema.schema_sql?.slice(0, 500)}` };
        }
        return { role: m.role === "error" ? "assistant" as const : m.role as "user" | "assistant", content: m.content };
      });

      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, history: historyMsgs }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        id: Date.now().toString(36) + "r",
        role: data.error && !data.schema ? "error" : "assistant",
        content: data.error || "Schema generated",
        schema: data.schema,
        preview: data.preview,
        model: data.model,
        provider: data.provider,
        followUps: data.schema?.follow_ups,
      };
      setMessagesMap((prev) => ({ ...prev, [sessionId]: [...(prev[sessionId] ?? []), assistantMsg] }));

      // Persist assistant message to Neon DB
      if (authState.isSignedIn) {
        fetch(`/api/sessions/${sessionId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: assistantMsg.role,
            content: assistantMsg.content,
            schema: assistantMsg.schema,
            preview: assistantMsg.preview,
            model: assistantMsg.model,
            provider: assistantMsg.provider,
          }),
        }).catch(() => { });
      }
    } catch {
      setMessagesMap((prev) => ({
        ...prev,
        [sessionId]: [...(prev[sessionId] ?? []), { id: Date.now().toString(36) + "e", role: "error" as const, content: "Network error." }],
      }));
    } finally {
      setIsGenerating(false);
    }
  }, [input, isGenerating, activeSessionId, createSession, authState.isSignedIn, messagesMap]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  /* ── Auto-send prompt entered on landing page ── */
  useEffect(() => {
    if (shouldAutoSendRef.current && input.trim()) {
      shouldAutoSendRef.current = false;
      handleSend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const suggestions = [
    "A social network for chefs to share and rate recipes",
    "E-commerce platform with orders, payments, and reviews",
    "Project management tool like Trello with teams and boards",
    "Real-time chat app with channels, messages, and reactions",
  ];

  /* ── Time-of-day greeting ── */
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 5) return "Late night coding?";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 21) return "Good evening";
    return "Burning the midnight oil?";
  })();

  /* ====================================================================
     RENDER — Landing Page
     ==================================================================== */
  if (showLanding) {
    return (
      <motion.div
        key="landing-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        ref={landingRef}
        className={cn("selection:bg-zinc-500/30", isDark ? "bg-zinc-950 text-white" : "bg-white text-zinc-900")}
      >
        {/* Logo Reveal Intro */}
        {showIntro && <LogoReveal onComplete={() => setShowIntro(false)} isDark={isDark} />}
        <CustomCursor />
        <ScrollProgressIndicator isDark={isDark} />
        {/* ── HERO ── */}
        <section className="relative flex min-h-screen flex-col overflow-hidden">
          {/* Hero Gradient Background — pure CSS, GPU composited, zero decode cost */}
          <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
            {/* Base layer */}
            <div className={cn("absolute inset-0", isDark ? "bg-zinc-950" : "bg-white")} />
            {/* Animated orb 1 — top-left */}
            <div
              className={cn("absolute -top-1/4 -left-1/4 h-[80vw] w-[80vw] rounded-full blur-[120px]", isDark ? "bg-zinc-800/40" : "bg-zinc-200/60")}
              style={{ animation: "hero-orb-float 12s ease-in-out infinite", willChange: "transform" }}
            />
            {/* Animated orb 2 — bottom-right */}
            <div
              className={cn("absolute -bottom-1/4 -right-1/4 h-[70vw] w-[70vw] rounded-full blur-[100px]", isDark ? "bg-zinc-700/30" : "bg-zinc-100/80")}
              style={{ animation: "hero-orb-float 15s ease-in-out infinite reverse", animationDelay: "-5s", willChange: "transform" }}
            />
            {/* Animated orb 3 — center accent */}
            <div
              className={cn("absolute top-1/4 left-1/2 -translate-x-1/2 h-[60vw] w-[60vw] rounded-full blur-[140px]", isDark ? "bg-zinc-600/15" : "bg-zinc-50/90")}
              style={{ animation: "hero-orb-float 18s ease-in-out infinite", animationDelay: "-8s", willChange: "transform" }}
            />
            {/* Vignette/edge darkening for depth */}
            <div
              className="absolute inset-0"
              style={{
                background: isDark
                  ? `radial-gradient(ellipse 100% 80% at 50% 50%, transparent 20%, rgba(9,9,11,0.6) 100%)`
                  : `radial-gradient(ellipse 100% 80% at 50% 50%, transparent 20%, rgba(255,255,255,0.7) 100%)`,
              }}
            />
          </div>
          {/* Background */}
          <SvgBackground />
          {/* Flowing background lines */}
          <svg
            ref={heroFlowRef}
            className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
            style={{ overflow: "visible" }}
          />
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
              className={cn("absolute inset-0", isDark ? "opacity-20" : "opacity-10")}
              style={{
                backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(161,161,170,0.3)" : "rgba(161,161,170,0.15)"} 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          {/* Navbar */}
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed left-0 right-0 top-0 z-50 flex items-center justify-center transition-all duration-500",
              navScrolled ? "px-4 py-2" : "px-6 py-4"
            )}
          >
            <div className={cn(
              "flex w-full items-center justify-between rounded-2xl border backdrop-blur-xl transition-all duration-500",
              navScrolled ? "max-w-4xl px-3 py-2" : "max-w-6xl px-4 py-3",
              isDark
                ? "border-white/10 bg-zinc-950/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]"
                : "border-zinc-200/80 bg-white/70 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)]"
            )}>
              {/* ── Brand ── */}
              <Link href="/" className="group flex items-center gap-3 interactive-card">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-500 to-zinc-600 shadow-lg shadow-zinc-500/25 relative overflow-hidden"
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-fast" />
                  <svg className="h-5 w-5 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </motion.div>
                <span className={cn("text-lg font-bold tracking-tight transition-colors", isDark ? "text-white" : "text-zinc-900")}>
                  Aether DB
                </span>
              </Link>

              {/* ── Center Links ── */}
              <div className="hidden md:flex items-center gap-1 text-sm font-medium">
                {[
                  { href: "#features", label: "Features" },
                  { href: "#how-it-works", label: "How it Works" },
                  { href: "https://github.com/zakir19/AetherDB", label: "GitHub", external: true },
                ].map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={cn(
                      "relative px-4 py-2 rounded-lg transition-colors group",
                      isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {/* Hover background */}
                    <motion.div
                      className={cn(
                        "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity",
                        isDark ? "bg-white/5" : "bg-zinc-100"
                      )}
                      layoutId="navHover"
                    />
                    {/* Underline indicator */}
                    <span className={cn(
                      "absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-1/2 transition-all duration-300 rounded-full",
                      isDark ? "bg-zinc-400" : "bg-zinc-500"
                    )} />
                  </motion.a>
                ))}
              </div>

              {/* ── Right actions ── */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Theme toggle */}
                <motion.button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border transition-all relative overflow-hidden group",
                    isDark
                      ? "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:border-white/20"
                      : "border-zinc-200 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:border-zinc-300"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  <AnimatePresence mode="wait">
                    {isDark ? (
                      <motion.svg
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                      </motion.svg>
                    ) : (
                      <motion.svg
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Auth */}
                {CLERK_ENABLED ? (
                  <>
                    <SignedOut>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          href="/sign-in"
                          className={cn(
                            "rounded-xl px-4 sm:px-5 py-2.5 text-sm font-medium transition-all border block",
                            isDark
                              ? "border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 hover:border-white/20"
                              : "border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300"
                          )}
                        >
                          Sign in
                        </Link>
                      </motion.div>
                    </SignedOut>
                    <SignedIn>
                      <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
                    </SignedIn>
                  </>
                ) : (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/sign-in"
                      className={cn(
                        "rounded-xl px-4 sm:px-5 py-2.5 text-sm font-medium transition-all border block",
                        isDark
                          ? "border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 hover:border-white/20"
                          : "border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300"
                      )}
                    >
                      Sign in
                    </Link>
                  </motion.div>
                )}

                {/* Open App CTA */}
                <motion.button
                  onClick={() => { if (!requireAuth()) return; setShowLanding(false); setTimeout(() => inputRef.current?.focus(), 100); }}
                  className={cn(
                    "relative rounded-xl px-4 sm:px-5 py-2.5 text-sm font-semibold transition-all overflow-hidden group",
                    isDark
                      ? "bg-white/10 text-white border border-white/10 hover:border-white/20"
                      : "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-900"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">Open App</span>
                </motion.button>
              </div>
            </div>
          </motion.nav>

          {/* Hero Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-32 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "hero-badge mb-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-2 backdrop-blur-md cursor-default group",
                isDark
                  ? "border-zinc-500/20 bg-zinc-500/10 hover:bg-zinc-500/15 hover:border-zinc-500/30"
                  : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300"
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                  isDark ? "bg-emerald-400" : "bg-emerald-500"
                )} />
                <span className={cn(
                  "relative inline-flex h-2 w-2 rounded-full",
                  isDark ? "bg-emerald-500" : "bg-emerald-600"
                )} />
              </span>
              <span className={cn("text-xs font-semibold tracking-wide", isDark ? "text-zinc-300" : "text-zinc-700")}>
                AI-Powered Database Architecture
              </span>
              <span className={cn(
                "hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-200 text-zinc-600"
              )}>
                v2.0
              </span>
            </motion.div>

            <h1 className="hero-title max-w-5xl text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[1.05] tracking-tight">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  Design databases
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block bg-linear-to-r from-zinc-400 via-zinc-500 to-zinc-600 bg-clip-text text-transparent"
                >
                  in seconds,
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  not days.
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className={cn("hero-desc mx-auto mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg leading-relaxed", isDark ? "text-zinc-400" : "text-zinc-600")}
            >
              Describe any application in plain English. Aether DB generates
              complete <span className={cn("font-medium", isDark ? "text-zinc-300" : "text-zinc-700")}>PostgreSQL schemas</span>,{" "}
              <span className={cn("font-medium", isDark ? "text-zinc-300" : "text-zinc-700")}>TypeScript types</span>,{" "}
              <span className={cn("font-medium", isDark ? "text-zinc-300" : "text-zinc-700")}>ERDs</span>, and{" "}
              <span className={cn("font-medium", isDark ? "text-zinc-300" : "text-zinc-700")}>API routes</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="hero-input mt-10 sm:mt-12 w-full max-w-2xl"
            >
              <MagneticWrap className="w-full">
                <div
                  className={cn(
                    "group flex items-center gap-2 sm:gap-3 overflow-hidden rounded-full border p-2 sm:p-2.5 transition-all duration-500 focus-within:ring-4",
                    isDark
                      ? "border-white/10 bg-zinc-900/50 backdrop-blur-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] focus-within:ring-zinc-500/20 focus-within:border-zinc-500/30"
                      : "border-zinc-200/80 bg-white/80 backdrop-blur-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] focus-within:ring-zinc-400/20 focus-within:border-zinc-400/50"
                  )}
                >
                  <div className="pl-3 sm:pl-4 text-zinc-400 group-focus-within:text-zinc-500 transition-colors">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <input
                    ref={landingInputRef}
                    type="text"
                    placeholder="Describe your app — e.g. 'A recipe sharing platform'…"
                    className={cn(
                      "flex-1 bg-transparent px-2 py-2 sm:py-3 text-base sm:text-lg outline-none min-w-0",
                      isDark ? "text-white placeholder:text-zinc-500" : "text-zinc-900 placeholder:text-zinc-400"
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        const val = e.currentTarget.value.trim();
                        if (!requireAuth(val)) return;
                        setInput(val);
                        shouldAutoSendRef.current = true;
                        setShowLanding(false);
                      }
                    }}
                  />
                  <motion.button
                    onClick={() => {
                      const val = landingInputRef.current?.value?.trim();
                      if (!requireAuth(val || undefined)) return;
                      if (val) { setInput(val); shouldAutoSendRef.current = true; }
                      setShowLanding(false);
                      if (!val) setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    title="Generate schema"
                    className="flex h-10 w-10 sm:h-12 sm:w-12 flex-none items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 text-white transition-all shadow-lg relative overflow-hidden group/btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500" />
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </motion.button>
                </div>
              </MagneticWrap>
              <div className="hero-tags mt-6 flex flex-wrap justify-center gap-3">
                {["SaaS platform", "E-commerce store", "Chat application", "Project manager"].map((s) => (
                  <motion.button
                    key={s}
                    onClick={() => {
                      if (!requireAuth(s)) return;
                      setInput(s);
                      shouldAutoSendRef.current = true;
                      setShowLanding(false);
                    }}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:-translate-y-0.5",
                      isDark ? "border-white/8 text-zinc-400 hover:border-zinc-500/30 hover:text-zinc-300 hover:bg-zinc-500/5" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-600 hover:bg-zinc-50"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <div className={cn("flex flex-col items-center gap-2", isDark ? "text-white/30" : "text-slate-400")}>
                <span className="text-[10px] font-medium uppercase tracking-widest">Scroll</span>
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF MARQUEE ── */}
        <MarqueeStrip isDark={isDark} />

        {/* ── FEATURES BENTO ── */}
        <section id="features" className={cn("relative z-10 overflow-hidden px-6 py-32 lg:px-12", isDark ? "bg-zinc-950" : "bg-white")}>
          {/* Section background accent */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className={cn("absolute -top-40 left-1/4 h-125 w-125 rounded-full blur-[140px]", isDark ? "bg-zinc-700/20" : "bg-zinc-200/60")} />
            <div className={cn("absolute -bottom-24 right-1/4 h-100 w-100 rounded-full blur-[120px]", isDark ? "bg-zinc-600/15" : "bg-zinc-100/80")} />
          </div>

          <div className="relative mx-auto max-w-7xl">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="mx-auto mb-16 sm:mb-20 max-w-3xl text-center"
            >
              <motion.div
                className={cn(
                  "mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold backdrop-blur-sm cursor-default",
                  isDark ? "border-zinc-700 bg-zinc-800/60 text-zinc-300" : "border-zinc-200 bg-zinc-50 text-zinc-700"
                )}
                whileHover={{ scale: 1.02 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className={cn(
                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                    isDark ? "bg-emerald-400" : "bg-emerald-500"
                  )} />
                  <span className={cn(
                    "relative inline-flex h-2 w-2 rounded-full",
                    isDark ? "bg-emerald-500" : "bg-emerald-600"
                  )} />
                </span>
                6 outputs from every prompt
              </motion.div>
              <h2 className={cn(
                "text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.04]",
                isDark ? "text-white" : "text-zinc-900"
              )}>
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Everything you need
                </motion.span>{" "}
                <motion.span
                  className="mt-1 block bg-linear-to-r from-zinc-400 via-zinc-500 to-zinc-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  to architect
                </motion.span>
              </h2>
              <p className={cn("mx-auto mt-4 sm:mt-6 max-w-xl text-base sm:text-xl leading-relaxed", isDark ? "text-zinc-400" : "text-zinc-600")}>
                One prompt. Six production-ready outputs. From schema to API — all in under 2 seconds.
              </p>
            </motion.div>

            {/* ── Bento grid ── */}
            {/* Row 1: Large hero card (SQL) + tall right column (TS + ERD) */}
            <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">

              {/* ── Hero feature card — SQL Schema ── */}
              <CardDeal index={0}>
                <SpotlightCard className={cn(
                  "group relative flex h-full min-h-[28rem] flex-col overflow-hidden rounded-3xl border transition-all duration-500",
                  isDark
                    ? "border-white/10 bg-zinc-900/60 hover:border-zinc-500/30 hover:shadow-2xl hover:shadow-zinc-900/50"
                    : "border-zinc-200/80 bg-zinc-50/80 hover:border-zinc-300 hover:shadow-2xl hover:shadow-zinc-200/50"
                )}>
                  {/* Top meta */}
                  <div className="relative z-10 flex items-start justify-between p-6 sm:p-8 pb-4">
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
                        isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-200 text-zinc-600"
                      )}>
                        {FEATURES[0].tag}
                      </div>
                      <h3 className={cn("text-xl sm:text-2xl font-bold tracking-tight", isDark ? "text-white" : "text-zinc-900")}>
                        {FEATURES[0].title}
                      </h3>
                      <p className={cn("mt-2 max-w-sm text-sm sm:text-base leading-relaxed", isDark ? "text-zinc-400" : "text-zinc-600")}>
                        {FEATURES[0].description}
                      </p>
                    </div>
                    <motion.div
                      className={cn(
                        "flex h-12 w-12 sm:h-14 sm:w-14 flex-none items-center justify-center rounded-2xl bg-linear-to-br shadow-xl",
                        FEATURES[0].gradient
                      )}
                      whileHover={{ scale: 1.1, rotate: 6 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {FEATURES[0].icon}
                    </motion.div>
                  </div>
                  {/* Live code preview */}
                  <div className="relative flex-1 px-4 sm:px-8 pb-6 sm:pb-8 min-h-0">
                    <div className={cn(
                      "h-full overflow-hidden rounded-2xl border font-mono text-xs sm:text-sm",
                      isDark ? "border-white/10 bg-zinc-950/70" : "border-zinc-200 bg-white shadow-inner"
                    )}>
                      <div className={cn(
                        "flex items-center gap-2 border-b px-3 sm:px-4 py-2.5 sm:py-3",
                        isDark ? "border-white/8 bg-zinc-900/60" : "border-zinc-100 bg-zinc-50"
                      )}>
                        <div className="flex gap-1.5">
                          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400/80" />
                          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-400/80" />
                          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-400/80" />
                        </div>
                        <span className={cn("ml-2 text-[10px] sm:text-xs", isDark ? "text-zinc-500" : "text-zinc-400")}>schema.sql</span>
                      </div>
                      <TypewriterCode
                        code={FEATURES[0].preview || ""}
                        isDark={isDark}
                        className={cn("overflow-auto p-4 sm:p-5 text-[11px] sm:text-[12.5px] leading-relaxed", isDark ? "text-zinc-300" : "text-zinc-700")}
                      />
                    </div>
                  </div>
                  {/* Glow accent */}
                  <div className={cn("pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full blur-[80px] transition-opacity duration-500 group-hover:opacity-60", isDark ? "opacity-20 bg-zinc-500/30" : "opacity-0 bg-zinc-300/40")} />
                </SpotlightCard>
              </CardDeal>

              {/* Right column: TypeScript + ERD stacked */}
              <div className="grid gap-4">
                {[FEATURES[1], FEATURES[2]].map((f, i) => (
                  <CardDeal key={f.title} index={i + 1}>
                    <SpotlightCard className={cn(
                      "group relative flex h-full min-h-57 flex-col overflow-hidden rounded-3xl border transition-all duration-500",
                      isDark
                        ? "border-white/10 bg-zinc-900/60 hover:border-zinc-700/60"
                        : "border-zinc-200/80 bg-zinc-50/80 hover:border-zinc-300 hover:shadow-2xl hover:shadow-zinc-200/40"
                    )}>
                      <div className="flex flex-1 flex-col gap-4 p-7 lg:flex-row lg:items-start">
                        {/* Text */}
                        <div className="flex-1">
                          <div className={cn("mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-200 text-zinc-600")}>
                            {f.tag}
                          </div>
                          <h3 className={cn("text-lg font-bold tracking-tight", isDark ? "text-white" : "text-zinc-900")}>{f.title}</h3>
                          <p className={cn("mt-1.5 text-sm leading-relaxed", isDark ? "text-zinc-400" : "text-zinc-600")}>{f.description}</p>
                        </div>
                        {/* Mini preview */}
                        <div className={cn("w-full overflow-hidden rounded-xl border font-mono text-xs lg:w-56", isDark ? "border-white/8 bg-zinc-950/70" : "border-zinc-200 bg-white")}>
                          <div className={cn("border-b px-3 py-2 text-[10px]", isDark ? "border-white/8 text-zinc-500" : "border-zinc-100 text-zinc-400")}>{f.title.toLowerCase().replace(" ", ".")}.ts</div>
                          <TypewriterCode
                            code={f.preview?.slice(0, 120) || ""}
                            isDark={isDark}
                            className={cn("overflow-hidden p-3 text-[10px] leading-relaxed", isDark ? "text-zinc-400" : "text-zinc-600")}
                          />
                        </div>
                      </div>
                      <div className={cn("pointer-events-none absolute -left-8 -top-8 h-20 w-20 flex-none items-center justify-center rounded-2xl bg-linear-to-br shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 hidden", f.gradient)} />
                    </SpotlightCard>
                  </CardDeal>
                ))}
              </div>
            </div>

            {/* Row 2: Three equal cards — API Routes, Seed Data, Design Decisions */}
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[FEATURES[3], FEATURES[4], FEATURES[5]].map((f, i) => (
                <CardDeal key={f.title} index={i + 3}>
                  <SpotlightCard className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-500",
                    isDark
                      ? "border-white/10 bg-zinc-900/60 hover:border-zinc-700/60"
                      : "border-zinc-200/80 bg-zinc-50/80 hover:border-zinc-300 hover:shadow-2xl hover:shadow-zinc-200/40"
                  )}>
                    <div className="p-7 pb-3">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <div className={cn("mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-200 text-zinc-600")}>
                            {f.tag}
                          </div>
                          <h3 className={cn("text-xl font-bold tracking-tight", isDark ? "text-white" : "text-zinc-900")}>{f.title}</h3>
                        </div>
                        <div className={cn("flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-linear-to-br shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6", f.gradient)}>
                          {f.icon}
                        </div>
                      </div>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-zinc-400" : "text-zinc-600")}>{f.description}</p>
                    </div>
                    {/* Code preview */}
                    <div className={cn("mx-7 mb-7 mt-3 flex-1 overflow-hidden rounded-2xl border font-mono text-[11px]", isDark ? "border-white/8 bg-zinc-950/60" : "border-zinc-200 bg-white")}>
                      <div className={cn("border-b px-3 py-2 text-[10px]", isDark ? "border-white/8 text-zinc-500" : "border-zinc-100 text-zinc-400")}>{f.title.toLowerCase().replace(" ", "-")}.txt</div>
                      <TypewriterCode
                        code={f.preview || ""}
                        isDark={isDark}
                        className={cn("overflow-hidden p-4 leading-relaxed", isDark ? "text-zinc-400" : "text-zinc-600")}
                      />
                    </div>
                    <div className={cn("pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full blur-[60px] transition-opacity duration-500 group-hover:opacity-40", isDark ? "opacity-10 bg-zinc-600/40" : "opacity-0 bg-zinc-200/60")} />
                  </SpotlightCard>
                </CardDeal>
              ))}
            </div>

            {/* Bottom callout strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={cn("mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl border px-8 py-8 sm:flex-row", isDark ? "border-white/8 bg-zinc-900/40 backdrop-blur-sm" : "border-zinc-200/80 bg-zinc-50/80")}
            >
              <div className="flex flex-wrap items-center gap-6">
                {[
                  { label: "Zero Config" },
                  { label: "Copy & Paste Ready" },
                  { label: "No Signup Required" },
                  { label: "Every Output in Seconds" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={cn("text-sm font-semibold", isDark ? "text-zinc-300" : "text-zinc-700")}>{item.label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { if (!requireAuth()) return; setShowLanding(false); setTimeout(() => inputRef.current?.focus(), 100); }}
                className={cn(
                  "flex-none rounded-xl px-6 py-3 text-sm font-bold transition-all hover:scale-105 active:scale-95 whitespace-nowrap",
                  isDark ? "bg-white/10 text-white border border-white/10 hover:bg-white/15" : "bg-zinc-900 text-white hover:bg-zinc-800"
                )}
              >
                Try it free →
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── CODE DEMO ── */}
        <section id="how-it-works" className={cn("relative z-10 overflow-hidden px-6 py-32 lg:px-12", isDark ? "bg-zinc-950/80" : "bg-zinc-50")}>
          <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
            <div
              className="demo-text"
            >
              <div className={cn("mb-6 inline-flex rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide", isDark ? "bg-zinc-500/10 text-zinc-300 border border-zinc-500/20" : "bg-zinc-200 text-zinc-700 border border-zinc-300")}>
                How It Works
              </div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Describe it.{" "}
                <span className="bg-linear-to-r from-zinc-400 to-zinc-600 bg-clip-text text-transparent">We build it.</span>
              </h2>
              <p className={cn("mt-8 text-xl leading-relaxed", isDark ? "text-zinc-400" : "text-zinc-600")}>
                Just tell Aether DB what your application does. Our AI analyzes your
                description and generates a complete, normalized database architecture
                in under 2 seconds.
              </p>
              <div className="mt-10 space-y-0">
                {[
                  { step: "01", text: "Describe your application in plain English" },
                  { step: "02", text: "AI generates complete schema with relationships" },
                  { step: "03", text: "Export SQL, TypeScript types, ERD, and more" },
                ].map((s, i, arr) => (
                  <div key={s.step}>
                    <motion.div
                      className="flex items-center gap-5"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.6, delay: i * 0.2 }}
                    >
                      <motion.span
                        className={cn("flex h-12 w-12 flex-none items-center justify-center rounded-xl text-sm font-bold shadow-lg", isDark ? "bg-gradient-to-br from-zinc-700 to-zinc-800 text-zinc-200 border border-zinc-600" : "bg-gradient-to-br from-white to-zinc-100 text-zinc-700 border border-zinc-200 shadow-zinc-200/50")}
                        whileInView={{ scale: [0.5, 1.15, 1] }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.2 }}
                      >
                        {s.step}
                      </motion.span>
                      <span className={cn("text-lg font-medium", isDark ? "text-zinc-300" : "text-zinc-700")}>{s.text}</span>
                    </motion.div>
                    {/* Connecting line between steps */}
                    {i < arr.length - 1 && (
                      <motion.div
                        className={cn("ml-[23px] h-8 w-px", isDark ? "bg-gradient-to-b from-zinc-600 to-zinc-800" : "bg-gradient-to-b from-zinc-300 to-zinc-100")}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.2 + 0.3 }}
                        style={{ transformOrigin: "top" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <ParallaxScroll offset={40}>
              <div
                className={cn("demo-code overflow-hidden rounded-3xl border", isDark ? "border-white/10 bg-zinc-900/80 backdrop-blur-xl shadow-2xl shadow-black/50" : "border-zinc-200/80 bg-white/90 backdrop-blur-xl shadow-2xl shadow-zinc-200/50")}
              >
                <div className={cn("flex items-center gap-3 border-b px-6 py-4", isDark ? "border-white/10 bg-zinc-950/50" : "border-zinc-100 bg-zinc-50/50")}>
                  <div className="flex gap-2">
                    <div className="h-3.5 w-3.5 rounded-full bg-red-400/90 shadow-sm" />
                    <div className="h-3.5 w-3.5 rounded-full bg-yellow-400/90 shadow-sm" />
                    <div className="h-3.5 w-3.5 rounded-full bg-green-400/90 shadow-sm" />
                  </div>
                  <span className={cn("ml-3 text-sm font-medium font-mono", isDark ? "text-zinc-400" : "text-zinc-500")}>schema.sql</span>
                </div>
                <pre className={cn("overflow-auto p-8 text-sm leading-relaxed font-mono", isDark ? "text-zinc-300" : "text-zinc-700")}>
                  <code>{DEMO_SQL}</code>
                </pre>
              </div>
            </ParallaxScroll>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className={cn("relative z-10 px-6 py-24 lg:px-12", isDark ? "bg-zinc-950" : "bg-white")}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-12 max-w-xl text-center"
          >
            <h2 className={cn("text-3xl font-bold tracking-tight sm:text-4xl", isDark ? "text-white" : "text-zinc-900")}>Built for performance</h2>
            <p className={cn("mt-3 text-base", isDark ? "text-zinc-400" : "text-zinc-500")}>Real-time metrics from the Aether engine</p>
          </motion.div>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
            {[
              { target: stats.uiTime, suffix: "ms", label: "UI Generation Time" },
              { target: stats.dbActive, suffix: "%", label: "DB Active Status" },
              { target: stats.aetherStarted, suffix: "s", label: "Aether AI Started" },
              { target: stats.usersMakingDb, suffix: "+", label: "Users Making DB" },
            ].map((s, i) => (
              <CounterReveal key={s.label} index={i}>
                <div className={cn(
                  "relative rounded-2xl border p-6 text-center transition-all",
                  isDark ? "border-white/5 bg-zinc-900/40" : "border-zinc-200/60 bg-zinc-50/60"
                )}>
                  {/* Live indicator dot */}
                  <span className="absolute top-3 right-3 flex h-2 w-2">
                    <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", s.label === "DB Active Status" ? "bg-green-400" : "bg-zinc-400")} />
                    <span className={cn("relative inline-flex h-2 w-2 rounded-full", s.label === "DB Active Status" ? "bg-green-500" : "bg-zinc-500")} />
                  </span>
                  <AnimatedCounter target={s.target} suffix={s.suffix} label={s.label} isDark={isDark} />
                </div>
              </CounterReveal>
            ))}
          </div>
        </section>

        {/* ── AI WORKFLOW FLOW DIAGRAM ── */}
        <section className={cn("relative z-10 overflow-hidden px-6 py-32 lg:px-12", isDark ? "bg-zinc-950" : "bg-white")}>
          {/* Background accent */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-[160px]", isDark ? "bg-zinc-700/15" : "bg-zinc-200/40")} />
          </div>

          <div className="relative mx-auto max-w-7xl">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="mx-auto mb-20 max-w-3xl text-center"
            >
              <motion.div
                className={cn(
                  "mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold backdrop-blur-sm",
                  isDark ? "border-zinc-700 bg-zinc-800/60 text-zinc-300" : "border-zinc-200 bg-zinc-50 text-zinc-700"
                )}
                whileHover={{ scale: 1.02 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", isDark ? "bg-blue-400" : "bg-blue-500")} />
                  <span className={cn("relative inline-flex h-2 w-2 rounded-full", isDark ? "bg-blue-500" : "bg-blue-600")} />
                </span>
                Unified AI Pipeline
              </motion.div>
              <h2 className={cn("text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.04]", isDark ? "text-white" : "text-zinc-900")}>
                <motion.span className="inline-block" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                  One prompt.
                </motion.span>{" "}
                <motion.span className="mt-1 block bg-linear-to-r from-zinc-400 via-zinc-500 to-zinc-600 bg-clip-text text-transparent" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                  Everything connected.
                </motion.span>
              </h2>
              <p className={cn("mx-auto mt-4 sm:mt-6 max-w-xl text-base sm:text-xl leading-relaxed", isDark ? "text-zinc-400" : "text-zinc-600")}>
                Aether DB&apos;s AI engine orchestrates every output simultaneously — schema, types, diagrams, routes, and data all flow from a single intelligent core.
              </p>
            </motion.div>

            {/* Flow Diagram */}
            <AIWorkflowDiagram isDark={isDark} />
          </div>
        </section>

        {/* ── OUTPUT PIPELINE ── */}
        <section className={cn("relative z-10 overflow-hidden px-6 py-32 lg:px-12", isDark ? "bg-zinc-950/80" : "bg-zinc-50")}>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className={cn("absolute -top-32 right-0 h-[400px] w-[400px] rounded-full blur-[120px]", isDark ? "bg-zinc-600/10" : "bg-zinc-200/50")} />
            <div className={cn("absolute -bottom-32 left-0 h-[400px] w-[400px] rounded-full blur-[120px]", isDark ? "bg-zinc-700/10" : "bg-zinc-100/80")} />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="mx-auto mb-16 max-w-3xl text-center"
            >
              <motion.div
                className={cn(
                  "mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold backdrop-blur-sm",
                  isDark ? "border-zinc-700 bg-zinc-800/60 text-zinc-300" : "border-zinc-200 bg-zinc-50 text-zinc-700"
                )}
                whileHover={{ scale: 1.02 }}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                AI Reasoning Engine
              </motion.div>
              <h2 className={cn("text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.04]", isDark ? "text-white" : "text-zinc-900")}>
                <motion.span className="inline-block" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                  Built-in intelligence,
                </motion.span>{" "}
                <motion.span className="mt-1 block bg-linear-to-r from-zinc-400 via-zinc-500 to-zinc-600 bg-clip-text text-transparent" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                  not just generation.
                </motion.span>
              </h2>
              <p className={cn("mx-auto mt-4 sm:mt-6 max-w-xl text-base sm:text-xl leading-relaxed", isDark ? "text-zinc-400" : "text-zinc-600")}>
                Behind every schema is a multi-step reasoning chain — Aether thinks through normalization, indexes, data types, and relationships before writing a single line.
              </p>
            </motion.div>

            <AIPipelineSteps isDark={isDark} />
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative z-10 overflow-hidden px-6 py-32 lg:px-12">
          {/* Animated gradient mesh background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-600/10 via-transparent to-transparent" />
            <motion.div
              className={cn("absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full blur-[120px]", isDark ? "bg-zinc-600/20" : "bg-zinc-300/30")}
              animate={{ x: [0, 60, -30, 0], y: [0, -40, 20, 0], scale: [1, 1.2, 0.9, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className={cn("absolute -bottom-20 right-1/4 h-[400px] w-[400px] rounded-full blur-[100px]", isDark ? "bg-zinc-500/15" : "bg-zinc-200/40")}
              animate={{ x: [0, -50, 40, 0], y: [0, 30, -30, 0], scale: [1, 0.85, 1.15, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className={cn("absolute top-1/3 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full blur-[100px]", isDark ? "bg-zinc-700/15" : "bg-zinc-100/50")}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <CTAreveal>
            <div className="relative mx-auto max-w-4xl text-center">
              <h2 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                <motion.span
                  className="inline-block mr-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  Start
                </motion.span>
                <motion.span
                  className="inline-block bg-linear-to-r from-zinc-400 to-zinc-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                >
                  today
                </motion.span>
              </h2>
              <p className={cn("mx-auto mt-6 max-w-2xl text-xl", isDark ? "text-zinc-400" : "text-zinc-600")}>
                No signup required. Describe your application and get production-ready schemas instantly.
              </p>
              <div className="mt-12 flex flex-col items-center gap-4">
                <button
                  onClick={() => { setShowLanding(false); setTimeout(() => inputRef.current?.focus(), 100); }}
                  className={cn(
                    "group relative rounded-full px-10 py-5 text-lg font-semibold text-white shadow-xl transition-all hover:scale-105 active:scale-95",
                    isDark
                      ? "bg-gradient-to-r from-zinc-700 to-zinc-800 shadow-zinc-900/40 hover:from-zinc-600 hover:to-zinc-700"
                      : "bg-gradient-to-r from-zinc-800 to-zinc-900 shadow-zinc-300/50 hover:from-zinc-700 hover:to-zinc-800"
                  )}
                >
                  <span className="relative z-10">Start Building — Free</span>
                  {/* Button glow effect */}
                  <div className={cn("absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-xl", isDark ? "bg-zinc-500/20" : "bg-zinc-400/20")} />
                </button>
                <span className={cn("text-xs tracking-wide", isDark ? "text-zinc-500" : "text-zinc-400")}>No credit card required</span>
              </div>
            </div>
          </CTAreveal>
        </section>

        {/* ── FOOTER ── */}
        <footer className={cn("relative z-20 border-t px-6 py-12 lg:px-12", isDark ? "border-white/5 bg-zinc-950" : "border-zinc-200 bg-zinc-50")}>
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-500 to-zinc-600">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <span className={cn("text-sm font-semibold", isDark ? "text-white/70" : "text-zinc-700")}>Aether DB</span>
            </div>
            <p className={cn("text-sm", isDark ? "text-zinc-600" : "text-zinc-400")}>© 2026 Aether DB. Designed for architects.</p>
          </div>
        </footer>
      </motion.div>
    );
  }

  /* ====================================================================
     RENDER — Chat View
     ==================================================================== */
  return (
    <motion.div
      key="chat-view"
      initial={{ opacity: 0, scale: 0.97, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative flex h-screen flex-col overflow-hidden", isDark ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900")}
    >
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className={cn("absolute inset-0", isDark ? "opacity-20" : "opacity-10")}
          style={{
            backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(161,161,170,0.3)" : "rgba(161,161,170,0.15)"} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-40 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-zinc-600/10 blur-[160px]" />
      </div>

      <header className={cn("relative z-10 flex items-center justify-between border-b px-3 sm:px-4 py-2.5 sm:py-3", isDark ? "border-white/[0.04] bg-zinc-950/60 backdrop-blur-xl" : "border-zinc-200 bg-white/60 backdrop-blur-xl")}>
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            onClick={() => setSidebarOpen(true)}
            title="Open sidebar (Ctrl+B)"
            className={cn("flex h-9 w-9 items-center justify-center rounded-xl transition-all", isDark ? "text-white/40 hover:bg-white/[0.06] hover:text-white/60" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </motion.button>
          <motion.button
            onClick={() => setShowLanding(true)}
            className="flex items-center gap-2 transition-all group"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-500 to-zinc-600 shadow-sm shadow-zinc-500/25"
              whileHover={{ rotate: 5 }}
            >
              <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7l9 5 9-5-9-5z" />
                <path d="M3 17l9 5 9-5" />
                <path d="M3 12l9 5 9-5" />
              </svg>
            </motion.div>
            <span className={cn("text-sm font-bold tracking-tight hidden sm:block", isDark ? "text-white" : "text-zinc-900")}>Aether DB</span>
          </motion.button>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <motion.button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={cn("flex h-9 w-9 items-center justify-center rounded-xl transition-all", isDark ? "text-white/40 hover:bg-white/[0.06] hover:text-white/60" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.svg
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.button
            onClick={() => { setActiveSessionId(null); setInput(""); }}
            title="New chat (Ctrl+N)"
            className={cn("flex h-9 items-center gap-1.5 rounded-xl px-2.5 sm:px-3 text-xs font-semibold transition-all", isDark ? "text-white/40 hover:bg-white/[0.06] hover:text-white/60" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            <span className="hidden sm:inline">New</span>
          </motion.button>
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide">
        {activeMessages.length === 0 ? (
          <div className="relative flex h-full flex-col items-center justify-center px-6">
            {/* Ambient background orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.div
                className={cn("absolute left-1/4 top-1/3 h-[300px] w-[300px] rounded-full blur-[120px]", isDark ? "bg-zinc-700/10" : "bg-zinc-300/15")}
                animate={{ x: [0, 40, -20, 0], y: [0, -30, 15, 0], scale: [1, 1.15, 0.9, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className={cn("absolute right-1/4 bottom-1/3 h-[250px] w-[250px] rounded-full blur-[100px]", isDark ? "bg-zinc-600/8" : "bg-zinc-200/20")}
                animate={{ x: [0, -30, 25, 0], y: [0, 20, -25, 0], scale: [1, 0.9, 1.1, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-8"
            >
              <div className={cn("flex h-20 w-20 items-center justify-center rounded-3xl shadow-2xl", isDark ? "bg-gradient-to-br from-zinc-500/20 to-zinc-600/20 shadow-zinc-500/10 border border-white/10" : "bg-gradient-to-br from-zinc-100 to-zinc-200 shadow-zinc-200/50 border border-white")}>
                <svg className={cn("h-10 w-10", isDark ? "text-zinc-300" : "text-zinc-700")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L3 7l9 5 9-5-9-5z" />
                  <path d="M3 17l9 5 9-5" />
                  <path d="M3 12l9 5 9-5" />
                </svg>
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className={cn("mb-2 text-sm font-medium tracking-wide", isDark ? "text-zinc-500" : "text-zinc-400")}
            >
              {greeting} ✦
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn("mb-3 text-2xl font-bold tracking-tight sm:text-3xl", isDark ? "text-white" : "text-zinc-900")}
            >
              What system should we architect?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cn("mb-10 max-w-md text-center text-base", isDark ? "text-zinc-400" : "text-zinc-500")}
            >
              Describe any application and I&apos;ll generate the complete database schema, types, ERD, and API routes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid w-full max-w-2xl gap-3 sm:grid-cols-2"
            >
              {suggestions.map((s, i) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
                  onClick={() => {
                    if (!requireAuth(s)) return;
                    setInput(s);
                    shouldAutoSendRef.current = true;
                  }}
                  className={cn("group relative overflow-hidden rounded-2xl border p-4 text-left text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl", isDark ? "border-white/[0.06] bg-white/[0.02] text-zinc-300 hover:border-zinc-500/30 hover:bg-zinc-500/5 hover:shadow-zinc-500/10" : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:shadow-zinc-200/50")}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/0 to-zinc-600/0 transition-colors duration-300 group-hover:from-zinc-500/5 group-hover:to-zinc-600/5" />
                  {/* Suggestion icon */}
                  <svg className={cn("relative z-10 mb-2 h-4 w-4 opacity-40 group-hover:opacity-70 transition-opacity", isDark ? "text-zinc-400" : "text-zinc-500")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  <span className="relative z-10">{s}</span>
                </motion.button>
              ))}
            </motion.div>

            {/* Keyboard shortcut hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className={cn("mt-8 flex items-center gap-4 text-[11px]", isDark ? "text-zinc-600" : "text-zinc-400")}
            >
              <span className="flex items-center gap-1.5">
                <kbd className={cn("rounded-md border px-1.5 py-0.5 font-mono text-[10px]", isDark ? "border-white/[0.06] bg-white/[0.03]" : "border-zinc-200 bg-zinc-100")}>Ctrl</kbd>
                <span>+</span>
                <kbd className={cn("rounded-md border px-1.5 py-0.5 font-mono text-[10px]", isDark ? "border-white/[0.06] bg-white/[0.03]" : "border-zinc-200 bg-zinc-100")}>B</kbd>
                <span>Sidebar</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className={cn("rounded-md border px-1.5 py-0.5 font-mono text-[10px]", isDark ? "border-white/[0.06] bg-white/[0.03]" : "border-zinc-200 bg-zinc-100")}>Ctrl</kbd>
                <span>+</span>
                <kbd className={cn("rounded-md border px-1.5 py-0.5 font-mono text-[10px]", isDark ? "border-white/[0.06] bg-white/[0.03]" : "border-zinc-200 bg-zinc-100")}>N</kbd>
                <span>New Chat</span>
              </span>
            </motion.div>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
            <AnimatePresence mode="popLayout">
              {activeMessages.map((msg) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  key={msg.id}
                >
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className={cn("max-w-[80%] rounded-3xl rounded-tr-sm px-6 py-4 text-[15px] leading-relaxed shadow-lg", isDark ? "bg-gradient-to-br from-zinc-600 to-zinc-700 text-white shadow-zinc-900/20" : "bg-gradient-to-br from-zinc-500 to-zinc-600 text-white shadow-zinc-200/50")}>
                        {msg.content}
                      </div>
                    </div>
                  ) : msg.role === "error" ? (
                    <div className={cn("flex items-center gap-3 rounded-2xl border p-5 text-[15px] shadow-sm", isDark ? "border-red-500/20 bg-red-500/5 text-red-300" : "border-red-200 bg-red-50 text-red-700")}>
                      <svg className="h-6 w-6 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                      {msg.content}
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <div className={cn("flex h-10 w-10 flex-none items-center justify-center rounded-xl shadow-sm", isDark ? "bg-white/10 border border-white/10" : "bg-white border border-zinc-200")}>
                        <svg className={cn("h-5 w-5", isDark ? "text-zinc-300" : "text-zinc-600")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L3 7l9 5 9-5-9-5z" />
                          <path d="M3 17l9 5 9-5" />
                          <path d="M3 12l9 5 9-5" />
                        </svg>
                      </div>
                      <div className="flex-1 space-y-4 overflow-hidden">
                        {msg.schema ? <SchemaBlock schema={msg.schema} preview={msg.preview || null} onEdit={(instruction) => handleSend(instruction)} /> : <div className={cn("rounded-2xl border p-5 text-[15px] leading-relaxed shadow-sm", isDark ? "border-white/[0.06] bg-white/[0.02] text-zinc-300" : "border-zinc-200 bg-white text-zinc-700")}>{msg.content}</div>}
                        {/* Follow-up suggestion chips */}
                        {msg.followUps && msg.followUps.length > 0 && !isGenerating && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {msg.followUps.map((fu) => (
                              <button
                                key={fu}
                                onClick={() => { handleSend(fu); }}
                                className={cn(
                                  "group flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                                  isDark
                                    ? "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-zinc-500/30 hover:bg-zinc-500/10 hover:text-zinc-200"
                                    : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-700"
                                )}
                              >
                                <svg className="h-3 w-3 flex-none opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                                {fu}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isGenerating && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="flex gap-4">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className={cn("flex h-10 w-10 flex-none items-center justify-center rounded-xl shadow-sm", isDark ? "bg-white/10 border border-white/10" : "bg-white border border-zinc-200")}>
                  <svg className={cn("h-5 w-5", isDark ? "text-zinc-300" : "text-zinc-600")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L3 7l9 5 9-5-9-5z" />
                    <path d="M3 17l9 5 9-5" />
                    <path d="M3 12l9 5 9-5" />
                  </svg>
                </motion.div>
                <div className="flex items-center pt-2">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={cn("relative z-10 border-t p-4 sm:p-6", isDark ? "border-white/[0.04] bg-zinc-950/80 backdrop-blur-xl" : "border-zinc-200 bg-white/80 backdrop-blur-xl")}>
        <div className="mx-auto max-w-4xl">
          <motion.div
            animate={inputFocused ? { scale: 1.012, y: -2 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "relative flex items-end gap-3 rounded-3xl border p-2 shadow-lg transition-shadow duration-300",
              inputFocused
                ? isDark ? "border-zinc-400/30 shadow-2xl shadow-zinc-500/10 ring-1 ring-zinc-400/20" : "border-zinc-400/40 shadow-2xl shadow-zinc-400/10 ring-1 ring-zinc-300/50"
                : isDark ? "border-white/[0.08] shadow-black/50" : "border-zinc-200 shadow-zinc-200/50",
              isDark ? "bg-white/[0.03]" : "bg-white"
            )}>
            {/* Animated gradient border accent on focus */}
            <motion.div
              animate={{ opacity: inputFocused ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, rgba(161,161,170,0.06) 0%, transparent 50%, rgba(161,161,170,0.03) 100%)"
                  : "linear-gradient(135deg, rgba(113,113,122,0.04) 0%, transparent 50%, rgba(113,113,122,0.02) 100%)",
              }}
            />
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Describe your application or system..."
              rows={1}
              className={cn("max-h-40 flex-1 resize-none bg-transparent px-4 py-3 text-[15px] outline-none", isDark ? "text-white placeholder:text-zinc-500" : "text-zinc-900 placeholder:text-zinc-400")}
              style={{ height: "auto", minHeight: "48px" }}
            />
            {/* Model badge */}
            <div className={cn("mb-2 mr-1 flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-medium select-none", isDark ? "bg-white/[0.04] text-zinc-500" : "bg-zinc-100 text-zinc-400")}>
              <span className="flex h-1.5 w-1.5">
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span>Grok</span>
            </div>
            <motion.button
              onClick={() => handleSend()}
              disabled={!input.trim() || isGenerating}
              title="Send message"
              className={cn(
                "mb-1 mr-1 flex h-10 w-10 flex-none items-center justify-center rounded-2xl transition-all duration-300 relative overflow-hidden group",
                input.trim() && !isGenerating
                  ? "bg-gradient-to-br from-zinc-500 to-zinc-600 text-white shadow-md hover:shadow-lg"
                  : isDark ? "bg-white/[0.04] text-white/20" : "bg-zinc-100 text-zinc-400"
              )}
              whileHover={input.trim() && !isGenerating ? { scale: 1.05 } : {}}
              whileTap={input.trim() && !isGenerating ? { scale: 0.95 } : {}}
            >
              {/* Shine effect */}
              {input.trim() && !isGenerating && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              )}
              <svg className="h-5 w-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 flex items-center justify-between px-2">
            <span className={cn("text-[11px]", isDark ? "text-zinc-600" : "text-zinc-400")}>
              {input.length > 0 && <span>{input.length} chars</span>}
            </span>
            <span className={cn("text-[11px]", isDark ? "text-zinc-500" : "text-zinc-400")}>Aether DB can make mistakes. Verify important schemas.</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Lift Clerk auth state out safely (only rendered when ClerkProvider is present) */}
      {CLERK_ENABLED && <ClerkAuthBridge onAuthChange={setAuthState} />}

      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} sessions={sessions} activeSessionId={activeSessionId} onNewChat={() => { setActiveSessionId(null); setInput(""); setSidebarOpen(false); toast("New chat started"); }} onSelectSession={(id) => { setActiveSessionId(id); setShowLanding(false); setSidebarOpen(false); loadSessionMessages(id); }} onDeleteSession={(id) => { setSessions((prev) => prev.filter((s) => s.id !== id)); if (activeSessionId === id) setActiveSessionId(null); setMessagesMap((prev) => { const copy = { ...prev }; delete copy[id]; return copy; }); if (authState.isSignedIn) { fetch(`/api/sessions/${id}`, { method: "DELETE" }).catch(() => { }); } toast("Session deleted", { variant: "default" }); }} onResetAll={() => { setSessions([]); setActiveSessionId(null); setMessagesMap({}); setShowLanding(true); setSidebarOpen(false); if (authState.isSignedIn) { fetch("/api/sessions", { method: "DELETE" }).catch(() => { }); } toast("All conversations cleared", { variant: "default" }); }} user={authState.user} />
    </motion.div>
  );
}
