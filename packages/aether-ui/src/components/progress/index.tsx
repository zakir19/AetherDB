import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/utils";

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: "default" | "glow" | "gradient";
  }
>(({ className, value, variant = "default", ...props }, ref) => {
  const indicatorStyles = {
    default: "bg-[hsl(var(--aether-primary))]",
    glow: [
      "bg-[hsl(var(--aether-primary))]",
      "shadow-[0_0_15px_hsl(var(--aether-glow)/0.5)]",
    ].join(" "),
    gradient: "bg-gradient-to-r from-[hsl(var(--aether-primary))] via-[hsl(var(--aether-accent))] to-[hsl(var(--aether-glow))]",
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-[hsl(var(--aether-secondary))]",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-500 ease-out",
          indicatorStyles[variant]
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
