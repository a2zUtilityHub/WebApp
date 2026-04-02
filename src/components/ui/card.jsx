import React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "glass-card",
    elevated: "bg-white shadow-elevation-2 hover:shadow-elevation-3 rounded-2xl transition-all duration-250 border border-gray-100 hover:-translate-y-1",
    outlined: "bg-transparent border border-gray-200 hover:border-brand-primary/30 rounded-2xl transition-colors duration-200",
    ghost: "bg-transparent border-none shadow-none",
  };

  const childrenArray = React.Children.toArray(children);

  return (
    <div
      ref={ref}
      className={cn("text-gray-900 overflow-hidden relative z-0", variants[variant], className)}
      {...props} 
    >
      {childrenArray}
    </div>
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-5 md:p-6", className)} {...props}>
    {React.Children.toArray(children)}
  </div>
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-xl md:text-2xl font-bold leading-tight tracking-tight text-gray-900 group-hover:text-brand-primary transition-colors", className)} {...props}>
    {React.Children.toArray(children)}
  </h3>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn("text-[14px] text-gray-500 leading-relaxed", className)} {...props}>
    {React.Children.toArray(children)}
  </p>
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 md:p-6 pt-0", className)} {...props}>
    {React.Children.toArray(children)}
  </div>
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-5 md:p-6 pt-0 mt-auto", className)} {...props}>
    {React.Children.toArray(children)}
  </div>
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }