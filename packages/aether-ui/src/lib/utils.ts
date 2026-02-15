import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createContext<T>(name: string) {
  const Context = React.createContext<T | undefined>(undefined);
  function useContext() {
    const ctx = React.useContext(Context);
    if (!ctx) throw new Error(`use${name} must be used within <${name}Provider>`);
    return ctx;
  }
  return [Context.Provider, useContext] as const;
}

import React from "react";
