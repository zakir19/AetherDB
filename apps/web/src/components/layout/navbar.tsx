"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@aether-ui/react";

const navItems: { label: string; href: string }[] = [];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "py-2 sm:py-3"
            : "py-4 sm:py-6"
        )}
      >
        <div
          className={cn(
            "mx-auto flex items-center justify-between transition-all duration-500 rounded-2xl px-5 sm:px-6",
            scrolled
              ? "max-w-4xl h-14 border border-white/6 bg-[hsl(var(--aether-bg)/0.7)] backdrop-blur-2xl shadow-[0_8px_40px_-12px_hsl(var(--aether-bg)/0.5)]"
              : "max-w-7xl h-16 lg:h-20 bg-transparent"
          )}
        >
          <Link href="/" className="group flex items-center gap-2.5 shrink-0">
            <motion.div
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="relative text-[hsl(var(--aether-primary))]"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7l9 5 9-5-9-5z" />
                <path d="M3 17l9 5 9-5" />
                <path d="M3 12l9 5 9-5" />
              </svg>
            </motion.div>
            <span className={cn(
              "font-bold tracking-tight text-[hsl(var(--aether-fg))] transition-all duration-500",
              scrolled ? "text-sm" : "text-base"
            )}>
              Aether
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-[hsl(var(--aether-muted-fg))] transition-colors duration-200 hover:text-[hsl(var(--aether-fg))]"
              >
                {item.label}
                <span className="absolute bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-[hsl(var(--aether-glow))] transition-all duration-300 group-hover:w-3/4" />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 md:flex">
            <Link
              href="https://github.com/aether-ui/aether"
              target="_blank"
              rel="noopener"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[hsl(var(--aether-muted-fg))] transition-colors duration-200 hover:text-[hsl(var(--aether-fg))]"
            >
              <svg className="h-4.25 w-4.25" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>

            <Link href="/builder">
              <Button variant="glow" size="sm" className="text-xs font-medium h-8 px-4 rounded-lg">
                Build with AI
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
            aria-label="Toggle menu"
          >
            <div className="relative h-4 w-5">
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="absolute left-0 top-0 h-[1.5px] w-5 bg-[hsl(var(--aether-fg))]"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                className="absolute left-0 top-1.5 h-[1.5px] w-5 bg-[hsl(var(--aether-fg))]"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="absolute left-0 top-3 h-[1.5px] w-5 bg-[hsl(var(--aether-fg))]"
                transition={{ duration: 0.2 }}
              />
            </div>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[hsl(var(--aether-bg)/0.98)] backdrop-blur-xl pt-28 md:hidden"
          >
            <nav className="flex flex-col items-center gap-8 p-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-3xl font-bold tracking-tight text-[hsl(var(--aether-fg))]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <Button variant="glow" size="lg" className="mt-4">
                    Build with AI
                  </Button>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
