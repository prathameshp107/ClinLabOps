import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import * as React from "react";
import { cn } from "@/lib/utils";

const AspectRatio = React.forwardRef(function AspectRatio({ className, ...props }, ref) {
  return (
    <AspectRatioPrimitive.Root
      ref={ref}
      className={cn("relative h-full w-full overflow-hidden", className)}
      {...props}
    />
  );
});
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
