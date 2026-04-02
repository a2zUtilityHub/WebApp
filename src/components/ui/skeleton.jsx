import React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, variant = "rectangle", lines = 1, pulse = false, ...props }) {
  const baseClasses = "relative overflow-hidden bg-gray-200"
  const animClass = pulse ? "animate-pulse" : "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent";
  
  const variants = {
    line: "h-4 w-full rounded-md",
    circle: "rounded-full h-12 w-12",
    rectangle: "rounded-[12px] w-full h-full",
    card: "rounded-[16px] h-48 w-full",
  }

  if (lines > 1 && variant === 'line') {
    return (
      <div className="space-y-3 w-full" aria-busy="true">
        {Array(lines).fill(0).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, animClass, variants[variant], i === lines - 1 ? "w-2/3" : "w-full", className)}
            {...props}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      aria-busy="true"
      className={cn(baseClasses, animClass, variants[variant], className)}
      {...props}
    />
  )
}

export { Skeleton }