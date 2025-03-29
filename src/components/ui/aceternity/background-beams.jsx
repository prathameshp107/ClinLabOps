"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({
  className,
  ...props
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const ref = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "h-full w-full bg-background flex items-center justify-center overflow-hidden rounded-md",
        className
      )}
      {...props}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
        style={{
          filter: "blur(40px)",
        }}
      >
        <defs>
          <radialGradient
            id="Gradient1"
            cx="50%"
            cy="50%"
            fx="10%"
            fy="50%"
            r="50%"
          >
            <animate
              attributeName="fx"
              values="0%;10%;0%"
              dur="20s"
              repeatCount="indefinite"
            />
            <stop offset="0%" stopColor="rgba(79, 70, 229, 0.3)" />
            <stop offset="100%" stopColor="rgba(79, 70, 229, 0)" />
          </radialGradient>
          <radialGradient
            id="Gradient2"
            cx="50%"
            cy="50%"
            fx="50%"
            fy="50%"
            r="50%"
          >
            <animate
              attributeName="fx"
              values="0%;30%;0%"
              dur="15s"
              repeatCount="indefinite"
            />
            <stop offset="0%" stopColor="rgba(124, 58, 237, 0.3)" />
            <stop offset="100%" stopColor="rgba(124, 58, 237, 0)" />
          </radialGradient>
          <radialGradient
            id="Gradient3"
            cx="50%"
            cy="50%"
            fx="50%"
            fy="50%"
            r="50%"
          >
            <animate
              attributeName="fx"
              values="50%;0%;50%"
              dur="25s"
              repeatCount="indefinite"
            />
            <stop offset="0%" stopColor="rgba(220, 38, 38, 0.2)" />
            <stop offset="100%" stopColor="rgba(220, 38, 38, 0)" />
          </radialGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#Gradient1)"
        />
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#Gradient2)"
        />
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#Gradient3)"
        />
      </svg>
      <div className="absolute inset-0 w-full h-full backdrop-blur-[100px]" />
      {props.children}
    </div>
  );
};