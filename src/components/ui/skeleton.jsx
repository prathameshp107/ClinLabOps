import * as React from "react";
import { cn } from "@/lib/utils";

const Skeleton = ({ className, variant = "rounded", ...props }) => {
  let variantClass = "rounded-md";
  if (variant === "circle") variantClass = "rounded-full";
  if (variant === "square") variantClass = "rounded-none";
  return (
    <div
      className={cn("animate-pulse bg-muted", variantClass, className)}
      {...props}
    />
  );
};

export { Skeleton };
