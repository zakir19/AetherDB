"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";

/* ================================================================
   Aether DB — Logo Reveal Splash Screen
   A cinematic GSAP intro that plays once on first visit, then
   calls `onComplete` to hand off to the landing page.
   ================================================================ */

// ── colour tokens (computed per theme) ──────────────────────
function getTokens(isDark: boolean) {
  return isDark
    ? {
        ACCENT: "#a1a1aa",       // zinc-400
        ACCENT_BRIGHT: "#d4d4d8", // zinc-300
        ACCENT_DIM: "rgba(161,161,170,0.25)",
        VOID: "#09090b",         // zinc-950
        MID: "#18181b",          // zinc-900
        TEXT: "#ffffff",
        TEXT_DIM: "rgba(255,255,255,0.2)",
        CURTAIN: "#000000",
        FLASH: "#ffffff",
        SCANLINE: "rgba(0,0,0,0.12)",
        ORB1: "rgba(161,161,170,0.12)",
        ORB2: "rgba(113,113,122,0.2)",
        ORB3: "rgba(161,161,170,0.15)",
        LOADER_TRACK: "rgba(255,255,255,0.08)",
        TICKER_BORDER: "rgba(161,161,170,0.06)",
        TICKER_TEXT: "rgba(161,161,170,0.25)",
        TAGLINE: "rgba(161,161,170,0.35)",
        CORE_STROKE: "rgba(255,255,255,0.15)",
        INNER_STROKE: "rgba(113,113,122,0.6)",
        RING2_STROKE: "rgba(113,113,122,0.18)",
        HEX_GRAD_STOP1: "0.25",
        HEX_GRAD_STOP2: "0.05",
        HEX_GRAD2_STOP1: "0.07",
      }
    : {
        ACCENT: "#52525b",       // zinc-600
        ACCENT_BRIGHT: "#27272a", // zinc-800
        ACCENT_DIM: "rgba(82,82,91,0.3)",
        VOID: "#fafafa",         // zinc-50
        MID: "#f4f4f5",          // zinc-100
        TEXT: "#18181b",          // zinc-900
        TEXT_DIM: "rgba(0,0,0,0.25)",
        CURTAIN: "#ffffff",
        FLASH: "#000000",
        SCANLINE: "rgba(0,0,0,0.04)",
        ORB1: "rgba(161,161,170,0.15)",
        ORB2: "rgba(113,113,122,0.12)",
        ORB3: "rgba(161,161,170,0.1)",
        LOADER_TRACK: "rgba(0,0,0,0.08)",
        TICKER_BORDER: "rgba(82,82,91,0.1)",
        TICKER_TEXT: "rgba(82,82,91,0.35)",
        TAGLINE: "rgba(82,82,91,0.45)",
        CORE_STROKE: "rgba(0,0,0,0.1)",
        INNER_STROKE: "rgba(82,82,91,0.45)",
        RING2_STROKE: "rgba(82,82,91,0.12)",
        HEX_GRAD_STOP1: "0.15",
        HEX_GRAD_STOP2: "0.05",
        HEX_GRAD2_STOP1: "0.05",
      };
}

