"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@aether-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      <TooltipProvider delayDuration={100}>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
