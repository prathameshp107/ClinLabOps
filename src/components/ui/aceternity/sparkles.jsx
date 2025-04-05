"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const SparklesCore = ({
  id,
  background,
  minSize,
  maxSize,
  speed,
  particleColor,
  className,
  particleDensity,
}) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [particles, setParticles] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const resizeCanvas = () => {
    if (canvasRef.current && context) {
      canvasRef.current.width = canvasRef.current.clientWidth;
      canvasRef.current.height = canvasRef.current.clientHeight;
      setWidth(canvasRef.current.width);
      setHeight(canvasRef.current.height);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      setContext(ctx);
    }

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    resizeCanvas();
  }, [context]);

  useEffect(() => {
    if (width && height) {
      setParticles(
        Array.from({ length: particleDensity || 50 }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (maxSize - minSize) + minSize || Math.random() * 2 + 1,
          speed: speed || 0.5,
          directionX: Math.random() - 0.5,
          directionY: Math.random() - 0.5,
        }))
      );
    }
  }, [width, height, minSize, maxSize, speed, particleDensity]);

  useEffect(() => {
    if (!context || !width || !height) return;

    let animationFrameId;
    const renderCanvas = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = background || "black";
      context.fillRect(0, 0, width, height);

      particles.forEach((particle, i) => {
        const { x, y, size, directionX, directionY, speed } = particle;

        // Draw particle
        context.beginPath();
        context.arc(x, y, size, 0, 2 * Math.PI);
        context.fillStyle = particleColor || "#ffffff";
        context.fill();

        // Update particle position
        particles[i].x += directionX * speed;
        particles[i].y += directionY * speed;

        // Boundary check
        if (x < 0 || x > width) particles[i].directionX *= -1;
        if (y < 0 || y > height) particles[i].directionY *= -1;

        // Mouse interaction
        if (isHovering) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 100;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const angle = Math.atan2(dy, dx);
            particles[i].x -= Math.cos(angle) * force * speed;
            particles[i].y -= Math.sin(angle) * force * speed;
          }
        }
      });

      animationFrameId = window.requestAnimationFrame(renderCanvas);
    };

    renderCanvas();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [context, width, height, particles, isHovering, mouse, background, particleColor]);

  return (
    <canvas
      id={id}
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("w-full h-full", className)}
    />
  );
};