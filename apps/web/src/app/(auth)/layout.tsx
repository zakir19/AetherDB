"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import gsap from "gsap";

const useIsDark = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return true;
  return resolvedTheme !== "light";
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const isDark = useIsDark();
  const { setTheme } = useTheme();
  const bgRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGSVGElement>(null);

  /* Subtle floating orbs animation */
  useEffect(() => {
    if (!bgRef.current) return;
    const orbs = bgRef.current.querySelectorAll(".auth-orb");
    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        y: `random(-40, 40)`,
        x: `random(-30, 30)`,
        scale: `random(0.8, 1.2)`,
        duration: `random(6, 10)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.8,
      });
    });

    /* Grid line pulse */
    if (gridRef.current) {
      const lines = gridRef.current.querySelectorAll("line");
      lines.forEach((line, i) => {
        gsap.to(line, {
          strokeOpacity: 0.08,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.15,
        });
      });
    }
  }, []);

  return (
    <div
      className={cn(
        "relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 transition-colors duration-300",
        isDark ? "bg-zinc-950" : "bg-zinc-50"
      )}
    >
      {/* ── Background effects ── */}
      <div ref={bgRef} className="pointer-events-none absolute inset-0">
        {/* Gradient backdrop */}
        <div
          className={cn(
            "absolute inset-0",
            isDark
              ? "bg-[radial-gradient(ellipse_at_top,_rgba(63,63,70,0.15)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(63,63,70,0.1)_0%,_transparent_50%)]"
              : "bg-[radial-gradient(ellipse_at_top,_rgba(228,228,231,0.5)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(228,228,231,0.3)_0%,_transparent_50%)]"
          )}
        />

        {/* Grid lines */}
        <svg
          ref={gridRef}
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={`${(i + 1) * 8.33}%`}
              y1="0"
              x2={`${(i + 1) * 8.33}%`}
              y2="100%"
              stroke={isDark ? "rgba(161,161,170,0.04)" : "rgba(161,161,170,0.08)"}
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={`${(i + 1) * 12.5}%`}
              x2="100%"
              y2={`${(i + 1) * 12.5}%`}
              stroke={isDark ? "rgba(161,161,170,0.04)" : "rgba(161,161,170,0.08)"}
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Floating orbs */}
        <div
          className={cn(
            "auth-orb absolute -left-32 -top-32 h-96 w-96 rounded-full blur-[120px]",
            isDark ? "bg-zinc-500/[0.07]" : "bg-zinc-300/30"
          )}
        />
        <div
          className={cn(
            "auth-orb absolute -bottom-24 -right-24 h-80 w-80 rounded-full blur-[100px]",
            isDark ? "bg-zinc-400/[0.05]" : "bg-zinc-200/40"
          )}
        />
        <div
          className={cn(
            "auth-orb absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full blur-[80px]",
            isDark ? "bg-zinc-600/[0.04]" : "bg-zinc-300/20"
          )}
        />
      </div>

      {/* ── Top nav bar ── */}
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 text-lg font-bold tracking-tight transition-colors",
            isDark ? "text-white" : "text-zinc-900"
          )}
        >
          {/* Hex logo icon */}
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 2L28.66 9.5V24.5L16 32L3.34 24.5V9.5L16 2Z"
              stroke={isDark ? "#a1a1aa" : "#52525b"}
              strokeWidth="1.5"
              fill={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"}
            />
            <path
              d="M16 8L22.93 12V20L16 24L9.07 20V12L16 8Z"
              stroke={isDark ? "#d4d4d8" : "#3f3f46"}
              strokeWidth="1"
              fill="none"
            />
          </svg>
          Aether
        </Link>

        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border transition-all",
            isDark
              ? "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
              : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
          )}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
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
      </header>

      {/* ── Page content ── */}
      <div className="relative z-10 w-full max-w-md">{children}</div>

      {/* ── Bottom watermark ── */}
      <p
        className={cn(
          "fixed bottom-4 left-0 right-0 text-center text-xs tracking-widest uppercase",
          isDark ? "text-zinc-700" : "text-zinc-300"
        )}
      >
        Aether &middot; AI Database Schema Builder
      </p>
    </div>
  );
}
