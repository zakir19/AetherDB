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
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import gsap from "gsap";

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
    description: "Production-ready PostgreSQL with indexes, constraints, and RLS policies.",
    gradient: "from-zinc-500 to-zinc-400",
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
      </svg>
    ),
  },
  {
    title: "TypeScript Types",
    description: "Zod schemas and interfaces that mirror your database structure exactly.",
    gradient: "from-zinc-600 to-zinc-500",
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: "ERD Diagrams",
    description: "Visual entity-relationship diagrams rendered in real-time from your schema.",
    gradient: "from-zinc-400 to-zinc-300",
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
  },
  {
    title: "API Routes",
    description: "RESTful endpoint definitions with typed request and response bodies.",
    gradient: "from-zinc-500 to-zinc-400",
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
  {
    title: "Seed Data",
    description: "Realistic test data for every table, ready for development and testing.",
    gradient: "from-zinc-600 to-zinc-500",
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375" />
      </svg>
    ),
  },
  {
    title: "Design Decisions",
    description: "AI explains every choice — naming, indexing, normalization, trade-offs.",
    gradient: "from-zinc-400 to-zinc-300",
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
}

interface Message {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
  schema?: SchemaOutput;
  preview?: string | null;
  model?: string;
  provider?: string;
}

type SchemaTab = "erd" | "sql" | "types" | "api" | "seed" | "decisions";

