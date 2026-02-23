"use client";

import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const useIsDark = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return true;
  return resolvedTheme !== "light";
};

export default function SignInPage() {
  const isDark = useIsDark();

  /* Set skip-intro flag so preloader won't replay after sign-in redirect */
  useEffect(() => {
    sessionStorage.setItem("aether-skip-intro", "1");
  }, []);
  return (
    <SignIn
      routing="hash"
      signUpUrl="/sign-up"
      forceRedirectUrl="/"
      appearance={{
        elements: {
          // Root card
          rootBox: "w-full max-w-md mx-auto",
          card: `rounded-2xl border backdrop-blur-xl transition-colors shadow-2xl ${isDark
            ? "border-white/[0.06] bg-white/[0.03] shadow-black/40"
            : "border-zinc-200 bg-white shadow-zinc-200/50"
            }`,
          // Header
          headerTitle: `text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"
            }`,
          headerSubtitle: `text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`,
          // Social buttons
          socialButtonsBlockButton: `rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${isDark
            ? "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
            : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
            }`,
          socialButtonsBlockButtonText: "font-medium",
          // Divider
          dividerLine: isDark ? "bg-white/[0.06]" : "bg-zinc-200",
          dividerText: `text-xs uppercase tracking-wider ${isDark ? "text-zinc-600" : "text-zinc-400"
            }`,
          // Form fields
          formFieldLabel: `text-sm font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`,
          formFieldInput: `h-11 rounded-xl border px-4 text-sm outline-none transition-all ${isDark
            ? "border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600 focus:border-zinc-500 focus:bg-white/[0.06]"
            : "border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
            }`,
          // Primary button
          formButtonPrimary: `h-11 rounded-xl text-sm font-semibold transition-all shadow-lg ${isDark
            ? "bg-white text-zinc-950 hover:bg-zinc-200 shadow-white/10"
            : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-900/20"
            }`,
          // Links
          footerActionLink: `font-medium transition-colors ${isDark ? "text-white hover:text-zinc-300" : "text-zinc-900 hover:text-zinc-600"
            }`,
          footerActionText: `text-sm ${isDark ? "text-zinc-500" : "text-zinc-500"}`,
          // Error
          formFieldErrorText: "text-red-400 text-xs",
          alert: `rounded-xl border px-4 py-3 text-sm ${isDark
            ? "border-red-500/20 bg-red-500/10 text-red-400"
            : "border-red-200 bg-red-50 text-red-600"
            }`,
          // Internal card wrapper
          formFieldRow: "space-y-2",
          internal: isDark ? "[color-scheme:dark]" : "",
        },
        layout: {
          socialButtonsPlacement: "top",
          showOptionalFields: false,
        },
      }}
    />
  );
}
