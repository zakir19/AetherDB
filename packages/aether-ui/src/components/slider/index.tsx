import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    variant?: "default" | "glow";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const isGlow = variant === "glow";

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          "relative h-2 w-full grow overflow-hidden rounded-full",
          "bg-[hsl(var(--aether-secondary))]"
        )}
      >
        <SliderPrimitive.Range
          className={cn(
            "absolute h-full bg-[hsl(var(--aether-primary))]",
            isGlow && "shadow-[0_0_10px_hsl(var(--aether-glow)/0.5)]"
          )}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block h-5 w-5 rounded-full border-2",
          "border-[hsl(var(--aether-primary))] bg-[hsl(var(--aether-bg))]",
          "ring-offset-[hsl(var(--aether-bg))] transition-colors",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[hsl(var(--aether-ring))] focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "cursor-grab active:cursor-grabbing",
          isGlow && "shadow-[0_0_12px_hsl(var(--aether-glow)/0.5)]"
        )}
      />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
