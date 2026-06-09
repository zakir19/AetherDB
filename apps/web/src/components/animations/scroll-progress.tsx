"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
  position: number;
}

const SECTIONS: Section[] = [
  { id: "hero", label: "Start", position: 0 },
  { id: "features", label: "Features", position: 0.25 },
  { id: "how-it-works", label: "How it Works", position: 0.5 },
  { id: "stats", label: "Stats", position: 0.75 },
  { id: "cta", label: "Start Building", position: 1 },
];

interface ScrollProgressIndicatorProps {
  isDark?: boolean;
}

export function ScrollProgressIndicator({ isDark = true }: ScrollProgressIndicatorProps) {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    setProgressPercent(Math.round(latest * 100));
    
    for (let i = SECTIONS.length - 1; i >= 0; i--) {
      if (latest >= SECTIONS[i].position - 0.05) {
        setActiveIndex(i);
        break;
      }
    }
  });

  const scrollToSection = (position: number) => {
    const targetY = position * (document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center">
      <div className="relative h-[300px] w-[40px]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 40 300"
          fill="none"
          preserveAspectRatio="none"
        >

          <path
            d="M20 10 L20 290"
            stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            strokeWidth="2"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#a1a1aa" : "#71717a"} />
              <stop offset="50%" stopColor={isDark ? "#d4d4d8" : "#52525b"} />
              <stop offset="100%" stopColor={isDark ? "#e4e4e7" : "#3f3f46"} />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <motion.path
            d="M20 10 L20 290"
            stroke="url(#progressGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              pathLength: smoothProgress,
              filter: "url(#glow)",
            }}
          />
        </svg>

        {/* Section Nodes */}
        {SECTIONS.map((section, index) => (
          <SectionNode
            key={section.id}
            section={section}
            index={index}
            activeIndex={activeIndex}
            isDark={isDark}
            onClick={() => scrollToSection(section.position)}
          />
        ))}
      </div>

      <motion.div
        className={cn(
          "mt-4 text-[10px] font-mono tracking-wider transition-colors",
          isDark ? "text-zinc-500" : "text-zinc-400"
        )}
      >
        <span>{progressPercent}%</span>
      </motion.div>
    </div>
  );
}

function SectionNode({
  section,
  index,
  activeIndex,
  isDark,
  onClick,
}: {
  section: Section;
  index: number;
  activeIndex: number;
  isDark: boolean;
  onClick: () => void;
}) {
  const isActive = activeIndex === index;
  const isPast = activeIndex > index;

  return (
    <motion.button
      className="absolute left-1/2 -translate-x-1/2 focus:outline-none group"
      style={{ top: `${10 + section.position * 280}px` }}
      onClick={onClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Scroll to ${section.label}`}
    >
      <div
        className={cn(
          "absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
          isDark
            ? "bg-zinc-800 text-zinc-200 border border-zinc-700"
            : "bg-white text-zinc-700 border border-zinc-200 shadow-sm"
        )}
      >
        {section.label}

        <div
          className={cn(
            "absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45",
            isDark ? "bg-zinc-800 border-l border-b border-zinc-700" : "bg-white border-l border-b border-zinc-200"
          )}
        />
      </div>

      <motion.div
        className={cn(
          "rounded-full border-2 transition-all duration-300 flex items-center justify-center",
          isDark
            ? "border-zinc-600 bg-zinc-950"
            : "border-zinc-300 bg-white"
        )}
        animate={{
          width: isActive ? 16 : 10,
          height: isActive ? 16 : 10,
          boxShadow: isDark
            ? isActive
              ? "0 0 20px rgba(228,228,231,0.6), 0 0 40px rgba(228,228,231,0.3)"
              : "0 0 0px rgba(228,228,231,0)"
            : isActive
              ? "0 0 20px rgba(82,82,91,0.4), 0 0 40px rgba(82,82,91,0.2)"
              : "0 0 0px rgba(82,82,91,0)",
        }}
        transition={{ duration: 0.3 }}
      >

        <motion.div
          className={cn(
            "w-full h-full rounded-full",
            isDark ? "bg-zinc-300" : "bg-zinc-600"
          )}
          initial={false}
          animate={{
            scale: isActive || isPast ? 0.6 : 0,
            opacity: isActive || isPast ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {isActive && (
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full",
            isDark ? "bg-zinc-400" : "bg-zinc-500"
          )}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
    </motion.button>
  );
}

export function useScrollProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return smoothProgress;
}
