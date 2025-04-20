"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export const TracingBeam = ({
  children,
  className,
  containerClassName,
  beamClassName,
  beamColor = "rgba(var(--primary), 0.4)",
  beamOpacity = 0.4,
  beamWidth = 2,
}) => {
  const ref = useRef(null);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);
  const mouseY = useMotionValue(0);
  const mouseX = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const y = useSpring(mouseY, springConfig);
  const x = useSpring(mouseX, springConfig);

  useEffect(() => {
    if (!ref.current || !contentRef.current) return;

    const calculateHeight = () => {
      if (contentRef.current) {
        const { height } = contentRef.current.getBoundingClientRect();
        setHeight(height);
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);

    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  const handleMouseMove = (e) => {
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn("relative", containerClassName)}
    >
      <motion.div
        className={cn(
          "pointer-events-none absolute left-0 top-0 bottom-0 z-10",
          beamClassName
        )}
        style={{
          width: beamWidth,
          background: beamColor,
          opacity: beamOpacity,
          top: 0,
          bottom: 0,
          left: x,
          height: height,
        }}
      />

      <div ref={contentRef} className={cn("relative z-0", className)}>
        {children}
      </div>
    </motion.div>
  );
};

export const TracingBeamWithContent = ({
  children,
  className,
  containerClassName,
  beamClassName,
  beamColor = "rgba(var(--primary), 0.4)",
  beamOpacity = 0.4,
  beamWidth = 2,
}) => {
  return (
    <TracingBeam
      className={className}
      containerClassName={containerClassName}
      beamClassName={beamClassName}
      beamColor={beamColor}
      beamOpacity={beamOpacity}
      beamWidth={beamWidth}
    >
      {children}
    </TracingBeam>
  );
};