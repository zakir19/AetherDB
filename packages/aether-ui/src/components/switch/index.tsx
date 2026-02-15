import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../lib/utils";

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
    variant?: "default" | "glow";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: [
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center",
      "rounded-full border-2 border-transparent transition-colors",
      "focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-[hsl(var(--aether-ring))] focus-visible:ring-offset-2",
      "focus-visible:ring-offset-[hsl(var(--aether-bg))]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-[hsl(var(--aether-primary))]",
      "data-[state=unchecked]:bg-[hsl(var(--aether-input))]",
    ].join(" "),
    glow: [
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center",
      "rounded-full border-2 border-transparent transition-all",
      "focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-[hsl(var(--aether-ring))] focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-[hsl(var(--aether-primary))]",
      "data-[state=checked]:shadow-[0_0_15px_hsl(var(--aether-glow)/0.4)]",
      "data-[state=unchecked]:bg-[hsl(var(--aether-input))]",
    ].join(" "),
  };

  return (
    <SwitchPrimitive.Root className={cn(variants[variant], className)} {...props} ref={ref}>
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0",
          "transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  );
});
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
