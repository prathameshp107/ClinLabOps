import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: {
    root: "h-4 w-8",
    thumb: "h-3 w-3 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
  },
  md: {
    root: "h-6 w-11",
    thumb: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
  },
  lg: {
    root: "h-8 w-16",
    thumb: "h-7 w-7 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0",
  },
};

const Switch = React.forwardRef(function Switch({ className, size = "md", ...props }, ref) {
  const { root, thumb } = sizeClasses[size] || sizeClasses.md;
  return (
    <SwitchPrimitives.Root
      className={cn(
        `peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input`,
        root,
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform",
          thumb
        )}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = "Switch";

export { Switch };