export function LogoReveal({ onComplete, isDark = true }: { onComplete: () => void; isDark?: boolean }) {
  const t = getTokens(isDark);
  const rootRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const onCompleteRef = useRef(onComplete);
  const [ready, setReady] = useState(false);

  // keep ref in sync without triggering re-renders
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  /* ── load fonts ────────────────────────────────────────── */
  useEffect(() => {
    const id = "lr-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  /* ── build flowing lines ───────────────────────────────────── */
  useEffect(() => {
    const svg = flowRef.current;
    if (!svg) return;
    const ns = "http://www.w3.org/2000/svg";
    const LINE_COUNT = 20;
    const tweens: gsap.core.Tween[] = [];

    for (let i = 0; i < LINE_COUNT; i++) {
      const line = document.createElementNS(ns, "line");
      // spread lines across the viewport
      const baseX = (i / LINE_COUNT) * 120 - 10; // -10% to 110%
      const len = 30 + Math.random() * 40; // line length percent
      line.setAttribute("x1", `${baseX}%`);
      line.setAttribute("y1", "-10%");
      line.setAttribute("x2", `${baseX + len * 0.3}%`);
      line.setAttribute("y2", `${len}%`);
      line.setAttribute("stroke", t.ACCENT);
      line.setAttribute("stroke-width", `${0.3 + Math.random() * 0.5}`);
      line.setAttribute("opacity", `${0.03 + Math.random() * 0.06}`);
      svg.appendChild(line);

      // continuous downward flow
      const dur = 4 + Math.random() * 6;
      const tw = gsap.fromTo(
        line,
        { attr: { y1: "-20%", y2: `${len - 20}%` } },
        {
          attr: { y1: `${100 + len}%`, y2: `${100 + len * 2}%` },
          duration: dur,
          repeat: -1,
          ease: "none",
          delay: Math.random() * dur, // stagger start
        }
      );
      tweens.push(tw);
    }

    return () => {
      tweens.forEach((tw) => tw.kill());
      while (svg.firstChild) svg.removeChild(svg.firstChild);
    };
  }, [isDark, t.ACCENT]);

  /* ── build particles ──────────────────────────────────────── */
  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    for (let i = 0; i < 70; i++) {
      const pt = document.createElement("div");
      pt.className = "lr-pt";
      const size = 1 + Math.random() * 2.5;
      Object.assign(pt.style, {
        position: "absolute",
        borderRadius: "50%",
        background: t.ACCENT,
        boxShadow: `0 0 4px ${t.ACCENT}`,
        opacity: "0",
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      });
      container.appendChild(pt);
    }
    setReady(true);
    return () => {
      container.innerHTML = "";
    };
  }, []);

  /* ── master timeline ──────────────────────────────────────── */
  const runAnimation = useCallback(() => {
    if (!rootRef.current || !particlesRef.current) return;

    const particles = particlesRef.current.querySelectorAll(".lr-pt");
    const chars = rootRef.current.querySelectorAll(".lr-char");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    /* 0 — reset everything */
    gsap.set("#lr-loader", { display: "flex", opacity: 1 });
    gsap.set(["#lr-c-top", "#lr-c-bottom"], { scaleY: 1, opacity: 1 });
    gsap.set("#lr-flash", { opacity: 0 });
    gsap.set("#lr-scanlines", { opacity: 0 });
    gsap.set([".lr-hline", ".lr-vline", ".lr-bracket"], {
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
    });
    gsap.set(".lr-orb", { opacity: 0 });
    gsap.set(
      [
        "#lr-hex-outer",
        "#lr-hex-inner",
        "#lr-hex-core",
        "#lr-hex-fill",
        "#lr-hex-fill2",
        "#lr-lattice",
        "#lr-ring1",
        "#lr-ring-spin1",
        "#lr-ring-spin2",
      ],
      { opacity: 0 }
    );
    gsap.set("#lr-letter", { opacity: 0 });
    gsap.set(chars, { opacity: 0, y: 40, skewX: -8 });
    gsap.set("#lr-tagline", { opacity: 0 });
    gsap.set("#lr-glitch-name", { opacity: 0 });
    gsap.set(particles, { opacity: 0 });
    gsap.set("#lr-ticker", { opacity: 0 });

    /* PHASE 1 — LOADER (0 — 1.4s) */
    tl.to("#lr-loader-bar", { width: "100%", duration: 1.2, ease: "power2.inOut" }, 0)
      .to(
        "#lr-loader-pct",
        {
          duration: 1.2,
          onUpdate() {
            const pctEl = document.getElementById("lr-loader-pct");
            if (pctEl) pctEl.textContent = String(Math.round(this.progress() * 100)).padStart(3, "0");
          },
        },
        0
      )
      .to("#lr-loader", {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete() {
          const el = document.getElementById("lr-loader");
          if (el) el.style.display = "none";
        },
      }, 1.2);

    /* PHASE 2 — CURTAIN SPLIT (1.4s) */
    tl.to("#lr-c-top", { scaleY: 0, duration: 1.0, ease: "expo.inOut" }, 1.4)
      .to("#lr-c-bottom", { scaleY: 0, duration: 1.0, ease: "expo.inOut" }, 1.4)
      .to("#lr-flash", { opacity: 0.5, duration: 0.05, yoyo: true, repeat: 1 }, 1.38);

    /* PHASE 3 — HUD GRID (2.1s) */
    tl.to("#lr-scanlines", { opacity: 1, duration: 0.3 }, 2.0)
      .to("#lr-hl-top", { opacity: 1, scaleX: 1, duration: 0.7, ease: "power4.out" }, 2.1)
      .to("#lr-hl-bottom", { opacity: 1, scaleX: 1, duration: 0.7, ease: "power4.out" }, 2.15)
      .to("#lr-vl-l", { opacity: 1, scaleY: 1, duration: 0.6, ease: "power4.out" }, 2.2)
      .to("#lr-vl-r", { opacity: 1, scaleY: 1, duration: 0.6, ease: "power4.out" }, 2.25)
      .to(".lr-bracket", { opacity: 1, duration: 0.3, stagger: 0.08 }, 2.3);

    /* PHASE 4 — ORB GLOW (2.4s) */
    tl.to(".lr-orb", { opacity: 1, duration: 1.2, stagger: 0.15 }, 2.4);

    /* PHASE 5 — PARTICLES BURST (2.5s) */
    particles.forEach((pt, i) => {
      const delay = 2.5 + i * 0.012;
      tl.to(pt, { opacity: 0.4 + Math.random() * 0.5, duration: 0.4, ease: "power2.out" }, delay).to(
        pt,
        {
          y: -60 - Math.random() * 200,
          x: (Math.random() - 0.5) * 80,
          opacity: 0,
          duration: 1.8 + Math.random() * 1.5,
          ease: "power1.out",
        },
        delay + 0.05
      );
    });

    /* PHASE 6 — HEX LOGO BUILD (2.8s) */
    tl.to("#lr-ring1", { opacity: 1, duration: 0.1 }, 2.8)
      .to("#lr-ring1", { opacity: 0, duration: 0.5, ease: "power2.out" }, 2.95)
      .fromTo("#lr-hex-fill", { scale: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)", transformOrigin: "center" }, 2.85)
      .fromTo("#lr-hex-fill2", { scale: 0 }, { scale: 1, opacity: 0.6, duration: 0.5, ease: "back.out(1.8)", transformOrigin: "center" }, 2.9)
      .to("#lr-hex-outer", { opacity: 1, duration: 0.05 }, 2.85)
      .fromTo(
        "#lr-hex-outer",
        { strokeDasharray: "0 400", strokeDashoffset: 0 },
        { strokeDasharray: "400 0", duration: 0.8, ease: "power3.out" },
        2.85
      )
      .to("#lr-hex-inner", { opacity: 1, duration: 0.05 }, 3.1)
      .fromTo(
        "#lr-hex-inner",
        { strokeDasharray: "0 300", strokeDashoffset: 0 },
        { strokeDasharray: "300 0", duration: 0.6, ease: "power2.out" },
        3.1
      )
      .to("#lr-hex-core", { opacity: 0.5, duration: 0.4 }, 3.3)
      .to("#lr-lattice", { opacity: 1, duration: 0.3 }, 3.2)
      .fromTo(
        ".lr-gline",
        { strokeDasharray: "0 200", strokeDashoffset: 0 },
        { strokeDasharray: "200 0", duration: 0.5, stagger: 0.1, ease: "power2.out" },
        3.2
      )
      .to("#lr-ring-spin1", { opacity: 1, duration: 0.4 }, 3.0)
      .to("#lr-ring-spin2", { opacity: 1, duration: 0.4 }, 3.1)
      .add(() => {
        gsap.to("#lr-ring-spin1", { rotation: 360, duration: 18, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
        gsap.to("#lr-ring-spin2", { rotation: -360, duration: 28, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
      }, 3.0);

    /* PHASE 7 — LETTERMARK (3.5s) */
    tl.to("#lr-letter", { opacity: 0.3, duration: 0.05 }, 3.5)
      .to("#lr-letter", { opacity: 0, duration: 0.05 }, 3.55)
      .to("#lr-letter", { opacity: 1, duration: 0.3, ease: "power4.out" }, 3.6);

    /* PHASE 8 — WORDMARK CHARS (3.9s) */
    chars.forEach((ch, i) => {
      tl.to(ch, { opacity: 1, y: 0, skewX: 0, duration: 0.55, ease: "expo.out" }, 3.9 + i * 0.065);
    });

    /* PHASE 9 — GLITCH BURST (4.7s) */
    tl.to("#lr-glitch-name", { opacity: 0.6, x: -6, duration: 0.05 }, 4.7)
      .to("#lr-glitch-name", { opacity: 0.4, x: 8, duration: 0.05 }, 4.75)
      .to("#lr-glitch-name", { opacity: 0.7, x: -4, duration: 0.05 }, 4.8)
      .to("#lr-glitch-name", { opacity: 0, x: 0, duration: 0.1 }, 4.85);

    /* PHASE 10 — TAGLINE + HUD SETTLE (4.9s) */
    tl.to("#lr-tagline", { opacity: 1, duration: 0.6 }, 4.9)
      .to("#lr-hl-mid1", { opacity: 0.4, scaleX: 1, duration: 0.8 }, 5.0);

    /* PHASE 11 — TICKER (5.3s) — then timeline ends and we hand off */
    tl.to("#lr-ticker", { opacity: 1, duration: 0.5 }, 5.3);

    /* PHASE 12 — FADE OUT + HAND OFF (6.2s) */
    tl.to(rootRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => onCompleteRef.current(),
    }, 6.2);

    tlRef.current = tl;
    return tl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── kick off animation once ready (runs exactly once) ── */
  useEffect(() => {
    if (!ready) return;
    const tl = runAnimation();
    return () => {
      tl?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  /* ── ticker scroll ─────────────────────────────────────── */
  useEffect(() => {
    if (!ready) return;
    const t = gsap.to("#lr-ticker", { x: "-50%", duration: 20, ease: "none", repeat: -1, delay: 6 });
    return () => { t.kill(); };
  }, [ready]);

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: t.VOID,
        fontFamily: "'Space Mono', 'SF Mono', 'Fira Code', monospace",
        overflow: "hidden",
      }}
    >
      {/* ── noise grain overlay ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.045,
          pointerEvents: "none",
          zIndex: 999,
          mixBlendMode: "overlay" as const,
        }}
      />

      {/* ── Loader ── */}
      <div
        id="lr-loader"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: t.VOID,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ width: 200, height: 1, background: t.LOADER_TRACK, overflow: "hidden" }}>
          <div id="lr-loader-bar" style={{ height: "100%", width: "0%", background: t.ACCENT, boxShadow: `0 0 12px ${t.ACCENT}` }} />
        </div>
        <div id="lr-loader-pct" style={{ fontSize: 11, letterSpacing: 4, color: t.TEXT_DIM }}>
          000
        </div>
      </div>

      {/* ── Curtains ── */}
      <div id="lr-c-top" style={{ position: "fixed", zIndex: 90, background: t.CURTAIN, top: 0, left: 0, right: 0, height: "50%", transformOrigin: "top" }} />
      <div id="lr-c-bottom" style={{ position: "fixed", zIndex: 90, background: t.CURTAIN, bottom: 0, left: 0, right: 0, height: "50%", transformOrigin: "bottom" }} />

      {/* ── Flash ── */}
      <div id="lr-flash" style={{ position: "fixed", inset: 0, zIndex: 200, background: t.FLASH, opacity: 0, pointerEvents: "none" }} />

      {/* ── Flowing background lines ── */}
      <svg
        ref={flowRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* ── Scanlines ── */}
      <div
        id="lr-scanlines"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          pointerEvents: "none",
          background: `repeating-linear-gradient(0deg,transparent,transparent 2px,${t.SCANLINE} 2px,${t.SCANLINE} 4px)`,
          opacity: 0,
        }}
      />

      {/* ── Glow orbs ── */}
      <div className="lr-orb" style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", opacity: 0, filter: "blur(80px)", width: 500, height: 500, background: `radial-gradient(circle, ${t.ORB1}, transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      <div className="lr-orb" style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", opacity: 0, filter: "blur(80px)", width: 300, height: 300, background: `radial-gradient(circle, ${t.ORB2}, transparent 70%)`, top: "30%", left: "55%" }} />
      <div className="lr-orb" style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", opacity: 0, filter: "blur(80px)", width: 250, height: 250, background: `radial-gradient(circle, ${t.ORB3}, transparent 70%)`, top: "55%", left: "35%" }} />

      {/* ── HUD lines ── */}
      <div className="lr-hline" id="lr-hl-top" style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${t.ACCENT}, transparent)`, opacity: 0, transform: "scaleX(0)", boxShadow: `0 0 8px ${t.ACCENT}`, top: "15%" }} />
      <div className="lr-hline" id="lr-hl-bottom" style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${t.ACCENT}, transparent)`, opacity: 0, transform: "scaleX(0)", boxShadow: `0 0 8px ${t.ACCENT}`, bottom: "15%" }} />
      <div className="lr-hline" id="lr-hl-mid1" style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${t.ACCENT}, transparent)`, opacity: 0, transform: "scaleX(0)", boxShadow: `0 0 8px ${t.ACCENT}`, top: "50%" }} />
      <div className="lr-vline" id="lr-vl-l" style={{ position: "absolute", top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${t.ACCENT_DIM}, transparent)`, opacity: 0, transform: "scaleY(0)", left: "12%" }} />
      <div className="lr-vline" id="lr-vl-r" style={{ position: "absolute", top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${t.ACCENT_DIM}, transparent)`, opacity: 0, transform: "scaleY(0)", right: "12%" }} />

      {/* ── Corner brackets ── */}
      {(
        [
          { id: "lr-br-tl", style: { top: "14%", left: "11%" } },
          { id: "lr-br-tr", style: { top: "14%", right: "11%", transform: "scaleX(-1)" } },
          { id: "lr-br-bl", style: { bottom: "14%", left: "11%", transform: "scaleY(-1)" } },
          { id: "lr-br-br", style: { bottom: "14%", right: "11%", transform: "scale(-1)" } },
        ] as const
      ).map((b) => (
        <div
          key={b.id}
          id={b.id}
          className="lr-bracket"
          style={{ position: "absolute", width: 30, height: 30, opacity: 0, ...b.style }}
        >
          <span style={{ position: "absolute", width: "100%", height: 1, top: 0, left: 0, background: t.ACCENT, boxShadow: `0 0 6px ${t.ACCENT}` }} />
          <span style={{ position: "absolute", width: 1, height: "100%", top: 0, left: 0, background: t.ACCENT, boxShadow: `0 0 6px ${t.ACCENT}` }} />
        </div>
      ))}

      {/* ── Particles ── */}
      <div
        ref={particlesRef}
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10, overflow: "hidden" }}
      />

      {/* ── Scene ── */}
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* SVG Logo Mark */}
        <svg
          id="lr-logo-svg"
          viewBox="-80 -80 160 160"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", width: 160, height: 160, top: "50%", left: "50%", transform: "translate(-50%, -60%)", overflow: "visible" }}
        >
          <defs>
            <filter id="lr-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="lr-glow2" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="lr-hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={t.ACCENT} stopOpacity={t.HEX_GRAD_STOP1} />
              <stop offset="100%" stopColor="#71717a" stopOpacity={t.HEX_GRAD_STOP2} />
            </linearGradient>
            <linearGradient id="lr-hexGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#ffffff" : "#000000"} stopOpacity={t.HEX_GRAD2_STOP1} />
              <stop offset="100%" stopColor={t.ACCENT} stopOpacity="0" />
            </linearGradient>
            <clipPath id="lr-hexClip">
              <polygon points="0,-65 56.3,-32.5 56.3,32.5 0,65 -56.3,32.5 -56.3,-32.5" />
            </clipPath>
          </defs>

          <circle id="lr-ring1" cx="0" cy="0" r="72" fill="none" stroke={t.ACCENT_DIM} strokeWidth="20" opacity="0" filter="url(#lr-glow2)" />
          <circle id="lr-ring-spin1" cx="0" cy="0" r="68" fill="none" stroke={t.ACCENT_DIM} strokeWidth="1" strokeDasharray="8 12" opacity="0" />
          <circle id="lr-ring-spin2" cx="0" cy="0" r="76" fill="none" stroke={t.RING2_STROKE} strokeWidth="0.8" strokeDasharray="4 16" opacity="0" />

          <polygon id="lr-hex-fill" points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" fill="url(#lr-hexGrad)" opacity="0" />
          <polygon id="lr-hex-fill2" points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" fill="url(#lr-hexGrad2)" opacity="0" />
          <polygon id="lr-hex-outer" points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" fill="none" stroke={t.ACCENT} strokeWidth="1.5" opacity="0" />
          <polygon id="lr-hex-inner" points="0,-44 38,-22 38,22 0,44 -38,22 -38,-22" fill="none" stroke={t.INNER_STROKE} strokeWidth="1" opacity="0" />
          <polygon id="lr-hex-core" points="0,-28 24.2,-14 24.2,14 0,28 -24.2,14 -24.2,-14" fill="none" stroke={t.CORE_STROKE} strokeWidth="0.5" opacity="0" />

          <g id="lr-lattice" opacity="0">
            <line className="lr-gline" x1="0" y1="-60" x2="0" y2="60" stroke={t.ACCENT} strokeWidth="0.5" opacity="0" />
            <line className="lr-gline" x1="-52" y1="-30" x2="52" y2="30" stroke={t.ACCENT} strokeWidth="0.5" opacity="0" />
            <line className="lr-gline" x1="-52" y1="30" x2="52" y2="-30" stroke={t.ACCENT} strokeWidth="0.5" opacity="0" />
          </g>

          <text
            id="lr-letter"
            x="0"
            y="2"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 52,
              fill: t.TEXT,
              textAnchor: "middle",
              dominantBaseline: "central",
              opacity: 0,
              filter: "url(#lr-glow)",
            }}
          >
            Æ
          </text>
        </svg>

        {/* ── Wordmark ── */}
        <div
          id="lr-wordmark"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, calc(-50% + 110px))",
            textAlign: "center",
            overflow: "visible",
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(42px, 6vw, 72px)",
              letterSpacing: "0.22em",
              color: t.TEXT,
              display: "flex",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            {"AETHER".split("").map((c, i) => (
              <span key={i} className="lr-char" style={{ display: "inline-block", opacity: 0, transform: "translateY(40px) skewX(-8deg)" }}>
                {c}
              </span>
            ))}
            <span
              className="lr-char"
              style={{
                display: "inline-block",
                opacity: 0,
                transform: "translateY(40px) skewX(-8deg)",
                color: t.ACCENT_BRIGHT,
                textShadow: `0 0 20px ${t.ACCENT}, 0 0 60px ${t.ACCENT_DIM}`,
                marginLeft: 8,
              }}
            >
              &nbsp;DB
            </span>
          </div>
          <div
            id="lr-tagline"
            style={{
              fontSize: 10,
              letterSpacing: "0.45em",
              color: t.TAGLINE,
              marginTop: 10,
              opacity: 0,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Distributed Intelligence Engine
          </div>
        </div>

        {/* ── Glitch clone ── */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, calc(-50% + 110px))",
            textAlign: "center",
            pointerEvents: "none",
            mixBlendMode: "screen" as const,
          }}
        >
          <div
            id="lr-glitch-name"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(42px, 6vw, 72px)",
              letterSpacing: "0.22em",
              color: t.ACCENT,
              opacity: 0,
              whiteSpace: "nowrap",
              filter: "blur(0px)",
            }}
          >
            AETHER&nbsp;DB
          </div>
        </div>
      </div>

      {/* ── Ticker ── */}
      <div
        id="lr-ticker"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "8px 20px",
          fontSize: 9,
          letterSpacing: "0.3em",
          color: t.TICKER_TEXT,
          borderTop: `1px solid ${t.TICKER_BORDER}`,
          display: "flex",
          gap: 40,
          opacity: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <span>CLUSTER_ID: AE-7X-PRIME</span>
        <span>NODES: 2,048</span>
        <span>LATENCY: 0.4ms</span>
        <span>THROUGHPUT: 4.2M OPS/SEC</span>
        <span>UPTIME: 99.9999%</span>
        <span>BUILD: v4.0.0-alpha</span>
      </div>
    </div>
  );
}