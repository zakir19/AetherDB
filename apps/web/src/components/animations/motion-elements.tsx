"use client";

import React from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView } from "framer-motion";
import { Button } from "@aether-ui/react";

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

export function AnimatedTitle() {
  const { displayed, done } = useTypingAnimation(
    "npx aether-db init",
    40,
    2800
  );
  const [mousePos, setMousePos] = React.useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const letters = "AETHER".split("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
      onMouseMove={handleMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsl(var(--aether-glow) / 0.08), transparent 50%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 sm:mb-12 inline-flex items-center gap-3 rounded-full border border-white/6 bg-white/3 px-5 py-2.5 backdrop-blur-sm"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[11px] font-medium text-white/40 tracking-widest uppercase">v0.1.0 — Public Beta</span>
      </motion.div>

      <div className="overflow-hidden">
        <motion.h1
          className="text-[clamp(4.5rem,17vw,16rem)] font-black leading-[0.82] tracking-[-0.05em] will-change-transform"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } },
          }}
        >
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              className="relative inline-block"
              style={{ perspective: "1000px" }}
              variants={{
                hidden: { y: "120%", rotateX: -60, opacity: 0 },
                visible: {
                  y: "0%",
                  rotateX: 0,
                  opacity: 1,
                  transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <span className="inline-block bg-linear-to-b from-white via-white/90 to-white/20 bg-clip-text text-transparent">
                {letter}
              </span>
            </motion.span>
          ))}
        </motion.h1>
      </div>

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-3 h-px max-w-md origin-center bg-linear-to-r from-transparent via-[hsl(var(--aether-glow)/0.5)] to-transparent"
      />

      <div className="overflow-hidden mt-6 sm:mt-8">
        <motion.p
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(1.1rem,2.8vw,2.25rem)] font-light tracking-tight"
        >
          <span className="text-white/30">The AI schema builder that </span>
          <span
            className="bg-size-[200%_100%] bg-clip-text text-transparent animate-text-shimmer"
            style={{
              backgroundImage: `linear-gradient(90deg, hsl(var(--aether-glow)), hsl(var(--aether-primary)), hsl(var(--aether-glow-intense)), hsl(var(--aether-glow)))`,
            }}
          >
            doesn&apos;t compromise
          </span>
        </motion.p>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 1.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 sm:mt-8 max-w-lg text-sm sm:text-base text-white/30 leading-relaxed tracking-wide mx-auto sm:mx-0"
      >
        PostgreSQL schemas. TypeScript types. ERD diagrams.
        <br className="hidden sm:block" />
        Generated instantly from your natural language prompt.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 1.5, duration: 0.9 }}
        className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:justify-start"
      >
        <MagneticWrap>
          <Link href="/builder">
            <Button variant="glow" size="xl" className="group relative overflow-hidden text-sm sm:text-base px-7 py-3.5">
              <span className="relative z-10 flex items-center gap-2.5">
                Start Building
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
          </Link>
        </MagneticWrap>

        <MagneticWrap>
          <Link href="https://github.com/aether-db/aether" target="_blank" rel="noopener">
            <Button variant="glass" size="xl" className="gap-2.5 text-sm sm:text-base px-7 py-3.5">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </Link>
        </MagneticWrap>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 35, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 1.8, duration: 1 }}
        className="mt-14 sm:mt-16 max-w-lg mx-auto sm:mx-0"
      >
        <div className="group relative overflow-hidden rounded-2xl border border-white/6 bg-white/2 backdrop-blur-md transition-all duration-500 hover:border-white/10 hover:shadow-[0_0_80px_-20px_hsl(var(--aether-glow)/0.08)]">
          <div className="flex items-center gap-1.5 border-b border-white/4 px-4 py-3">
            <div className="h-2.5 w-2.5 rounded-full bg-white/6" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/6" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/6" />
            <span className="ml-3 font-mono text-[10px] text-white/15 tracking-wider">zsh — 80×24</span>
          </div>
          <div className="px-5 py-4">
            <code className="font-mono text-sm">
              <span className="text-[hsl(var(--aether-glow)/0.5)]">~</span>{" "}
              <span className="text-white/25">$</span>{" "}
              <span className="text-white/60">{displayed}</span>
              {!done && (
                <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-white/50 animate-typing-cursor" />
              )}
            </code>
            {done && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5 }}
                className="mt-3 space-y-1 font-mono text-xs"
              >
                <div className="text-emerald-400/60">\u2713 Generated schema.prisma</div>
                <div className="text-emerald-400/60">\u2713 Generated types.ts</div>
                <div className="text-white/15">Ready to migrate database</div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-4xl text-center"
    >
      {badge && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-6 inline-flex items-center rounded-full border border-[hsl(var(--aether-glow)/0.2)] bg-[hsl(var(--aether-glow)/0.05)] px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-[hsl(var(--aether-glow))]"
        >
          {badge}
        </motion.span>
      )}
      <h2 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-tight leading-[0.95] text-[hsl(var(--aether-fg))]">
        {title}
      </h2>
      <p className="mt-6 text-lg text-[hsl(var(--aether-muted-fg))] leading-relaxed max-w-2xl mx-auto text-balance">
        {description}
      </p>
    </motion.div>
  );
}


export function WordReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.3"],
  });

  const words = text.split(" ");

  return (
    <div ref={ref} className={className}>
      <p className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-[0.1em]">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return <Word key={i} word={word} range={[start, end]} progress={scrollYProgress} />;
        })}
      </p>
    </div>
  );
}

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [5, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className="inline-block transition-colors duration-200"
    >
      {word}
    </motion.span>
  );
}


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
      className="fixed left-0 right-0 top-0 z-100 h-0.5 origin-left bg-linear-to-r from-[hsl(var(--aether-glow))] via-[hsl(var(--aether-primary))] to-[hsl(var(--aether-accent))]"
      style={{ scaleX }}
    />
  );
}


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
