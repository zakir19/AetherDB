"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@aether-ui/react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

/**
 * Check at build/runtime whether Clerk has real keys.
 * With placeholder keys the ClerkProvider would fail to initialise
 * and break the entire React tree.
 */
const isClerkConfigured =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("CHANGE_ME");

function ClerkThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  if (!isClerkConfigured) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkThemeWrapper>
        <TooltipProvider delayDuration={100}>
          {children}
        </TooltipProvider>
      </ClerkThemeWrapper>
    </ThemeProvider>
  );
}
