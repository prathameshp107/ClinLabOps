"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
  width = "w-full",
  height = "h-full",
}) => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden bg-background flex items-center justify-center",
        width,
        height,
        className
      )}
    >
      <div className="relative z-10 w-full">{children}</div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.8 },
          }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-foreground/20 opacity-0"
            style={{
              opacity: 0.2,
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.15), transparent 40%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};