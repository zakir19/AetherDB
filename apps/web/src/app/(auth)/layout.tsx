"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const useIsDark = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return true;
  return resolvedTheme !== "light";
};

/* ─── Animated SVG left panel ─────────────────────────── */
function AnimatedArtPanel({ isDark }: { isDark: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Build flowing line paths dynamically
    const NUM_LINES = 28;
    const lines: SVGPathElement[] = [];

    for (let i = 0; i < NUM_LINES; i++) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-linecap", "round");
      svg.appendChild(path);
      lines.push(path);
    }

    const W = 600;
    const H = 900;

    function getPath(i: number, t: number): string {
      const progress = i / NUM_LINES;
      const offset = progress * Math.PI * 2;

      // Anchor: all lines converge at a central light
      const cx = W * 0.52;
      const cy = H * 0.42;

      // Start & end spread
      const spread = 420 + Math.sin(t * 0.15 + offset) * 60;
      const angle = (progress * Math.PI * 2) + t * 0.06;

      const sx = cx + Math.cos(angle) * spread;
      const sy = cy + Math.sin(angle) * (spread * 0.55);

      // Control points for a sweeping arc
      const cp1x = cx + Math.cos(angle + 0.4) * spread * 0.55 + Math.sin(t * 0.2 + offset) * 80;
      const cp1y = cy + Math.sin(angle + 0.4) * spread * 0.35 + Math.cos(t * 0.15 + offset) * 60;
      const cp2x = cx + Math.cos(angle - 0.5) * spread * 0.25;
      const cp2y = cy + Math.sin(angle - 0.5) * spread * 0.25;

      return `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${cx} ${cy}`;
    }

    function animate() {
      timeRef.current += 1;
      const t = timeRef.current;

      lines.forEach((line, i) => {
        const progress = i / NUM_LINES;
        const offset = progress * Math.PI * 2;

        // Opacity wave
        const opacity = (0.06 + Math.sin(t * 0.04 + offset) * 0.08 + (i === NUM_LINES / 2 ? 0.2 : 0)).toFixed(3);

        // Stroke width — thin lines + occasional brighter thick one
        const isBright = i % 6 === 0 || i % 7 === 0;
        const strokeWidth = isBright
          ? (1.5 + Math.sin(t * 0.04 + offset) * 0.5).toFixed(2)
          : (0.6 + Math.sin(t * 0.05 + offset) * 0.3).toFixed(2);

        // Color gradient: purple → pink → white
        const hue = Math.round(270 + progress * 60 + Math.sin(t * 0.02 + offset) * 20);
        const sat = Math.round(60 + Math.sin(t * 0.03 + offset) * 20);
        const light = Math.round(50 + Math.sin(t * 0.04 + offset) * 20);
        const color = isBright
          ? `hsla(${hue}, ${sat}%, ${light + 30}%, ${opacity})`
          : `hsla(${hue}, ${sat}%, ${light}%, ${opacity})`;

        line.setAttribute("d", getPath(i, t));
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", strokeWidth);
        line.setAttribute("opacity", opacity);
      });

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      lines.forEach((l) => l.remove());
    };
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#0d0813] px-10 py-12 select-none">
      {/* Radial center glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "50%",
          height: "45%",
          background: "radial-gradient(ellipse, rgba(168,85,247,0.22) 0%, rgba(236,72,153,0.08) 50%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />
      {/* Flowing SVG lines */}
      <svg
        ref={svgRef}
        viewBox="0 0 600 900"
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Branding */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex items-center gap-2.5"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm ring-1 ring-white/15">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L3 7l9 5 9-5-9-5z" />
            <path d="M3 17l9 5 9-5" />
            <path d="M3 12l9 5 9-5" />
          </svg>
        </div>
        <span className="text-sm font-bold tracking-tight text-white/90">Aether DB</span>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className="relative z-10"
      >
        <p className="mb-3 font-serif text-3xl font-light italic leading-tight text-white/90">
          Design databases<br />in seconds.
        </p>
        <p className="text-sm leading-relaxed text-white/40">
          AI-powered <span className="text-white/60 font-medium">schema generation, TypeScript types,<br />ERDs & API routes</span>  all from plain English.
        </p>

        {/* Social proof */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex -space-x-2">
            {["A", "B", "C", "D"].map((l, i) => (
              <div
                key={l}
                className="flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-[#0d0813] text-[10px] font-bold text-white"
                style={{
                  background: `hsl(${270 + i * 25}, 60%, 45%)`,
                }}
              >
                {l}
              </div>
            ))}
          </div>
          <p className="text-xs text-white/35">
            Trusted by <span className="text-white/60 font-medium">developers</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Auth Layout ─────────────────────────────────── */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const isDark = useIsDark();
  const { setTheme } = useTheme();

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-[#09090b]">
      {/* ── Left animated panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[48%] flex-shrink-0">
        <AnimatedArtPanel isDark={isDark} />
      </div>

      {/* ── Right panel: form ── */}
      <div
        className={cn(
          "relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-auto px-6 py-16",
          isDark ? "bg-[#09090b]" : "bg-zinc-50"
        )}
      >
        {/* Top-right controls */}
        <div className="absolute right-6 top-6 flex items-center gap-3 z-20">
          <motion.button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border transition-all",
              isDark
                ? "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
                : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </motion.button>
          <Link
            href="/"
            className={cn(
              "text-xs font-medium transition-colors",
              isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-700"
            )}
          >
            ← Back to home
          </Link>
        </div>

        {/* Form content */}
        <motion.div
          className="relative z-10 w-full max-w-[400px]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>

        {/* Footer */}
        <p className={cn("absolute bottom-5 left-0 right-0 text-center text-[10px] tracking-widest uppercase", isDark ? "text-zinc-800" : "text-zinc-300")}>
          <span className="text-white/60 font-medium">Aether DB · AI</span> <span className="text-white/60 font-medium">Database Schema Builder</span>
        </p>
      </div>
    </div>
  );
}
