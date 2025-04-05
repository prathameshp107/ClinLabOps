"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

export const ThreeDCard = ({
  children,
  className,
  containerClassName,
  cardClassName,
  glareClassName,
  rotateClassName = "rotate-0",
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    setRotate({ x: -y, y: x });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className={cn("relative group/card", containerClassName)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      <div
        className={cn(
          "relative h-full w-full transition-all duration-200 ease-linear",
          isHovered && "z-10",
          cardClassName
        )}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${rotateClassName}`
            : `perspective(1000px) rotateX(0deg) rotateY(0deg) ${rotateClassName}`,
        }}
      >
        {children}
      </div>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100",
          glareClassName
        )}
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      />
    </div>
  );
};