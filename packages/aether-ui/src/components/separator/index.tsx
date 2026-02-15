import * as React from "react";
import { cn } from "../../lib/utils";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

const Separator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    variant?: "default" | "glow" | "gradient";
  }
>(({ className, orientation = "horizontal", decorative = true, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-[hsl(var(--aether-border))]",
    glow: "bg-[hsl(var(--aether-glow))] shadow-[0_0_8px_hsl(var(--aether-glow)/0.3)]",
    gradient: "bg-gradient-to-r from-transparent via-[hsl(var(--aether-border))] to-transparent",
  };

  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
