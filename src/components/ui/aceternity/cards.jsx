"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const HoverGlowCard = ({
  children,
  className,
  containerClassName,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative h-full bg-transparent group",
        containerClassName
      )}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-primary/0 opacity-0 blur-xl transition duration-500 group-hover:opacity-100",
          className
        )}
      />
      <div
        className={cn(
          "relative h-full rounded-xl transition duration-200 group-hover:shadow-xl",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

export const GlowingStarsBackgroundCard = ({
  className,
  children,
  containerClassName,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative h-full w-full bg-transparent",
        containerClassName
      )}
    >
      <div
        className={cn(
          "absolute inset-0 h-full w-full rounded-xl bg-background",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};