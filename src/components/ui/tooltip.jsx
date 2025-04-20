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
  variant = "dark",
  size = "lg",
  dismissible = false,
  withArrow = true,
  arrowClassName,
  onDismiss,
  ...props
}, ref) => {
  const variants = {
    default: "bg-popover/95 backdrop-blur-sm border border-border/40 text-popover-foreground shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)]",
    dark: "bg-slate-900/95 backdrop-blur-sm border border-slate-800/80 text-slate-50 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)]",
    light: "bg-white/95 backdrop-blur-sm border border-slate-200/80 text-slate-900 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]",
    info: "bg-blue-50/95 backdrop-blur-sm border border-blue-200/80 text-blue-900 shadow-[0_4px_20px_-2px_rgba(59,130,246,0.1)]",
    success: "bg-green-50/95 backdrop-blur-sm border border-green-200/80 text-green-900 shadow-[0_4px_20px_-2px_rgba(34,197,94,0.1)]",
    warning: "bg-amber-50/95 backdrop-blur-sm border border-amber-200/80 text-amber-900 shadow-[0_4px_20px_-2px_rgba(245,158,11,0.1)]",
    destructive: "bg-red-50/95 backdrop-blur-sm border border-red-200/80 text-red-900 shadow-[0_4px_20px_-2px_rgba(239,68,68,0.1)]",
    glass: "bg-white/20 backdrop-blur-xl border border-white/30 text-foreground shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
    primary: "bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary-foreground shadow-[0_4px_20px_-2px_rgba(var(--primary),0.2)]",
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
        "z-50 overflow-hidden rounded-lg",
        "animate-in fade-in-50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[state=closed]:zoom-out-95 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade",
        "data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade",
        "data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade",
        "data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade",
        "select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <div className="relative">
        {props.children}
        {dismissible && (
          <button
            className="absolute top-1 right-1 h-4 w-4 rounded-full bg-muted/80 p-0 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            onClick={onDismiss}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
      {withArrow && (
        <TooltipPrimitive.Arrow
          className={cn(
            "fill-current drop-shadow-sm",
            variant === "dark" && "fill-slate-900/95",
            variant === "light" && "fill-white/95",
            variant === "glass" && "fill-white/30",
            variant === "primary" && "fill-primary/10",
            variant === "info" && "fill-blue-50/95",
            variant === "success" && "fill-green-50/95",
            variant === "warning" && "fill-amber-50/95",
            variant === "destructive" && "fill-red-50/95",
            arrowClassName
          )}
          width={12}
          height={7}
        />
      )}
    </TooltipPrimitive.Content>
  );
});

TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Add a new component for interactive tooltips
const InteractiveTooltip = React.forwardRef(({ children, content, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent
        {...props}
        dismissible={true}
        onDismiss={() => setOpen(false)}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
});

InteractiveTooltip.displayName = "InteractiveTooltip";

const TooltipPortal = TooltipPrimitive.Portal

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipPortal,
  InteractiveTooltip
}