import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "",
        subtle: "text-muted-foreground",
        error: "text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Label = React.forwardRef(function Label({ className, variant = "default", ...props }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants({ variant }), className)}
      {...props}
    />
  );
});
Label.displayName = "Label";

export { Label };
