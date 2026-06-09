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

  useEffect(() => {
    sessionStorage.setItem("aether-skip-intro", "1");
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header above Clerk card */}
      <div className="mb-1">
        <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
          Welcome back
        </h1>
        <p className={`mt-1 text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          Sign in to your Aether DB account to continue.
        </p>
      </div>

      <SignIn
        routing="hash"
        signUpUrl="/sign-up"
        forceRedirectUrl="/"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: `w-full rounded-2xl border shadow-2xl ${isDark
                ? "border-white/[0.07] bg-white/[0.03] shadow-black/60 backdrop-blur-xl"
                : "border-zinc-200/60 bg-white shadow-zinc-200/40"
              }`,
            // Header hidden — we render our own above
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            header: "hidden",

            // Social buttons
            socialButtonsBlockButton: `flex h-10 w-full items-center justify-center gap-2.5 rounded-xl border px-4 text-sm font-medium transition-all ${isDark
                ? "border-white/10 bg-white/[0.05] text-zinc-200 hover:bg-white/[0.09] hover:border-white/20"
                : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300"
              }`,
            socialButtonsBlockButtonText: "font-medium text-[13px]",
            socialButtonsIconButton: "hidden",

            // Divider
            dividerLine: isDark ? "bg-white/[0.07]" : "bg-zinc-200",
            dividerText: `text-[11px] uppercase tracking-widest font-medium ${isDark ? "text-zinc-600" : "text-zinc-400"}`,

            // Form fields
            formFieldLabel: `block text-[13px] font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`,
            formFieldInput: `h-10 w-full rounded-xl border px-3.5 text-sm outline-none ring-0 transition-all ${isDark
                ? "border-white/[0.09] bg-white/[0.04] text-white placeholder:text-zinc-600 focus:border-purple-500/60 focus:bg-white/[0.07] focus:ring-1 focus:ring-purple-500/20"
                : "border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:border-purple-400 focus:bg-white focus:ring-1 focus:ring-purple-400/30"
              }`,
            formFieldHintText: `text-[11px] mt-1 ${isDark ? "text-zinc-600" : "text-zinc-400"}`,
            formFieldErrorText: `text-[11px] mt-1 font-medium ${isDark ? "text-red-400" : "text-red-500"}`,
            formFieldWarningText: `text-[11px] mt-1 ${isDark ? "text-amber-400" : "text-amber-600"}`,
            formFieldSuccessText: `text-[11px] mt-1 ${isDark ? "text-emerald-400" : "text-emerald-600"}`,

            // Checkbox
            formFieldCheckboxInput: "rounded border-white/10 bg-white/5 accent-purple-500",
            formFieldCheckboxLabel: `text-[12px] ${isDark ? "text-zinc-400" : "text-zinc-600"}`,

            // Primary button — purple accent matching left panel
            formButtonPrimary: `h-10 w-full rounded-xl text-sm font-semibold transition-all ${isDark
                ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 shadow-lg shadow-purple-900/40"
                : "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 shadow-lg shadow-purple-600/25"
              }`,
            formButtonReset: `text-[12px] transition-colors ${isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-700"}`,

            // Footer
            footerActionText: `text-[13px] ${isDark ? "text-zinc-500" : "text-zinc-500"}`,
            footerActionLink: `text-[13px] font-semibold transition-colors ${isDark ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-500"}`,
            footer: `mt-1 border-t ${isDark ? "border-white/[0.06]" : "border-zinc-100"}`,

            // Links
            identityPreviewEditButton: `text-[12px] ${isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-700"}`,
            formResendCodeLink: `text-[13px] font-medium transition-colors ${isDark ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-500"}`,

            // Alert
            alert: `rounded-xl border px-4 py-3 text-[13px] ${isDark
                ? "border-red-500/20 bg-red-500/10 text-red-400"
                : "border-red-200 bg-red-50 text-red-600"
              }`,
            alertText: "text-[13px]",

            // OTP / verification
            otpCodeFieldInput: `h-11 w-11 rounded-xl border text-center text-base font-bold outline-none transition-all ${isDark
                ? "border-white/10 bg-white/5 text-white focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20"
                : "border-zinc-200 bg-zinc-50 text-zinc-900 focus:border-purple-400"
              }`,

            // Back link
            backLink: `text-[12px] transition-colors ${isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"}`,

            // Internal color scheme
            internal: isDark ? "[color-scheme:dark]" : "",
          },
          layout: {
            socialButtonsPlacement: "top",
            showOptionalFields: false,
          },
        }}
      />
    </div>
  );
}
