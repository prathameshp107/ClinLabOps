import React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from "@/lib/utils"

const Separator = React.forwardRef(function Separator(
  { className, orientation = "horizontal", decorative = true, thickness = 1, ...props },
  ref
) {
  const thicknessClass = orientation === "horizontal"
    ? `h-[${thickness}px] w-full`
    : `h-full w-[${thickness}px]`;
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        thicknessClass,
        className
      )}
      {...props}
    />
  );
});
Separator.displayName = SeparatorPrimitive.Root.displayName
export { Separator }