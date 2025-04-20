"use client";

import React, { useEffect, useState, useRef } from "react";
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
  particleOpacity,
  children,
}) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [particles, setParticles] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      setContext(ctx);

      const handleResize = () => {
        if (canvas.parentNode) {
          setWidth(canvas.parentNode.offsetWidth);
          setHeight(canvas.parentNode.offsetHeight);
          canvas.width = canvas.parentNode.offsetWidth;
          canvas.height = canvas.parentNode.offsetHeight;
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (width && height && context) {
      initParticles();
    }
  }, [width, height, context]);

  useEffect(() => {
    if (particles.length && context) {
      let animationFrameId;
      const render = () => {
        animationFrameId = window.requestAnimationFrame(render);
        context.clearRect(0, 0, width, height);
        particles.forEach((particle) => {
          particle.update();
          particle.draw(context);
        });
      };
      render();

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }
  }, [particles, context]);

  const initParticles = () => {
    const particleCount = Math.min(Math.max(Math.floor((width * height) / (particleDensity || 10000)), 30), 300);
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push(
        new Particle({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (maxSize || 3) + (minSize || 1),
          speed: speed || 0.5,
          color: particleColor || "#ffffff",
          opacity: particleOpacity || 0.8,
          width,
          height,
          mouse,
          isHovering,
        })
      );
    }

    setParticles(newParticles);
  };

  const handleMouseMove = (e) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      className={cn("relative h-full w-full", className)}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: background || "transparent" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

class Particle {
  constructor({ x, y, size, speed, color, opacity, width, height, mouse, isHovering }) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.baseSize = size;
    this.speed = speed;
    this.color = color;
    this.opacity = opacity;
    this.width = width;
    this.height = height;
    this.mouse = mouse;
    this.isHovering = isHovering;
    this.vx = (Math.random() - 0.5) * speed;
    this.vy = (Math.random() - 0.5) * speed;
    this.lastUpdate = Date.now();
  }

  update() {
    const now = Date.now();
    const delta = now - this.lastUpdate;
    this.lastUpdate = now;

    // Move particles
    this.x += this.vx * (delta / 16);
    this.y += this.vy * (delta / 16);

    // Bounce off edges
    if (this.x < 0 || this.x > this.width) {
      this.vx *= -1;
    }
    if (this.y < 0 || this.y > this.height) {
      this.vy *= -1;
    }

    // Interact with mouse
    const dx = this.x - this.mouse.x;
    const dy = this.y - this.mouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 100;

    if (distance < maxDistance && this.isHovering) {
      const force = (maxDistance - distance) / maxDistance;
      const angle = Math.atan2(dy, dx);
      this.vx += Math.cos(angle) * force * 0.2;
      this.vy += Math.sin(angle) * force * 0.2;
      this.size = this.baseSize * (1 + force * 0.5);
    } else {
      this.size = this.baseSize;
    }

    // Add some randomness to movement
    this.vx += (Math.random() - 0.5) * 0.01;
    this.vy += (Math.random() - 0.5) * 0.01;

    // Limit velocity
    const maxVel = this.speed * 1.5;
    const vel = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (vel > maxVel) {
      this.vx = (this.vx / vel) * maxVel;
      this.vy = (this.vy / vel) * maxVel;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}