import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const cardVariants = cva(
  [
    "rounded-[var(--aether-radius-lg)] border border-[hsl(var(--aether-border))]",
    "text-[hsl(var(--aether-card-fg))]",
    "transition-all duration-300",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--aether-card))] shadow-sm",
        elevated: [
          "bg-[hsl(var(--aether-card))]",
          "shadow-xl shadow-black/5",
          "hover:shadow-2xl hover:-translate-y-1",
        ].join(" "),
        glass: [
          "backdrop-blur-xl bg-white/5",
          "border-white/10",
          "shadow-xl shadow-black/10",
        ].join(" "),
        glow: [
          "bg-[hsl(var(--aether-card))]",
          "border-[hsl(var(--aether-glow))/0.2]",
          "shadow-[0_0_30px_hsl(var(--aether-glow)/0.1)]",
          "hover:shadow-[0_0_50px_hsl(var(--aether-glow)/0.2)]",
          "hover:border-[hsl(var(--aether-glow))/0.4]",
        ].join(" "),
        interactive: [
          "bg-[hsl(var(--aether-card))]",
          "shadow-lg hover:shadow-2xl",
          "hover:-translate-y-2 hover:border-[hsl(var(--aether-primary))/0.3]",
          "cursor-pointer",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-[hsl(var(--aether-muted-fg))]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
