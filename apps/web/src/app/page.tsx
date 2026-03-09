"use client";

import React, { useEffect, useState, useRef } from "react";

// ── Launch target: March 21 2026 ──────────────────────────
const LAUNCH = new Date("2026-03-21T00:00:00+05:30");

function useCountdown() {
  const get = () => {
    const d = Math.max(0, LAUNCH.getTime() - Date.now());
    return {
      days: Math.floor(d / 86_400_000),
      hours: Math.floor((d % 86_400_000) / 3_600_000),
      minutes: Math.floor((d % 3_600_000) / 60_000),
      seconds: Math.floor((d % 60_000) / 1_000),
    };
  };
  const [t, set] = useState(get);
  useEffect(() => { const id = setInterval(() => set(get()), 1000); return () => clearInterval(id); }, []);
  return t;
}

// ── Starfield canvas ──────────────────────────────────────
function Stars() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate stars once
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.3,
      o: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.004 + 0.002,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const opacity = s.o * (0.6 + 0.4 * Math.sin(t * s.speed * 60 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" />;
}

// ── Two-digit block ───────────────────────────────────────
function Block({ n, label }: { n: number; label: string }) {
  const s = String(n).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <span
        className="tabular-nums font-bold text-white"
        style={{ fontSize: "clamp(3rem, 10vw, 7.5rem)", lineHeight: 1, letterSpacing: "-0.03em" }}
      >
        {s}
      </span>
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50 sm:text-sm">
        {label}
      </span>
    </div>
  );
}

// ── Dot separator ─────────────────────────────────────────
function Dot() {
  return (
    <span
      className="mb-8 self-start text-white/30"
      style={{ fontSize: "clamp(2rem, 6vw, 5rem)", lineHeight: 1 }}
    >
      ·
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────
export default function ComingSoon() {
  const { days, hours, minutes, seconds } = useCountdown();

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{ background: "#0a0a0a" }}
    >
      {/* Starfield */}
      <Stars />

      {/* Subtle vertical gradient — lighter at top like reference */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(30,30,30,0.5) 0%, transparent 45%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">

        {/* Logo mark */}
        <svg viewBox="0 0 32 24" className="h-6 w-auto text-white/80" fill="currentColor">
          <path d="M0 12 L8 0 L16 12 L8 24 Z" opacity="0.9" />
          <path d="M16 12 L24 0 L32 12 L24 24 Z" opacity="0.6" />
        </svg>

        {/* Heading */}
        <h1
          className="font-light tracking-wide text-white"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2.8rem)", letterSpacing: "0.12em" }}
        >
          Coming Soon
        </h1>

        {/* Countdown */}
        <div className="flex items-end gap-4 sm:gap-8">
          <Block n={days} label="Days" />
          <Dot />
          <Block n={hours} label="Hours" />
          <Dot />
          <Block n={minutes} label="Minutes" />
          <Dot />
          <Block n={seconds} label="Seconds" />
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <a
            href="mailto:hello@aether-db.com"
            className="rounded-sm px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            style={{ background: "#e53935" }}
          >
            Notify Me
          </a>
          <a
            href="#"
            className="rounded-sm border border-white/25 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-white/5"
          >
            Learn More
          </a>
        </div>

        {/* Follow us */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs tracking-widest text-white/35 uppercase">Follow Us</span>
          <div className="flex items-center gap-4">
            {/* Facebook */}
            <a href="#" className="text-white/40 transition-colors hover:text-white">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="text-white/40 transition-colors hover:text-white">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="#" className="text-white/40 transition-colors hover:text-white">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* GitHub */}
            <a href="https://github.com/aether-ui/aether" target="_blank" rel="noopener" className="text-white/40 transition-colors hover:text-white">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
