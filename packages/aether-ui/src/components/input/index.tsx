import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "glass" | "glow" | "underline";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const variants = {
      default: [
        "flex h-10 w-full rounded-[var(--aether-radius-md)]",
        "border border-[hsl(var(--aether-input))]",
        "bg-[hsl(var(--aether-bg))] px-3 py-2 text-sm",
        "text-[hsl(var(--aether-fg))]",
        "ring-offset-[hsl(var(--aether-bg))]",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "file:text-[hsl(var(--aether-fg))]",
        "placeholder:text-[hsl(var(--aether-muted-fg))]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[hsl(var(--aether-ring))] focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200",
      ].join(" "),
      glass: [
        "flex h-10 w-full rounded-[var(--aether-radius-md)]",
        "border border-white/20 backdrop-blur-xl bg-white/5",
        "px-3 py-2 text-sm text-[hsl(var(--aether-fg))]",
        "placeholder:text-[hsl(var(--aether-muted-fg))]",
        "focus:border-white/40 focus:bg-white/10",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[hsl(var(--aether-ring))]/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200",
      ].join(" "),
      glow: [
        "flex h-10 w-full rounded-[var(--aether-radius-md)]",
        "border border-[hsl(var(--aether-glow))/0.3]",
        "bg-[hsl(var(--aether-bg))] px-3 py-2 text-sm",
        "text-[hsl(var(--aether-fg))]",
        "placeholder:text-[hsl(var(--aether-muted-fg))]",
        "focus:border-[hsl(var(--aether-glow))/0.6]",
        "focus:shadow-[0_0_20px_hsl(var(--aether-glow)/0.2)]",
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200",
      ].join(" "),
      underline: [
        "flex h-10 w-full border-b-2 border-[hsl(var(--aether-border))]",
        "bg-transparent px-1 py-2 text-sm",
        "text-[hsl(var(--aether-fg))]",
        "placeholder:text-[hsl(var(--aether-muted-fg))]",
        "focus:border-[hsl(var(--aether-primary))]",
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200",
      ].join(" "),
    };

    return (
      <input
        type={type}
        className={cn(variants[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
