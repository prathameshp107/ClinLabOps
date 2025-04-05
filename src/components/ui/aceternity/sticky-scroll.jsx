"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
  children,
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const cardLength = content ? content.length : 0;
  const snapPoints = Array.from({ length: cardLength + 1 }, (_, i) => i / cardLength);
  const clampedScrollYProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const translateYProgress = useTransform(clampedScrollYProgress, snapPoints, snapPoints.map((_, i) => i * -100));

  const contentRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current || !contentRefs.current.length) return;
      
      const containerRect = ref.current.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      
      let newActiveCard = 0;
      let minDistance = Infinity;
      
      contentRefs.current.forEach((contentRef, index) => {
        if (!contentRef) return;
        
        const contentRect = contentRef.getBoundingClientRect();
        const contentCenter = contentRect.top + contentRect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const distance = Math.abs(contentCenter - viewportCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          newActiveCard = index;
        }
      });
      
      setActiveCard(newActiveCard);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      ref={ref}
      className="relative h-[80vh] overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full flex items-start">
        <div className="w-full sticky top-0 h-screen flex items-center justify-center">
          <div className="w-full max-w-6xl">
            {children}
          </div>
        </div>
      </div>
      
      <motion.div
        className="absolute top-0 left-0 w-full h-[500vh]"
        style={{ y: translateYProgress }}
      >
        {content?.map((item, i) => (
          <div
            ref={(el) => (contentRefs.current[i] = el)}
            key={i}
            className={cn(
              "h-screen flex items-center justify-center",
              contentClassName
            )}
          >
            <div
              className={cn(
                "bg-background/80 backdrop-blur-md rounded-lg p-8 w-full max-w-4xl mx-auto",
                activeCard === i ? "border border-primary/50" : "border border-border/50"
              )}
            >
              {item}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};