import * as React from "react";
import { cn } from "../../lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    variant?: "default" | "glass" | "glow";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: [
      "flex min-h-[80px] w-full rounded-[var(--aether-radius-md)]",
      "border border-[hsl(var(--aether-input))]",
      "bg-[hsl(var(--aether-bg))] px-3 py-2 text-sm",
      "text-[hsl(var(--aether-fg))]",
      "ring-offset-[hsl(var(--aether-bg))]",
      "placeholder:text-[hsl(var(--aether-muted-fg))]",
      "focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-[hsl(var(--aether-ring))] focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "transition-all duration-200 resize-none",
    ].join(" "),
    glass: [
      "flex min-h-[80px] w-full rounded-[var(--aether-radius-md)]",
      "border border-white/20 backdrop-blur-xl bg-white/5",
      "px-3 py-2 text-sm text-[hsl(var(--aether-fg))]",
      "placeholder:text-[hsl(var(--aether-muted-fg))]",
      "focus:border-white/40 focus:bg-white/10",
      "focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "transition-all duration-200 resize-none",
    ].join(" "),
    glow: [
      "flex min-h-[80px] w-full rounded-[var(--aether-radius-md)]",
      "border border-[hsl(var(--aether-glow))/0.3]",
      "bg-[hsl(var(--aether-bg))] px-3 py-2 text-sm",
      "text-[hsl(var(--aether-fg))]",
      "placeholder:text-[hsl(var(--aether-muted-fg))]",
      "focus:border-[hsl(var(--aether-glow))/0.6]",
      "focus:shadow-[0_0_20px_hsl(var(--aether-glow)/0.2)]",
      "focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "transition-all duration-200 resize-none",
    ].join(" "),
  };

  return (
    <textarea className={cn(variants[variant], className)} ref={ref} {...props} />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
