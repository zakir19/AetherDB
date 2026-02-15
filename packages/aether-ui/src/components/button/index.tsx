import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--aether-ring))] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "relative overflow-hidden",
    "after:absolute after:inset-0 after:opacity-0 after:transition-opacity",
    "hover:after:opacity-100",
    "after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-[hsl(var(--aether-primary))] text-[hsl(var(--aether-primary-fg))]",
          "shadow-lg shadow-[hsl(var(--aether-glow))/0.25]",
          "hover:shadow-xl hover:shadow-[hsl(var(--aether-glow))/0.4]",
          "hover:brightness-110",
        ].join(" "),
        destructive: [
          "bg-[hsl(var(--aether-destructive))] text-[hsl(var(--aether-destructive-fg))]",
          "shadow-lg shadow-[hsl(var(--aether-destructive))/0.25]",
          "hover:shadow-xl hover:shadow-[hsl(var(--aether-destructive))/0.4]",
        ].join(" "),
        outline: [
          "border border-[hsl(var(--aether-border))]",
          "bg-transparent text-[hsl(var(--aether-fg))]",
          "hover:bg-[hsl(var(--aether-accent))] hover:text-[hsl(var(--aether-accent-fg))]",
          "hover:border-[hsl(var(--aether-primary))]",
        ].join(" "),
        secondary: [
          "bg-[hsl(var(--aether-secondary))] text-[hsl(var(--aether-secondary-fg))]",
          "hover:bg-[hsl(var(--aether-secondary))]/80",
        ].join(" "),
        ghost: [
          "text-[hsl(var(--aether-fg))]",
          "hover:bg-[hsl(var(--aether-accent))] hover:text-[hsl(var(--aether-accent-fg))]",
        ].join(" "),
        link: [
          "text-[hsl(var(--aether-primary))] underline-offset-4",
          "hover:underline",
        ].join(" "),
        glow: [
          "bg-[hsl(var(--aether-primary))] text-[hsl(var(--aether-primary-fg))]",
          "shadow-[0_0_20px_hsl(var(--aether-glow)/0.5),0_0_60px_hsl(var(--aether-glow)/0.2)]",
          "hover:shadow-[0_0_30px_hsl(var(--aether-glow-intense)/0.6),0_0_80px_hsl(var(--aether-glow)/0.3)]",
          "border border-[hsl(var(--aether-glow))/0.3]",
        ].join(" "),
        glass: [
          "backdrop-blur-xl bg-white/10 text-[hsl(var(--aether-fg))]",
          "border border-white/20",
          "shadow-lg shadow-black/5",
          "hover:bg-white/15 hover:border-white/30",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2 rounded-[var(--aether-radius-md)]",
        sm: "h-8 px-3 text-xs rounded-[var(--aether-radius-sm)]",
        lg: "h-12 px-8 text-base rounded-[var(--aether-radius-lg)]",
        xl: "h-14 px-10 text-lg rounded-[var(--aether-radius-xl)]",
        icon: "h-10 w-10 rounded-[var(--aether-radius-md)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