function SchemaBlock({
  schema,
  preview,
}: {
  schema: SchemaOutput;
  preview: string | null;
}) {
  const [activeTab, setActiveTab] = useState<SchemaTab>(preview ? "erd" : "sql");
  const [copied, setCopied] = useState(false);
  const isDark = useIsDark();

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
        </div>

        {/* Content */}
        {activeTab === "erd" && preview ? (
          <div className="h-[450px]">
            <LivePreview html={preview} />
          </div>
        ) : activeTab === "decisions" ? (
          <div className={cn("max-h-[450px] overflow-auto p-4 space-y-2", isDark ? "text-white/70" : "text-zinc-700")}>
            {schema.design_decisions.map((d, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className={cn(
                  "mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-bold",
                  isDark ? "bg-zinc-500/15 text-zinc-300" : "bg-zinc-100 text-zinc-600"
                )}>
                  {i + 1}
                </span>
                <span className="leading-relaxed">{d}</span>
              </div>
            ))}
          </div>
        ) : (
          <pre className={cn(
            "max-h-[450px] overflow-auto p-4 text-sm leading-relaxed scrollbar-hide",
            isDark ? "text-white/70" : "text-gray-700"
          )}>
            <code>{getTabContent()}</code>
          </pre>
        )}
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
      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", isDark ? "bg-white/[0.04]" : "bg-zinc-100")}>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn("h-1.5 w-1.5 rounded-full", isDark ? "bg-zinc-400" : "bg-zinc-500")}
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
      <span className={cn("text-sm", isDark ? "text-white/30" : "text-zinc-400")}>Generating…</span>
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
  const [showIntro, setShowIntro] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const landingRef = useRef<HTMLDivElement>(null);
  const landingInputRef = useRef<HTMLInputElement>(null);
  const shouldAutoSendRef = useRef(false);

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

  const containerRef = useRef<HTMLDivElement>(null);
  const heroFlowRef = useRef<SVGSVGElement>(null);

  /* ── Flowing background lines in hero ── */
  useEffect(() => {
    const svg = heroFlowRef.current;
    if (!svg || !showLanding) return;
    const ns = "http://www.w3.org/2000/svg";
    const LINE_COUNT = 30;
    const tweens: gsap.core.Tween[] = [];
    const accent = isDark ? "rgba(161,161,170,0.5)" : "rgba(63,63,70,0.35)";

    for (let i = 0; i < LINE_COUNT; i++) {
      const line = document.createElementNS(ns, "line");
      const baseX = (i / LINE_COUNT) * 120 - 10;
      const len = 25 + Math.random() * 45;
      line.setAttribute("x1", `${baseX}%`);
      line.setAttribute("y1", "-10%");
      line.setAttribute("x2", `${baseX + len * 0.25}%`);
      line.setAttribute("y2", `${len}%`);
      line.setAttribute("stroke", accent);
      line.setAttribute("stroke-width", `${0.3 + Math.random() * 0.6}`);
      line.setAttribute("opacity", `${0.04 + Math.random() * 0.08}`);
      svg.appendChild(line);

      const dur = 5 + Math.random() * 7;
      const t = gsap.fromTo(
        line,
        { attr: { y1: "-20%", y2: `${len - 20}%` } },
        {
          attr: { y1: `${100 + len}%`, y2: `${100 + len * 2}%` },
          duration: dur,
          repeat: -1,
          ease: "none",
          delay: Math.random() * dur,
        }
      );
      tweens.push(t);
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

  /* ── Chat Logic ── */
  const createSession = useCallback((title: string) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    setSessions((prev) => [{ id, title, timestamp: new Date(), messageCount: 0 }, ...prev]);
    setActiveSessionId(id);
    setShowLanding(false);
    return id;
  }, []);

  const handleSend = useCallback(async () => {
    const prompt = input.trim();
    if (!prompt || isGenerating) return;
    let sessionId = activeSessionId || createSession(prompt.length > 40 ? prompt.slice(0, 40) + "…" : prompt);

    const userMsg: Message = { id: Date.now().toString(36), role: "user", content: prompt };
    setMessagesMap((prev) => ({ ...prev, [sessionId]: [...(prev[sessionId] ?? []), userMsg] }));
    setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, messageCount: s.messageCount + 1, timestamp: new Date() } : s));
    setInput("");
    setIsGenerating(true);
    setShowLanding(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }),
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
      };
      setMessagesMap((prev) => ({ ...prev, [sessionId]: [...(prev[sessionId] ?? []), assistantMsg] }));
    } catch {
      setMessagesMap((prev) => ({
        ...prev,
        [sessionId]: [...(prev[sessionId] ?? []), { id: Date.now().toString(36) + "e", role: "error" as const, content: "Network error." }],
      }));
    } finally {
      setIsGenerating(false);
    }
  }, [input, isGenerating, activeSessionId, createSession]);

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

  /* ====================================================================
     RENDER — Landing Page
     ==================================================================== */
  if (showLanding) {
    return (
      <div
        ref={landingRef}
        className={cn("selection:bg-zinc-500/30", isDark ? "bg-zinc-950 text-white" : "bg-white text-zinc-900")}
      >
        {/* Logo Reveal Intro */}
        {showIntro && <LogoReveal onComplete={() => setShowIntro(false)} isDark={isDark} />}
        <CustomCursor />
        {/* ── HERO ── */}
        <section className="relative flex min-h-screen flex-col overflow-hidden">
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
            <div className="absolute -top-40 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-zinc-600/20 blur-[160px]" />
            <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-zinc-600/15 blur-[140px]" />
            <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-zinc-500/10 blur-[120px]" />
          </div>

          {/* Navbar */}
          <header className="relative z-50 flex items-center justify-between px-6 py-6 lg:px-12">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-500 to-zinc-600 shadow-lg shadow-zinc-500/25">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <span className={cn("text-lg font-bold tracking-tight", isDark ? "text-white" : "text-zinc-900")}>Aether DB</span>
            </div>
            <div className="flex items-center gap-3">
              <MagneticWrap>
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
                    isDark
                      ? "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                      : "border-zinc-200 bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  )}
                  title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  )}
                </button>
              </MagneticWrap>
              <MagneticWrap>
                {CLERK_ENABLED ? (
                  <>
                    <SignedOut>
                      <Link
                        href="/sign-in"
                        className={cn(
                          "hidden rounded-xl px-5 py-2.5 text-sm font-medium transition-all border sm:block",
                          isDark
                            ? "border-white/10 text-zinc-300 hover:text-white hover:bg-white/5"
                            : "border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                        )}
                      >
                        Sign in
                      </Link>
                    </SignedOut>
                    <SignedIn>
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "h-9 w-9",
                          },
                        }}
                      />
                    </SignedIn>
                  </>
                ) : (
                  <Link
                    href="/sign-in"
                    className={cn(
                      "hidden rounded-xl px-5 py-2.5 text-sm font-medium transition-all border sm:block",
                      isDark
                        ? "border-white/10 text-zinc-300 hover:text-white hover:bg-white/5"
                        : "border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                    )}
                  >
                    Sign in
                  </Link>
                )}
              </MagneticWrap>
              <MagneticWrap>
                <button
                  onClick={() => { setShowLanding(false); setTimeout(() => inputRef.current?.focus(), 100); }}
                  className={cn(
                    "hidden rounded-xl px-5 py-2.5 text-sm font-semibold transition-all border sm:block",
                    isDark
                      ? "bg-white/10 text-white hover:bg-white/20 border-white/10"
                      : "bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-900"
                  )}
                >
                  Open App
                </button>
              </MagneticWrap>
            </div>
          </header>

          {/* Hero Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
            <div
              className={cn(
                "hero-badge mb-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-2 backdrop-blur-md",
                isDark ? "border-zinc-500/20 bg-zinc-500/10" : "border-zinc-200 bg-zinc-50"
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-500" />
              </span>
              <span className={cn("text-xs font-semibold tracking-wide", isDark ? "text-zinc-300" : "text-zinc-700")}>
                AI-Powered Database Architecture
              </span>
            </div>

            <h1 className="hero-title max-w-4xl text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-7xl lg:text-8xl">
              <span className="inline-block">Design databases</span>{" "}
              <span className="inline-block">in seconds,</span>{" "}
              <span className="inline-block">not days.</span>
            </h1>

            <p
              className={cn("hero-desc mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl", isDark ? "text-zinc-400" : "text-zinc-600")}
            >
              Describe any application in plain English. Aether DB generates
              complete PostgreSQL schemas, TypeScript types, ERDs, and API routes.
            </p>

            <div
              className="hero-input mt-10 w-full max-w-xl"
            >
              <MagneticWrap className="w-full">
                <div
                  className={cn(
                    "group flex items-center gap-2 overflow-hidden rounded-2xl border p-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-zinc-500/40",
                    isDark ? "border-white/10 bg-white/5 backdrop-blur-xl" : "border-zinc-200 bg-white shadow-xl shadow-zinc-200/50"
                  )}
                >
                <input
                  ref={landingInputRef}
                  type="text"
                  placeholder="Describe your app — e.g. 'A recipe sharing platform'…"
                  className={cn("flex-1 bg-transparent px-4 py-3 text-base outline-none", isDark ? "text-white placeholder:text-zinc-500" : "text-zinc-900 placeholder:text-zinc-400")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      setInput(e.currentTarget.value);
                      shouldAutoSendRef.current = true;
                      setShowLanding(false);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const val = landingInputRef.current?.value?.trim();
                    if (val) { setInput(val); shouldAutoSendRef.current = true; }
                    setShowLanding(false);
                    if (!val) setTimeout(() => inputRef.current?.focus(), 100);
                  }}
                  title="Generate schema"
                  className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-zinc-600 text-white transition-all hover:bg-zinc-500 hover:scale-105 active:scale-95"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
              </MagneticWrap>
              <div className="hero-tags mt-4 flex flex-wrap justify-center gap-2">
                {["SaaS platform", "E-commerce store", "Chat application", "Project manager"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { if (landingInputRef.current) landingInputRef.current.value = s; landingInputRef.current?.focus(); }}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                      isDark ? "border-white/8 text-zinc-400 hover:border-zinc-500/30 hover:text-zinc-300" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-600"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

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

        {/* ── FEATURES BENTO ── */}
        <section className={cn("relative z-10 px-6 py-32 lg:px-12", isDark ? "bg-zinc-950" : "bg-white")}>
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="mb-16 text-center"
            >
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Everything you need to{" "}
                <span className="bg-gradient-to-r from-zinc-400 to-zinc-500 bg-clip-text text-transparent">architect</span>
              </h2>
              <p className={cn("mx-auto mt-4 max-w-xl text-lg", isDark ? "text-zinc-400" : "text-zinc-600")}>
                One prompt. Six production-ready outputs. Zero boilerplate.
              </p>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="feature-card"
                >
                  <SpotlightCard
                    className={cn(
                      "group relative h-full overflow-hidden rounded-2xl border p-6 transition-all duration-300",
                      isDark
                        ? "border-white/6 bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.04]"
                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-lg"
                    )}
                  >
                    <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg", f.gradient)}>
                      {f.icon}
                    </div>
                    <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-zinc-900")}>{f.title}</h3>
                    <p className={cn("mt-2 text-sm leading-relaxed", isDark ? "text-zinc-400" : "text-zinc-600")}>{f.description}</p>
                  </SpotlightCard>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CODE DEMO ── */}
        <section className={cn("relative z-10 overflow-hidden px-6 py-32 lg:px-12", isDark ? "bg-zinc-950/80" : "bg-zinc-50")}>
          <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
            <div
              className="demo-text"
            >
              <div className={cn("mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold", isDark ? "bg-zinc-500/10 text-zinc-300" : "bg-zinc-200 text-zinc-700")}>
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Describe it.{" "}
                <span className="bg-gradient-to-r from-zinc-400 to-zinc-500 bg-clip-text text-transparent">We build it.</span>
              </h2>
              <p className={cn("mt-6 text-lg leading-relaxed", isDark ? "text-zinc-400" : "text-zinc-600")}>
                Just tell Aether DB what your application does. Our AI analyzes your
                description and generates a complete, normalized database architecture
                in under 2 seconds.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { step: "01", text: "Describe your application in plain English" },
                  { step: "02", text: "AI generates complete schema with relationships" },
                  { step: "03", text: "Export SQL, TypeScript types, ERD, and more" },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-4">
                    <span className={cn("flex h-8 w-8 flex-none items-center justify-center rounded-lg text-xs font-bold", isDark ? "bg-zinc-500/15 text-zinc-300" : "bg-zinc-200 text-zinc-700")}>
                      {s.step}
                    </span>
                    <span className={cn("text-sm", isDark ? "text-zinc-300" : "text-zinc-700")}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <ParallaxScroll offset={30}>
              <div
                className={cn("demo-code overflow-hidden rounded-2xl border", isDark ? "border-white/10 bg-zinc-900" : "border-zinc-200 bg-white shadow-2xl shadow-zinc-200/50")}
              >
                <div className={cn("flex items-center gap-2 border-b px-4 py-3", isDark ? "border-white/5" : "border-zinc-100")}>
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                    <div className="h-3 w-3 rounded-full bg-green-400/80" />
                  </div>
                  <span className={cn("ml-2 text-xs font-medium", isDark ? "text-white/30" : "text-zinc-400")}>schema.sql</span>
                </div>
                <pre className={cn("overflow-auto p-6 text-[13px] leading-relaxed", isDark ? "text-zinc-300" : "text-zinc-700")}>
                  <code>{DEMO_SQL}</code>
                </pre>
              </div>
            </ParallaxScroll>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className={cn("relative z-10 px-6 py-28 lg:px-12", isDark ? "bg-zinc-950" : "bg-white")}>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
            <AnimatedCounter target={stats.uiTime} suffix="ms" label="UI Generation Time" isDark={isDark} />
            <AnimatedCounter target={stats.dbActive} suffix="%" label="DB Active Status" isDark={isDark} />
            <AnimatedCounter target={stats.aetherStarted} suffix="s" label="Aether AI Started" isDark={isDark} />
            <AnimatedCounter target={stats.usersMakingDb} suffix="+" label="Users Making DB" isDark={isDark} />
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative z-10 overflow-hidden px-6 py-32 lg:px-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-600/10 via-transparent to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto max-w-3xl text-center"
          >
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Start architecting{" "}
              <span className="bg-gradient-to-r from-zinc-400 to-zinc-500 bg-clip-text text-transparent">today</span>
            </h2>
            <p className={cn("mx-auto mt-4 max-w-xl text-lg", isDark ? "text-zinc-400" : "text-zinc-600")}>
              No signup required. Describe your application and get production-ready schemas instantly.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => { setShowLanding(false); setTimeout(() => inputRef.current?.focus(), 100); }}
                className="rounded-2xl bg-zinc-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-zinc-500/25 transition-all hover:bg-zinc-500 hover:scale-105 active:scale-95"
              >
                Start Building — Free
              </button>
              <span className="text-sm text-zinc-500">No account needed</span>
            </div>
          </motion.div>
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
      </div>
    );
  }

  /* ====================================================================
     RENDER — Chat View
     ==================================================================== */
  return (
    <div className={cn("relative flex h-screen flex-col overflow-hidden", isDark ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900")}>
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

      <header className={cn("relative z-10 flex items-center justify-between border-b px-4 py-3", isDark ? "border-white/[0.04] bg-zinc-950/60 backdrop-blur-xl" : "border-zinc-200 bg-white/60 backdrop-blur-xl")}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} title="Open sidebar" className={cn("flex h-9 w-9 items-center justify-center rounded-xl transition-colors", isDark ? "text-white/40 hover:bg-white/[0.06]" : "text-zinc-500 hover:bg-zinc-100")}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
          <button onClick={() => setShowLanding(true)} className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-500 to-zinc-600 shadow-sm shadow-zinc-500/25">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <span className={cn("text-sm font-bold tracking-tight", isDark ? "text-white" : "text-zinc-900")}>Aether DB</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={cn("flex h-9 w-9 items-center justify-center rounded-xl transition-colors", isDark ? "text-white/40 hover:bg-white/[0.06]" : "text-zinc-500 hover:bg-zinc-100")}
          >
            {isDark ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
          <button onClick={() => { setActiveSessionId(null); setInput(""); }} title="New chat" className={cn("flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-colors", isDark ? "text-white/40 hover:bg-white/[0.06]" : "text-zinc-500 hover:bg-zinc-100")}>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>New
          </button>
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide">
        {activeMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={cn("mb-8 flex h-20 w-20 items-center justify-center rounded-3xl shadow-2xl", isDark ? "bg-gradient-to-br from-zinc-500/20 to-zinc-600/20 shadow-zinc-500/10 border border-white/10" : "bg-gradient-to-br from-zinc-100 to-zinc-200 shadow-zinc-200/50 border border-white")}
            >
               <svg className={cn("h-10 w-10", isDark ? "text-zinc-400" : "text-zinc-600")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
            </motion.div>
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
              {suggestions.map((s) => (
                <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }} className={cn("group relative overflow-hidden rounded-2xl border p-4 text-left text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl", isDark ? "border-white/[0.06] bg-white/[0.02] text-zinc-300 hover:border-zinc-500/30 hover:bg-zinc-500/5 hover:shadow-zinc-500/10" : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:shadow-zinc-200/50")}>
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/0 to-zinc-600/0 transition-colors duration-300 group-hover:from-zinc-500/5 group-hover:to-zinc-600/5" />
                  <span className="relative z-10">{s}</span>
                </button>
              ))}
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
                      <svg className={cn("h-6 w-6", isDark ? "text-zinc-400" : "text-zinc-600")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                    </div>
                    <div className="flex-1 space-y-4 overflow-hidden">
                      {msg.schema ? <SchemaBlock schema={msg.schema} preview={msg.preview || null} /> : <div className={cn("rounded-2xl border p-5 text-[15px] leading-relaxed shadow-sm", isDark ? "border-white/[0.06] bg-white/[0.02] text-zinc-300" : "border-zinc-200 bg-white text-zinc-700")}>{msg.content}</div>}
                    </div>
                  </div>
                )}
              </motion.div>
              ))}
            </AnimatePresence>
            {isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className={cn("flex h-10 w-10 flex-none items-center justify-center rounded-xl shadow-sm", isDark ? "bg-white/10 border border-white/10" : "bg-white border border-zinc-200")}>
                  <svg className={cn("h-6 w-6", isDark ? "text-zinc-400" : "text-zinc-600")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                </div>
                <div className="flex items-center pt-2">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      <div className={cn("relative z-10 border-t p-4 sm:p-6", isDark ? "border-white/[0.04] bg-zinc-950/80 backdrop-blur-xl" : "border-zinc-200 bg-white/80 backdrop-blur-xl")}>
        <div className="mx-auto max-w-4xl">
          <div className={cn("relative flex items-end gap-3 rounded-3xl border p-2 shadow-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-zinc-500/40", isDark ? "border-white/[0.08] bg-white/[0.03] shadow-black/50" : "border-zinc-200 bg-white shadow-zinc-200/50")}>
            <textarea 
              ref={inputRef} 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={handleKeyDown} 
              placeholder="Describe your application or system..." 
              rows={1} 
              className={cn("max-h-40 flex-1 resize-none bg-transparent px-4 py-3 text-[15px] outline-none", isDark ? "text-white placeholder:text-zinc-500" : "text-zinc-900 placeholder:text-zinc-400")} 
              style={{ height: "auto", minHeight: "48px" }} 
            />
            <button 
              onClick={handleSend} 
              disabled={!input.trim() || isGenerating} 
              title="Send message" 
              className={cn("mb-1 mr-1 flex h-10 w-10 flex-none items-center justify-center rounded-2xl transition-all duration-300", input.trim() && !isGenerating ? "bg-gradient-to-br from-zinc-500 to-zinc-600 text-white shadow-md hover:scale-105 active:scale-95" : isDark ? "bg-white/[0.04] text-white/20" : "bg-zinc-100 text-zinc-400")}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
            </button>
          </div>
          <div className="mt-3 text-center">
            <span className={cn("text-[11px]", isDark ? "text-zinc-500" : "text-zinc-400")}>Aether DB can make mistakes. Consider verifying important schemas.</span>
          </div>
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} sessions={sessions} activeSessionId={activeSessionId} onNewChat={() => { setActiveSessionId(null); setInput(""); setSidebarOpen(false); }} onSelectSession={(id) => { setActiveSessionId(id); setShowLanding(false); setSidebarOpen(false); }} onDeleteSession={(id) => { setSessions((prev) => prev.filter((s) => s.id !== id)); if (activeSessionId === id) setActiveSessionId(null); setMessagesMap((prev) => { const copy = { ...prev }; delete copy[id]; return copy; }); }} onResetAll={() => { setSessions([]); setActiveSessionId(null); setMessagesMap({}); setShowLanding(true); setSidebarOpen(false); }} />
    </div>
  );
}
