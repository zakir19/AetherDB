"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import gsap from "gsap";

// Animated SVG Components
const FloatingHexagon = ({ 
  className, 
  delay = 0,
  isDark 
}: { 
  className?: string; 
  delay?: number;
  isDark: boolean;
}) => (
  <motion.svg
    width="120"
    height="140"
    viewBox="0 0 120 140"
    fill="none"
    className={className}
    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
    animate={{ 
      opacity: isDark ? 0.15 : 0.08, 
      scale: 1, 
      rotate: 0,
      y: [0, -15, 0],
    }}
    transition={{ 
      opacity: { duration: 0.8, delay },
      scale: { duration: 0.8, delay },
      rotate: { duration: 0.8, delay },
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 }
    }}
  >
    <path
      d="M60 10L110 40V100L60 130L10 100V40L60 10Z"
      stroke={isDark ? "url(#hexGradientDark)" : "url(#hexGradientLight)"}
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M60 30L90 50V90L60 110L30 90V50L60 30Z"
      stroke={isDark ? "url(#hexGradientDark2)" : "url(#hexGradientLight2)"}
      strokeWidth="1.5"
      fill="none"
      opacity="0.5"
    />
    <defs>
      <linearGradient id="hexGradientDark" x1="10" y1="10" x2="110" y2="130" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#a78bfa" />
      </linearGradient>
      <linearGradient id="hexGradientLight" x1="10" y1="10" x2="110" y2="130" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4f46e5" />
        <stop offset="1" stopColor="#7c3aed" />
      </linearGradient>
      <linearGradient id="hexGradientDark2" x1="30" y1="30" x2="90" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#818cf8" stopOpacity="0.5" />
        <stop offset="1" stopColor="#c4b5fd" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="hexGradientLight2" x1="30" y1="30" x2="90" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" stopOpacity="0.4" />
        <stop offset="1" stopColor="#8b5cf6" stopOpacity="0.2" />
      </linearGradient>
    </defs>
  </motion.svg>
);

const CircuitLines = ({ isDark }: { isDark: boolean }) => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isDark ? "#6366f1" : "#4f46e5"} stopOpacity="0" />
        <stop offset="50%" stopColor={isDark ? "#6366f1" : "#4f46e5"} stopOpacity={isDark ? 0.3 : 0.2} />
        <stop offset="100%" stopColor={isDark ? "#6366f1" : "#4f46e5"} stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Animated circuit paths */}
    <motion.path
      d="M-100 200 Q 200 100, 400 300 T 800 200 T 1200 300 T 1600 200 T 2000 300"
      stroke="url(#circuitGradient)"
      strokeWidth="1"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 3, ease: "easeInOut" }}
    />
    <motion.path
      d="M-100 400 Q 300 300, 500 500 T 900 400 T 1300 500 T 1700 400 T 2100 500"
      stroke="url(#circuitGradient)"
      strokeWidth="1"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
    />
    <motion.path
      d="M-100 600 Q 200 500, 600 700 T 1000 600 T 1400 700 T 1800 600 T 2200 700"
      stroke="url(#circuitGradient)"
      strokeWidth="1"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 3, ease: "easeInOut", delay: 1 }}
    />
  </svg>
);

const DataNodes = ({ isDark }: { isDark: boolean }) => {
  const nodes = [
    { x: 10, y: 20, size: 4, delay: 0 },
    { x: 25, y: 35, size: 3, delay: 0.2 },
    { x: 15, y: 60, size: 5, delay: 0.4 },
    { x: 80, y: 15, size: 4, delay: 0.1 },
    { x: 90, y: 40, size: 3, delay: 0.3 },
    { x: 85, y: 70, size: 4, delay: 0.5 },
    { x: 70, y: 85, size: 3, delay: 0.6 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute rounded-full",
            isDark ? "bg-indigo-500/30" : "bg-indigo-600/20"
          )}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: node.size,
            height: node.size,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: node.delay,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full",
              isDark ? "bg-indigo-400/50" : "bg-indigo-500/40"
            )}
            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: node.delay }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Pre-defined particle positions to avoid hydration mismatch
const particlePositions = [
  { left: "15.2%", top: "18.5%", width: 3, height: 3 },
  { left: "78.4%", top: "22.1%", width: 4, height: 4 },
  { left: "25.6%", top: "65.3%", width: 2, height: 2 },
  { left: "85.7%", top: "72.8%", width: 5, height: 5 },
  { left: "42.3%", top: "15.2%", width: 3, height: 3 },
  { left: "62.1%", top: "58.9%", width: 4, height: 4 },
  { left: "12.8%", top: "45.6%", width: 2, height: 2 },
  { left: "91.4%", top: "38.2%", width: 3, height: 3 },
  { left: "35.7%", top: "82.4%", width: 4, height: 4 },
  { left: "55.3%", top: "28.7%", width: 2, height: 2 },
  { left: "8.9%", top: "78.1%", width: 5, height: 5 },
  { left: "72.6%", top: "48.3%", width: 3, height: 3 },
];

