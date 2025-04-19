"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = ({ delayDuration = 300, skipDelayDuration = 300, ...props }) => (
  <TooltipPrimitive.Root
    delayDuration={delayDuration}
    skipDelayDuration={skipDelayDuration}
    {...props}
  />
)

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef(({
  className,
  sideOffset = 4,
  variant = "default",
  size = "default",
  dismissible = false, // Not supported for hover tooltips
  withArrow = false,
  arrowClassName,
  onDismiss, // Not used
  ...props
}, ref) => {
  const variants = {
    default: "bg-popover border border-border text-popover-foreground",
    dark: "bg-slate-900 border border-slate-800 text-slate-50",
    light: "bg-white border border-slate-200 text-slate-900",
    info: "bg-blue-50 border border-blue-200 text-blue-900",
    success: "bg-green-50 border border-green-200 text-green-900",
    warning: "bg-amber-50 border border-amber-200 text-amber-900",
    destructive: "bg-red-50 border border-red-200 text-red-900",
  };

  const sizes = {
    default: "px-3 py-1.5 text-sm",
    sm: "px-2 py-1 text-xs",
    lg: "px-4 py-2 text-base",
  };

  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md shadow-md",
        "animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {props.children}
      {withArrow && (
        <TooltipPrimitive.Arrow
          className={cn("fill-current", arrowClassName)}
          width={10}
          height={5}
        />
      )}
    </TooltipPrimitive.Content>
  );
});

TooltipContent.displayName = TooltipPrimitive.Content.displayName

const TooltipPortal = TooltipPrimitive.Portal

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipPortal
}