"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const BentoGrid = ({ 
  className,
  children,
  ...props
}) => {
  return (
    <div 
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-neutral-200 flex flex-col space-y-2",
        className
      )}
      {...props}
    >
      {header && <div className="flex justify-center items-center">{header}</div>}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon && <div className="mb-2">{icon}</div>}
        {title && <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 tracking-tight">{title}</h3>}
        {description && <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>}
      </div>
      {children}
    </div>
  );
};