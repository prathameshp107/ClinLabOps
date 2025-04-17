"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const HoverBorderGradient = ({
  children,
  containerClassName,
  className,
  as: Component = "div",
  ...props
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Component
      className={cn(
        "relative rounded-lg p-[1px] overflow-hidden",
        containerClassName
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-gradient-to-r from-primary to-primary-foreground opacity-70"
        style={{ filter: "blur(8px)" }}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </Component>
  );
};