"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@aether-ui/react";

// ─── Typing Animation Hook ─────────────────────────────────
function useTypingAnimation(text: string, speed = 50, startDelay = 2000) {
  const [displayed, setDisplayed] = React.useState("");
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay]);

  React.useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [displayed, text, speed, started]);

  return { displayed, done: displayed.length >= text.length };
}

// ─── Count-Up Animation ────────────────────────────────────
function CountUp({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = React.useState(0);
  const [hasStarted, setHasStarted] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHasStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!hasStarted) return;
    const steps = 60;
    const increment = end / steps;
    const stepTime = duration / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);
    return () => clearInterval(interval);
  }, [hasStarted, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Tech Stack Badges ─────────────────────────────────────
const techStack = [
  { label: "React 19", icon: "⚛" },
  { label: "TypeScript 5.5", icon: "TS" },
  { label: "Tailwind v4", icon: "🎨" },
  { label: "Radix", icon: "◎" },
  { label: "Framer Motion", icon: "▶" },
  { label: "Three.js", icon: "△" },
];

// ─── Social Proof Data ─────────────────────────────────────
const socialProof = [
  { value: 12400, suffix: "+", label: "GitHub Stars" },
  { value: 89000, suffix: "+", label: "Weekly Downloads" },
  { value: 3200, suffix: "+", label: "Discord Members" },
  { value: 17, suffix: "+", label: "Components" },
];

// ─── Animated Title (Hero Content) ─────────────────────────
export function AnimatedTitle() {
  const { displayed, done } = useTypingAnimation(
    "npx aether add button card dialog",
    45,
    2500
  );
  const [mousePos, setMousePos] = React.useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
      onMouseMove={handleMouseMove}
    >
      {/* Mouse-reactive gradient spotlight */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsl(var(--aether-glow) / 0.15), transparent 60%)`,
        }}
      />

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 backdrop-blur"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--aether-glow))] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--aether-glow))]" />
        </span>
        Now in public beta — v0.1.0
      </motion.div>

      {/* Main Headline with gradient text + shimmer */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
          <span className="block bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent">
            Components Forged
          </span>
          <span
            className="mt-1 block bg-[length:200%_100%] bg-clip-text text-transparent animate-text-shimmer"
            style={{
              backgroundImage: `linear-gradient(90deg, hsl(var(--aether-glow)), hsl(var(--aether-primary)), hsl(var(--aether-accent)), hsl(var(--aether-glow)))`,
            }}
          >
            Beyond Reality
          </span>
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50 sm:text-xl"
      >
        The last component library you&apos;ll ever need. 18 themes, 8 variants per
        component, zero runtime overhead — fused into pure digital art.
      </motion.p>

      {/* Tech stack badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-2"
      >
        {techStack.map((t, i) => (
          <motion.span
            key={t.label}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.08, duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/50 backdrop-blur transition-colors hover:border-[hsl(var(--aether-glow)/0.3)] hover:text-white/80"
          >
            <span className="text-[10px]">{t.icon}</span>
            {t.label}
          </motion.span>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <MagneticWrap>
          <Button variant="glow" size="xl" className="group">
            <span>Get Started</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </MagneticWrap>

        <MagneticWrap>
          <Button variant="glass" size="xl">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </Button>
        </MagneticWrap>
      </motion.div>

      {/* Code Preview Card — Glass with Typing */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="mx-auto mt-10 max-w-xl"
      >
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-[1px] backdrop-blur-xl transition-all hover:border-white/[0.15]">
          {/* Inner glow border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[hsl(var(--aether-glow)/0.1)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative rounded-[15px] bg-black/40 backdrop-blur-xl">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
              <span className="ml-2 text-[11px] text-white/20">Terminal</span>
            </div>
            {/* Code content */}
            <div className="px-5 py-4">
              <code className="font-mono text-sm text-white/70">
                <span className="text-[hsl(var(--aether-glow))]">$</span>
                {" "}
                <span className="text-white/80">{displayed}</span>
                {!done && (
                  <span className="inline-block h-4 w-[2px] translate-y-[2px] bg-[hsl(var(--aether-glow))] animate-typing-cursor" />
                )}
              </code>
              {done && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="mt-3 space-y-1 font-mono text-xs"
                >
                  <div className="text-emerald-400/80">✓ Added button.tsx</div>
                  <div className="text-emerald-400/80">✓ Added card.tsx</div>
                  <div className="text-emerald-400/80">✓ Added dialog.tsx</div>
                  <div className="mt-2 text-white/30">3 components installed — 0kb runtime added</div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Social Proof Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-8 sm:gap-12"
      >
        {socialProof.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 + i * 0.1, duration: 0.5 }}
            className="text-center"
          >
            <div className="text-xl font-bold text-white/80 sm:text-2xl">
              <CountUp end={stat.value} suffix={stat.suffix} />
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-widest text-white/30">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Floating Component Card ───────────────────────────────
export function FloatingCard({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Magnetic Button Effect ────────────────────────────────
export function MagneticWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section Header ────────────────────────────────────────
export function SectionHeader({
  badge,
  title,
  description,
}: {
  badge?: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="mx-auto max-w-3xl text-center"
    >
      {badge && (
        <span className="mb-4 inline-flex items-center rounded-full border border-[hsl(var(--aether-glow))/0.3] bg-[hsl(var(--aether-glow))/0.1] px-3 py-1 text-xs font-medium text-[hsl(var(--aether-glow))]">
          {badge}
        </span>
      )}
      <h2 className="mt-4 text-4xl font-bold tracking-tight text-[hsl(var(--aether-fg))] sm:text-5xl md:text-6xl">
        {title}
      </h2>
      <p className="mt-6 text-lg text-[hsl(var(--aether-muted-fg))]">
        {description}
      </p>
    </motion.div>
  );
}

// ─── Scroll Progress ───────────────────────────────────────
export function ScrollProgress() {
  const scaleX = useMotionValue(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      scaleX.set(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scaleX]);

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[100] h-[2px] origin-left bg-gradient-to-r from-[hsl(var(--aether-glow))] via-[hsl(var(--aether-primary))] to-[hsl(var(--aether-accent))]"
      style={{ scaleX }}
    />
  );
}

// ─── Parallax Section ──────────────────────────────────────
export function ParallaxSection({
  children,
  speed = 0.5,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      y.set(center * speed * -0.1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, y]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Tilt Card ─────────────────────────────────────────────
export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(y * -20);
    rotateY.set(x * 20);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger Container ─────────────────────────────────────
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
