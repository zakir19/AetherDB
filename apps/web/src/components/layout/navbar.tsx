"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@aether-ui/react";

const navItems = [
  { label: "Components", href: "/components" },
  { label: "Themes", href: "/themes" },
  { label: "Docs", href: "/docs" },
  { label: "Showroom", href: "/showroom" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-white/5 bg-[hsl(var(--aether-bg))]/80 backdrop-blur-2xl"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 60, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="h-8 w-8 rotate-45 rounded-lg bg-gradient-to-tr from-[hsl(var(--aether-primary))] to-[hsl(var(--aether-glow))]" />
              <div className="absolute inset-0 h-8 w-8 rotate-45 rounded-lg bg-gradient-to-tr from-[hsl(var(--aether-primary))] to-[hsl(var(--aether-glow))] opacity-50 blur-lg" />
            </motion.div>
            <span className="text-lg font-bold text-[hsl(var(--aether-fg))]">
              Aether<span className="text-[hsl(var(--aether-muted-fg))]"> UI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium",
                  "text-[hsl(var(--aether-muted-fg))]",
                  "transition-colors hover:text-[hsl(var(--aether-fg))]",
                  "hover:bg-[hsl(var(--aether-accent))]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => {
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true })
                );
              }}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[hsl(var(--aether-muted-fg))] transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span>Search</span>
              <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[10px]">⌘K</kbd>
            </button>
            <Link
              href="https://github.com/aether-ui/aether"
              target="_blank"
              rel="noopener"
              className="text-[hsl(var(--aether-muted-fg))] transition-colors hover:text-[hsl(var(--aether-fg))]"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>
            <Button variant="glow" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
            aria-label="Toggle menu"
          >
            <div className="relative h-5 w-5">
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="absolute left-0 top-0 h-0.5 w-5 bg-[hsl(var(--aether-fg))]"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="absolute left-0 top-2 h-0.5 w-5 bg-[hsl(var(--aether-fg))]"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -2 } : { rotate: 0, y: 0 }}
                className="absolute left-0 top-4 h-0.5 w-5 bg-[hsl(var(--aether-fg))]"
              />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[hsl(var(--aether-bg))]/95 backdrop-blur-2xl pt-20 md:hidden"
          >
            <nav className="flex flex-col items-center gap-4 p-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-semibold text-[hsl(var(--aether-fg))]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button variant="glow" size="lg" className="mt-4">
                  Get Started
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
