"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MagneticWrap } from "../animations/awwward-elements";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────
export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messageCount: number;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onResetAll: () => void;
  user?: {
    name: string;
    email: string;
    imageUrl?: string;
    initials: string;
  } | null;
}

// ─── Time helpers ───────────────────────────────────────────
function timeAgo(d: Date) {
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

function groupSessions(sessions: ChatSession[]) {
  const now = new Date();
  const today: ChatSession[] = [];
  const week: ChatSession[] = [];
  const older: ChatSession[] = [];

  for (const s of sessions) {
    const diff = now.getTime() - s.timestamp.getTime();
    if (diff < 86400000) today.push(s);
    else if (diff < 604800000) week.push(s);
    else older.push(s);
  }

  const groups: { label: string; items: ChatSession[] }[] = [];
  if (today.length) groups.push({ label: "Today", items: today });
  if (week.length) groups.push({ label: "This Week", items: week });
  if (older.length) groups.push({ label: "Older", items: older });
  return groups;
}

// ─── Sidebar ────────────────────────────────────────────────
export function Sidebar({
  isOpen,
  onToggle,
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onResetAll,
  user,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"chats" | "settings">("chats");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const grouped = useMemo(() => groupSessions(sessions), [sessions]);
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return grouped;
    const q = searchQuery.toLowerCase();
    return grouped
      .map((g) => ({
        ...g,
        items: g.items.filter((s) => s.title.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [grouped, searchQuery]);

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onToggle}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="fixed left-0 top-0 z-50 flex h-full w-[300px] flex-col overflow-hidden border-r border-slate-200/40 bg-white/95 backdrop-blur-2xl dark:border-white/[0.04] dark:bg-[#0c0c12]/98"
      >
        {/* ── Header ── */}
        <div className="relative flex items-center justify-between px-5 pt-5 pb-3">
          <MagneticWrap>
            <button
              onClick={onResetAll}
              className="group flex items-center gap-2.5"
              title="Reset all chats"
            >
              <div className="relative">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-500 to-zinc-600 shadow-sm shadow-zinc-500/25 transition-all duration-500 group-hover:scale-110 group-hover:shadow-zinc-500/40">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
                <div className="absolute inset-0 h-7 w-7 rounded-lg bg-gradient-to-br from-zinc-500 to-zinc-600 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-50" />
              </div>
              <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
                Aether
                <span className="bg-gradient-to-r from-slate-400 to-slate-300 bg-clip-text font-light text-transparent dark:from-white/40 dark:to-white/25">
                  {" "}DB
                </span>
              </span>
            </button>
          </MagneticWrap>

          <button
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/[0.06] dark:hover:text-white/60"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* ── New Chat Button ── */}
        <div className="px-4 pb-3">
          <MagneticWrap className="w-full">
            <button
              onClick={onNewChat}
              className="group relative flex w-full items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-zinc-600 to-zinc-700 px-4 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-zinc-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-700 to-zinc-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <svg className="relative h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="relative">New Chat</span>
              <kbd className="relative ml-auto rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-medium text-white/60 backdrop-blur-sm">
                Ctrl N
              </kbd>
            </button>
          </MagneticWrap>
        </div>

        {/* ── Tabs ── */}
        <div className="mx-4 flex rounded-xl bg-slate-100/80 p-1 dark:bg-white/[0.04]">
          {(["chats", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12px] font-medium transition-all duration-200",
                activeTab === tab
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-400 hover:text-slate-600 dark:text-white/30 dark:hover:text-white/50"
              )}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="sidebar-tab"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-white/[0.08]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <svg className="relative h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {tab === "chats" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                )}
              </svg>
              <span className="relative capitalize">{tab}</span>
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-3 pb-2">
          <AnimatePresence mode="wait">
            {activeTab === "chats" ? (
              <motion.div
                key="chats"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                {/* Search */}
                {sessions.length > 0 && (
                  <div className="relative mb-3">
                    <svg className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300 dark:text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search chats..."
                      className="w-full rounded-lg border border-slate-200/60 bg-slate-50/50 py-2 pl-9 pr-3 text-[12px] text-slate-700 placeholder:text-slate-300 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500/10 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-white/70 dark:placeholder:text-white/15 dark:focus:border-zinc-500/30"
                    />
                  </div>
                )}

                {sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="relative mb-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-white/[0.04] dark:to-white/[0.02]">
                        <svg className="h-6 w-6 text-slate-300 dark:text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-slate-100 dark:border-[#0c0c12] dark:bg-white/[0.06]" />
                    </div>
                    <p className="text-[13px] font-medium text-slate-400 dark:text-white/30">No conversations yet</p>
                    <p className="mt-1 text-[11px] text-slate-300 dark:text-white/15">Hit "New Chat" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredGroups.map((group) => (
                      <div key={group.label}>
                        <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-300 dark:text-white/15">
                          {group.label}
                        </p>
                        <motion.div 
                          className="space-y-0.5"
                          initial="hidden"
                          animate="visible"
                          variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.05 } }
                          }}
                        >
                          {group.items.map((session) => (
                            <motion.div
                              variants={{
                                hidden: { opacity: 0, x: -10 },
                                visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                              }}
                              key={session.id}
                              onMouseEnter={() => setHoveredId(session.id)}
                              onMouseLeave={() => setHoveredId(null)}
                              onClick={() => onSelectSession(session.id)}
                              className={cn(
                                "group relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150",
                                activeSessionId === session.id
                                  ? "bg-zinc-50/80 dark:bg-zinc-500/[0.08]"
                                  : "hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
                              )}
                            >
                              {/* Active indicator */}
                              {activeSessionId === session.id && (
                                <motion.div
                                  layoutId="active-chat"
                                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-zinc-500"
                                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                />
                              )}

                              <div className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150",
                                activeSessionId === session.id
                                  ? "bg-zinc-100 dark:bg-zinc-500/15"
                                  : "bg-slate-100/80 dark:bg-white/[0.04]"
                              )}>
                                <svg className={cn("h-3.5 w-3.5", activeSessionId === session.id ? "text-zinc-500" : "text-slate-400 dark:text-white/25")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                                </svg>
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className={cn(
                                  "truncate text-[13px] font-medium leading-tight",
                                  activeSessionId === session.id
                                    ? "text-zinc-800 dark:text-zinc-200"
                                    : "text-slate-700 dark:text-white/60"
                                )}>
                                  {session.title}
                                </p>
                                <p className="mt-0.5 text-[10px] text-slate-400 dark:text-white/20">
                                  {timeAgo(session.timestamp)} · {session.messageCount} msg
                                </p>
                              </div>

                              <AnimatePresence>
                                {hoveredId === session.id && (
                                  <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.1 }}
                                    onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-red-50 hover:text-red-400 dark:text-white/15 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                  >
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                  </motion.button>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              /* ── Settings ── */
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                {/* AI Providers */}
                <div className="rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50/50 to-white p-4 dark:border-white/[0.04] dark:from-white/[0.02] dark:to-transparent">
                  <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-white/25">
                    <div className="h-1 w-1 rounded-full bg-zinc-500" />
                    AI Providers
                  </h4>
                  <div className="mt-3 space-y-2.5">
                    {[
                      { name: "Grok", model: "grok-3-fast", status: "priority", color: "sky" },
                      { name: "Groq", model: "llama-3.3-70b", status: "active", color: "emerald" },
                      { name: "Gemini", model: "2.0-flash", status: "fallback", color: "purple" },
                    ].map((p) => (
                      <div key={p.name} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 dark:bg-white/[0.02]">
                        <div className="flex items-center gap-2.5">
                          <div className={cn("h-2 w-2 rounded-full", p.color === "emerald" ? "bg-emerald-400 shadow-sm shadow-emerald-400/50" : p.color === "sky" ? "bg-sky-400 shadow-sm shadow-sky-400/50" : "bg-zinc-400 shadow-sm shadow-zinc-400/50")} />
                          <div>
                            <span className="text-[12px] font-semibold text-slate-700 dark:text-white/60">{p.name}</span>
                            <span className="ml-1.5 text-[10px] text-slate-300 dark:text-white/15">{p.model}</span>
                          </div>
                        </div>
                        <span className={cn(
                          "rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                          p.status === "priority"
                            ? "bg-sky-50 text-sky-500 dark:bg-sky-500/10 dark:text-sky-400"
                            : p.status === "active"
                            ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-400 dark:bg-white/[0.04] dark:text-white/25"
                        )}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capabilities */}
                <div className="rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50/50 to-white p-4 dark:border-white/[0.04] dark:from-white/[0.02] dark:to-transparent">
                  <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-white/25">
                    <div className="h-1 w-1 rounded-full bg-zinc-500" />
                    Supported Languages
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["HTML", "CSS", "JS", "React", "Vue", "Svelte", "Python", "Go", "Rust", "TypeScript", "PHP", "Ruby"].map((lang) => (
                      <span key={lang} className="rounded-md bg-white px-2 py-1 text-[10px] font-medium text-slate-500 dark:bg-white/[0.03] dark:text-white/35">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Shortcuts */}
                <div className="rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50/50 to-white p-4 dark:border-white/[0.04] dark:from-white/[0.02] dark:to-transparent">
                  <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-white/25">
                    <div className="h-1 w-1 rounded-full bg-amber-500" />
                    Shortcuts
                  </h4>
                  <div className="mt-3 space-y-2">
                    {[
                      { keys: "↵", action: "Send message" },
                      { keys: "⇧ ↵", action: "New line" },
                      { keys: "Ctrl N", action: "New chat" },
                    ].map((s) => (
                      <div key={s.keys} className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 dark:text-white/35">{s.action}</span>
                        <kbd className="rounded-md border border-slate-200/80 bg-white px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 shadow-[0_1px_0_1px_rgba(0,0,0,0.04)] dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white/25 dark:shadow-none">
                          {s.keys}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-2">
                  <button
                    onClick={onResetAll}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl border border-red-200/40 px-3 py-2.5 text-[12px] font-medium text-red-400 transition-all duration-200 hover:border-red-300/50 hover:bg-red-50/50 dark:border-red-500/10 dark:text-red-400/80 dark:hover:border-red-500/20 dark:hover:bg-red-500/5"
                  >
                    <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Clear All Conversations
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer / Profile ── */}
        <div className="border-t border-slate-100 p-3 dark:border-white/[0.04]">
          {user ? (
            <div className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03]">
              {/* Avatar */}
              <div className="relative shrink-0">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.name}
                    className="h-9 w-9 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-500 via-zinc-600 to-zinc-700 text-[12px] font-bold text-white shadow-lg shadow-zinc-500/15">
                    {user.initials}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-[#0c0c12]" />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-[13px] font-semibold text-slate-700 dark:text-white/70">{user.name}</p>
                <p className="truncate text-[10px] text-slate-400 dark:text-white/25">{user.email}</p>
              </div>
              {/* Online dot */}
              <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            </div>
          ) : (
            /* Not signed in — show sign-in prompt */
            <Link
              href="/sign-in"
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200/60 px-3 py-2.5 text-[12px] font-medium text-zinc-500 transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/[0.06] dark:text-white/30 dark:hover:border-white/10 dark:hover:bg-white/[0.03]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Sign in to save your chats
            </Link>
          )}
        </div>
      </motion.aside>
    </>
  );
}
