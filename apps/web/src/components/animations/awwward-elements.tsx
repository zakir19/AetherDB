"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring, useTransform, useScroll, useMotionValue, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Custom Cursor ─────────────────────────────────────────
export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a") || target.closest("input") || target.closest(".magnetic")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    >
      <motion.div
        animate={{
          scale: isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-8 w-8 rounded-full bg-white"
      />
    </motion.div>
  );
}


export function MagneticWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn("magnetic inline-block", className)}
    >
      {children}
    </motion.div>
  );
}

// ─── Spotlight Card ────────────────────────────────────────
export function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={cn("relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:border-white/20", className)}
    >
      <motion.div
        animate={{ opacity: isFocused ? 1 : 0 }}
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.1), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

// ─── SVG Line Drawing Background ───────────────────────────
export function SvgBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Horizontal sweep gradients */}
          <linearGradient id="gl-h1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a1a1aa" stopOpacity="0" />
            <stop offset="40%" stopColor="#a1a1aa" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#71717a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gl-h2" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#71717a" stopOpacity="0" />
            <stop offset="50%" stopColor="#a1a1aa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#52525b" stopOpacity="0" />
          </linearGradient>
          {/* Diagonal sweep gradients */}
          <linearGradient id="gl-d1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a1a1aa" stopOpacity="0" />
            <stop offset="50%" stopColor="#d4d4d8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#71717a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gl-d2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#71717a" stopOpacity="0" />
            <stop offset="50%" stopColor="#a1a1aa" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#52525b" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="gl-r1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a1a1aa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#71717a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <motion.path
          d="M-200,180 C 200,120 600,300 900,200 S 1300,80 1700,260"
          fill="none" stroke="url(#gl-h1)" strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0 }}
        />
        <motion.path
          d="M1640,140 C 1200,60 900,340 560,260 S 180,100 -200,320"
          fill="none" stroke="url(#gl-h2)" strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 1.2 }}
        />
        <motion.path
          d="M-100,480 Q 360,360 720,500 T 1540,420"
          fill="none" stroke="url(#gl-d1)" strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.6 }}
        />
        <motion.path
          d="M80,-60 C 120,80 60,220 140,360 S 200,500 100,660"
          fill="none" stroke="url(#gl-d2)" strokeWidth="0.9"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 2 }}
        />
        <motion.path
          d="M1340,-40 C 1380,100 1300,280 1400,420 S 1460,580 1340,740"
          fill="none" stroke="url(#gl-d1)" strokeWidth="0.7"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 1.8 }}
        />
        <motion.path
          d="M-200,680 C 200,560 500,760 800,640 S 1200,500 1700,700"
          fill="none" stroke="url(#gl-h1)" strokeWidth="0.6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
        />
        <motion.path
          d="M 720 -100 A 520 520 0 0 1 720 1000"
          fill="none" stroke="url(#gl-r1)" strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 9, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 3 }}
        />
        <motion.line x1="-40" y1="340" x2="340" y2="-40"
          stroke="url(#gl-d2)" strokeWidth="0.7"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 2.5 }}
        />
        <motion.line x1="1100" y1="-40" x2="1480" y2="340"
          stroke="url(#gl-d1)" strokeWidth="0.7"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 3.5 }}
        />
      </svg>
    </div>
  );
}

// ─── Staggered Text Reveal ─────────────────────────────────
export function TextReveal({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden: { y: "100%", opacity: 0, rotateX: -45 },
            visible: { y: "0%", opacity: 1, rotateX: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
          }}
          style={{ perspective: "1000px" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// ─── Parallax Scroll Wrapper ───────────────────────────────
export function ParallaxScroll({ children, offset = 50, className }: { children: React.ReactNode; offset?: number; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
