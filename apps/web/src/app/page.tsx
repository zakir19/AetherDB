"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

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
  useEffect(() => {
    const id = setInterval(() => set(get()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// ── Interactive Neural Canvas ──────────────────────────────
function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    let raf: number;
    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      baseR: number;
      isHovered?: boolean;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const count = Math.min(
        Math.floor((window.innerWidth * window.innerHeight) / 15000),
        100,
      );
      particles = Array.from({ length: count }, () => {
        const baseR = Math.random() * 1.5 + 0.5;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: baseR,
          baseR,
        };
      });
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const connectDistance = 150;
    const mouseDistance = 200;

    const draw = () => {
      // Very dark zinc background
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw subtle mouse glow
      if (mx > -1000 && my > -1000) {
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 300);
        grd.addColorStop(0, "rgba(168, 85, 247, 0.08)");
        grd.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grd;
        ctx.fillRect(mx - 300, my - 300, 600, 600);
      }

      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse interaction
        const dx = mx - p.x;
        const dy = my - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < mouseDistance) {
          // Push away slightly, grow size
          const force = (mouseDistance - distToMouse) / mouseDistance;
          p.x -= (dx / distToMouse) * force * 1.5;
          p.y -= (dy / distToMouse) * force * 1.5;
          p.r = p.baseR + force * 2.5;
          p.isHovered = true;
        } else {
          p.r = p.baseR;
          p.isHovered = false;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        if (p.isHovered) {
          // Neon glow on hover
          ctx.shadowBlur = 15;
          ctx.shadowColor = "rgba(168, 85, 247, 0.8)";
          ctx.fillStyle = "rgba(216, 180, 254, 1)";
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = "rgba(161, 161, 170, 0.4)"; // zinc-400
        }

        ctx.fill();
        ctx.shadowBlur = 0; // Reset

        // Connect nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist < connectDistance) {
            const opacity = 1 - Math.pow(dist / connectDistance, 1.5);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);

            if (p.isHovered || p2.isHovered) {
              // Neon connection lines near mouse
              ctx.strokeStyle = `rgba(168, 85, 247, ${opacity * 0.4})`;
              ctx.shadowBlur = 10;
              ctx.shadowColor = "rgba(168, 85, 247, 0.4)";
            } else {
              // Default subtle lines
              ctx.strokeStyle = `rgba(161, 161, 170, ${opacity * 0.15})`;
              ctx.shadowBlur = 0;
            }

            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.shadowBlur = 0; // Reset
          }
        }
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

// ── Two-digit block ───────────────────────────────────────
function Block({ n, label }: { n: number; label: string }) {
  const s = String(n).padStart(2, "0");
  return (
    <div className="group flex flex-col items-center gap-2 sm:gap-3 cursor-default">
      <span
        className="tabular-nums font-medium text-white tracking-tighter transition-all duration-300 group-hover:text-purple-200 group-hover:drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]"
        style={{ fontSize: "clamp(3.5rem, 11vw, 8.5rem)", lineHeight: 1 }}
      >
        {s}
      </span>
      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/40 transition-colors duration-300 group-hover:text-purple-300/80 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
        {label}
      </span>
    </div>
  );
}

// ── Dot separator ─────────────────────────────────────────
function Dot() {
  return (
    <span
      className="mb-8 self-start text-white/20 font-light"
      style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", lineHeight: 1 }}
    >
      :
    </span>
  );
}

// ── Noise Overlay ─────────────────────────────────────────
function Noise() {
  return (
    <div
      className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.15]"
      style={{
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
      }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────
export default function ComingSoon() {
  const { days, hours, minutes, seconds } = useCountdown();

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center selection:bg-purple-500/30"
      style={{ backgroundColor: "#09090b" }}
    >
      {/* Interactive Background */}
      <NeuralBackground />

      {/* Ambient Lighting */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 bottom-0 h-[500px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Film Grain */}
      <Noise />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center gap-10 sm:gap-14"
      >
        {/* Logo & Headline */}
        <div className="group flex flex-col items-center gap-6 cursor-default">
          <svg
            viewBox="0 0 32 24"
            className="h-5 w-auto text-white/90 transition-all duration-500 group-hover:text-purple-300 group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]"
            fill="currentColor"
          >
            <path d="M0 12 L8 0 L16 12 L8 24 Z" opacity="0.9" />
            <path d="M16 12 L24 0 L32 12 L24 24 Z" opacity="0.6" />
          </svg>
          <h1
            className="font-light text-white/90 tracking-[0.15em] uppercase transition-all duration-500 group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)" }}
          >
            Coming Soon
          </h1>
        </div>

        {/* Countdown Area */}
        <div className="flex items-end gap-3 sm:gap-6 px-4">
          <Block n={days} label="Days" />
          <Dot />
          <Block n={hours} label="Hours" />
          <Dot />
          <Block n={minutes} label="Minutes" />
          <Dot />
          <Block n={seconds} label="Seconds" />
        </div>

        {/* Interaction Area */}
        <div className="flex flex-col items-center gap-8 mt-4">
          <div className="flex items-center gap-4">
            <a
              href="mailto:hello@aether-db.com"
              className="group relative overflow-hidden rounded-full px-8 py-3 text-[13px] font-semibold tracking-wide text-[#09090b] transition-all hover:scale-105 active:scale-95 bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
              Notify Me
            </a>
            <a
              href="#"
              className="rounded-full border border-white/10 bg-white/[0.02] px-8 py-3 text-[13px] font-medium tracking-wide text-white/70 backdrop-blur-md transition-all hover:bg-white/[0.08] hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:border-purple-500/30"
            >
              Learn More
            </a>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-6">
            {[
              {
                label: "Facebook",
                d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
              },
              {
                label: "Twitter",
                d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
              },
              {
                label: "GitHub",
                d: "M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z",
              },
            ].map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="text-white/30 transition-all hover:text-purple-300 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] hover:-translate-y-0.5"
                style={{ filter: "drop-shadow(0 0 0px transparent)" }}
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={social.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
