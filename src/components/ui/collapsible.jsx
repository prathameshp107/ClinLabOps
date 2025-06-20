import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import * as React from "react";
import { cn } from "@/lib/utils";

const Collapsible = React.forwardRef(function Collapsible({ onOpenChange, ...props }, ref) {
  return <CollapsiblePrimitive.Root ref={ref} onOpenChange={onOpenChange} {...props} />;
});
Collapsible.displayName = "Collapsible";

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = React.forwardRef(function CollapsibleContent({ className, ...props }, ref) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      className={cn(
        "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden",
        className
      )}
      {...props}
    />
  );
});
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
