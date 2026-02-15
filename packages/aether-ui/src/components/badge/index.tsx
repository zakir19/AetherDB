import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center rounded-[var(--aether-radius-full)]",
    "border px-2.5 py-0.5 text-xs font-semibold",
    "transition-all duration-200 focus:outline-none focus:ring-2",
    "focus:ring-[hsl(var(--aether-ring))] focus:ring-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-transparent bg-[hsl(var(--aether-primary))]",
          "text-[hsl(var(--aether-primary-fg))]",
          "hover:bg-[hsl(var(--aether-primary))]/80",
        ].join(" "),
        secondary: [
          "border-transparent bg-[hsl(var(--aether-secondary))]",
          "text-[hsl(var(--aether-secondary-fg))]",
          "hover:bg-[hsl(var(--aether-secondary))]/80",
        ].join(" "),
        destructive: [
          "border-transparent bg-[hsl(var(--aether-destructive))]",
          "text-[hsl(var(--aether-destructive-fg))]",
          "hover:bg-[hsl(var(--aether-destructive))]/80",
        ].join(" "),
        outline: "text-[hsl(var(--aether-fg))] border-[hsl(var(--aether-border))]",
        glow: [
          "border-[hsl(var(--aether-glow))/0.4] bg-[hsl(var(--aether-glow))/0.1]",
          "text-[hsl(var(--aether-glow))]",
          "shadow-[0_0_10px_hsl(var(--aether-glow)/0.2)]",
        ].join(" "),
        glass: [
          "border-white/20 backdrop-blur-xl bg-white/10",
          "text-[hsl(var(--aether-fg))]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
