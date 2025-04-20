"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const HoverEffect = ({
  items,
  className,
  cardClassName,
}) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);
  
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.title + idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-primary/10 dark:bg-primary/20 block rounded-lg"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className={cardClassName}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {item.icon && <span className="text-primary">{item.icon}</span>}
                <h3 className="font-medium text-base">{item.title}</h3>
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
              {item.content && item.content}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-muted/30 p-4 bg-background shadow-sm hover:shadow-md transition-all duration-200 h-full",
        className
      )}
    >
      {children}
    </div>
  );
};