const GlitchText = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  useEffect(() => {
    if (!textRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    
    // Glitch effect
    tl.to(textRef.current, {
      x: 3,
      duration: 0.05,
      ease: "power2.in",
    })
    .to(textRef.current, {
      x: -2,
      duration: 0.05,
    })
    .to(textRef.current, {
      x: 2,
      duration: 0.05,
    })
    .to(textRef.current, {
      x: 0,
      duration: 0.05,
      ease: "power2.out",
    })
    .to(textRef.current, {
      skewX: 5,
      duration: 0.08,
      delay: 0.3,
    })
    .to(textRef.current, {
      skewX: -3,
      duration: 0.06,
    })
    .to(textRef.current, {
      skewX: 0,
      duration: 0.08,
      ease: "power2.out",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="relative">
      {/* Glitch layers */}
      <div
        ref={textRef}
        className={cn(
          "relative z-10",
          className
        )}
        style={{
          textShadow: isDark
            ? "2px 0 #6366f1, -2px 0 #ec4899"
            : "2px 0 #4f46e5, -2px 0 #db2777",
        }}
      >
        {children}
      </div>
      {/* RGB split effect */}
      <div
        className={cn(
          "absolute inset-0 opacity-50 mix-blend-screen",
          className
        )}
        style={{
          color: isDark ? "#6366f1" : "#4f46e5",
          transform: "translateX(-3px)",
          clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
        }}
        aria-hidden
      >
        {children}
      </div>
      <div
        className={cn(
          "absolute inset-0 opacity-50 mix-blend-screen",
          className
        )}
        style={{
          color: isDark ? "#ec4899" : "#db2777",
          transform: "translateX(3px)",
          clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
        }}
        aria-hidden
      >
        {children}
      </div>
    </div>
  );
};

export default function NotFound() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Floating particles with GSAP
    const particles = containerRef.current.querySelectorAll(".void-particle");
    particles.forEach((p, i) => {
      gsap.to(p, {
        y: `random(-80, 80)`,
        x: `random(-50, 50)`,
        opacity: `random(0.1, 0.6)`,
        scale: `random(0.3, 1.2)`,
        duration: `random(5, 10)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.4,
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6",
        isDark ? "bg-[#09090b]" : "bg-[#fafafa]"
      )}
    >
      {/* Circuit lines background */}
      <CircuitLines isDark={isDark} />

      {/* Animated gradient orbs */}
      <motion.div
        className={cn(
          "pointer-events-none absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full",
          isDark ? "bg-indigo-600/10" : "bg-indigo-500/10"
        )}
        style={{ filter: "blur(120px)" }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={cn(
          "pointer-events-none absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full",
          isDark ? "bg-violet-600/10" : "bg-violet-500/10"
        )}
        style={{ filter: "blur(100px)" }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Data nodes */}
      <DataNodes isDark={isDark} />

      {/* Floating hexagons */}
      <FloatingHexagon 
        className="absolute left-[5%] top-[15%] w-20 h-auto" 
        delay={0}
        isDark={isDark}
      />
      <FloatingHexagon 
        className="absolute right-[8%] top-[20%] w-16 h-auto" 
        delay={0.3}
        isDark={isDark}
      />
      <FloatingHexagon 
        className="absolute left-[10%] bottom-[20%] w-24 h-auto" 
        delay={0.6}
        isDark={isDark}
      />
      <FloatingHexagon 
        className="absolute right-[5%] bottom-[15%] w-14 h-auto" 
        delay={0.9}
        isDark={isDark}
      />

      {/* Floating void particles - use seeded positions to avoid hydration mismatch */}
      {particlePositions.map((particle, i) => (
        <div
          key={i}
          className={cn(
            "void-particle pointer-events-none absolute rounded-full",
            isDark
              ? "bg-gradient-to-br from-indigo-500/40 to-violet-500/40"
              : "bg-gradient-to-br from-indigo-400/30 to-violet-400/30"
          )}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.width,
            height: particle.height,
          }}
        />
      ))}

      {/* Grid overlay */}
      <div
        className={cn("pointer-events-none absolute inset-0 opacity-[0.03]")}
        style={{
          backgroundImage: `
            linear-gradient(${isDark ? "#ffffff" : "#000000"} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? "#ffffff" : "#000000"} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* 404 with glitch effect */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlitchText
            className={cn(
              "text-[10rem] font-black leading-none tracking-tighter sm:text-[14rem]",
              isDark ? "text-zinc-800" : "text-zinc-200"
            )}
          >
            404
          </GlitchText>
        </motion.div>

        {/* Animated divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "mx-auto -mt-4 mb-8 h-px w-64 origin-center",
            isDark
              ? "bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
              : "bg-gradient-to-r from-transparent via-indigo-600/40 to-transparent"
          )}
        />

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2
            className={cn(
              "text-2xl font-bold tracking-tight sm:text-3xl",
              isDark ? "text-zinc-300" : "text-zinc-700"
            )}
          >
            Page Not Found
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={cn(
            "mt-3 max-w-md text-base",
            isDark ? "text-zinc-500" : "text-zinc-500"
          )}
        >
          The page you're looking for doesn't exist or has been moved to another dimension.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/"
            className={cn(
              "group relative flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95",
              isDark
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
            )}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <svg
              className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="relative z-10">Back to Aether</span>
          </Link>

          <Link
            href="/builder"
            className={cn(
              "group flex items-center gap-2 rounded-full border px-8 py-4 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95",
              isDark
                ? "border-white/10 bg-white/5 text-zinc-300 hover:border-indigo-500/30 hover:bg-white/10 hover:text-white"
                : "border-zinc-200 bg-white/50 text-zinc-600 hover:border-indigo-500/30 hover:bg-white/80 hover:text-zinc-900"
            )}
          >
            Open Builder
            <svg 
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Bottom brand mark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 flex items-center gap-2"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={isDark ? "text-zinc-700" : "text-zinc-300"}>
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className={cn(
          "text-xs font-medium uppercase tracking-[0.2em]",
          isDark ? "text-zinc-700" : "text-zinc-300"
        )}>
          Aether DB
        </span>
      </motion.div>
    </div>
  );
}
