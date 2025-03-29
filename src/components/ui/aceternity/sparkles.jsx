"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const SparklesCore = ({
  id,
  className,
  background,
  minSize,
  maxSize,
  particleDensity,
  particleColor,
  particleOpacity,
  particleSpeed,
  ...props
}) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [particles, setParticles] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Initialize the canvas and context
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      setContext(ctx);
      handleResize();
      initParticles();
      animate();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle the canvas resize
  const handleResize = () => {
    if (canvasRef.current && canvasRef.current.parentElement) {
      const { width, height } = canvasRef.current.parentElement.getBoundingClientRect();
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      setWidth(width);
      setHeight(height);
    }
  };

  // Initialize the particles
  const initParticles = () => {
    const particleCount = Math.min(
      Math.max(Math.floor((width * height) / 10000) * (particleDensity || 1), 50),
      1000
    );
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * (maxSize || 3 - minSize || 1) + (minSize || 1);
      const opacity = Math.random() * (particleOpacity || 1);
      const speed = Math.random() * (particleSpeed || 0.5) + 0.1;

      newParticles.push({
        x,
        y,
        size,
        opacity,
        speed,
      });
    }

    setParticles(newParticles);
  };

  // Animation loop
  const animate = () => {
    if (context && width && height) {
      context.clearRect(0, 0, width, height);
      context.fillStyle = background || "rgba(0, 0, 0, 0)";
      context.fillRect(0, 0, width, height);

      particles.forEach((particle, i) => {
        // Update particle position
        particle.y -= particle.speed;

        // Reset particle when it goes off screen
        if (particle.y < -particle.size) {
          particle.y = height + particle.size;
          particle.x = Math.random() * width;
        }

        // Draw particle
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = `${particleColor || "#ffffff"}${Math.floor(
          particle.opacity * 255
        ).toString(16)}`;
        context.fill();
      });
    }

    requestAnimationFrame(animate);
  };

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn("absolute inset-0 w-full h-full", className)}
      style={{ background: "transparent" }}
      {...props}
    />
  );
};