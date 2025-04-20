"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({ 
  content, 
  contentClassName,
  stickyClassName,
  revealClassName,
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const numItems = content.length;
  const cardHeight = 100 / numItems;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { top, height } = containerRef.current.getBoundingClientRect();
      const scrollPosition = window.scrollY - top;
      const sectionHeight = height / numItems;
      
      const activeIndex = Math.min(
        Math.max(Math.floor(scrollPosition / sectionHeight), 0),
        numItems - 1
      );
      
      setActiveCard(activeIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [numItems]);

  return (
    <motion.div
      ref={ref}
      className="relative h-[300vh]"
    >
      <div
        ref={containerRef}
        className="sticky top-0 flex h-screen items-center overflow-hidden"
      >
        <div className="flex w-full">
          <div className={cn("w-full md:w-1/2 px-4", stickyClassName)}>
            {content.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center transition-opacity duration-500",
                  activeCard === index ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                <div className={cn("max-w-lg", contentClassName)}>
                  {item.title && (
                    <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
                  )}
                  {item.description && (
                    <p className="text-muted-foreground">{item.description}</p>
                  )}
                  {item.content}
                </div>
              </div>
            ))}
          </div>
          <div className={cn("hidden md:flex md:w-1/2 items-center justify-center", revealClassName)}>
            {content.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center transition-opacity duration-500",
                  activeCard === index ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                {item.image}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2">
          {content.map((_, index) => (
            <div
              key={index}
              onClick={() => {
                const sectionHeight = containerRef.current.getBoundingClientRect().height / numItems;
                const scrollPosition = containerRef.current.getBoundingClientRect().top + window.scrollY + sectionHeight * index;
                window.scrollTo({
                  top: scrollPosition,
                  behavior: "smooth",
                });
              }}
              className={cn(
                "h-2 w-2 rounded-full cursor-pointer transition-colors",
                activeCard === index ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};