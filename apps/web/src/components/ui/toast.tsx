"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
type ToastVariant = "default" | "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  toast: (message: string, opts?: { variant?: ToastVariant; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

const icons: Record<ToastVariant, ReactNode> = {
  default: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  info: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
};

const variantStyles: Record<ToastVariant, { container: string; icon: string }> = {
  default: {
    container: "border-white/10 bg-zinc-900/95 text-white shadow-zinc-950/50 dark:border-white/[0.08] dark:bg-zinc-900/95",
    icon: "text-zinc-400",
  },
  success: {
    container: "border-emerald-500/20 bg-zinc-900/95 text-white shadow-emerald-950/30 dark:border-emerald-500/15",
    icon: "text-emerald-400",
  },
  error: {
    container: "border-red-500/20 bg-zinc-900/95 text-white shadow-red-950/30 dark:border-red-500/15",
    icon: "text-red-400",
  },
  info: {
    container: "border-sky-500/20 bg-zinc-900/95 text-white shadow-sky-950/30 dark:border-sky-500/15",
    icon: "text-sky-400",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
      timeoutsRef.current = {};
    };
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }
  }, []);

  const addToast = useCallback((message: string, opts?: { variant?: ToastVariant; duration?: number }) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const variant = opts?.variant ?? "default";
    const duration = opts?.duration ?? 3000;

    setToasts((prev) => [...prev, { id, message, variant, duration }]);

    timeoutsRef.current[id] = setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      <div className="fixed bottom-6 right-6 `z-[9999]` flex flex-col-reverse gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const styles = variantStyles[t.variant];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 80, scale: 0.95, filter: "blur(4px)" }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className={cn(
                  "pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-xl",
                  styles.container
                )}
              >
                <span className={cn("flex-none", styles.icon)}>
                  {icons[t.variant]}
                </span>
                <span className="text-sm font-medium">{t.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
