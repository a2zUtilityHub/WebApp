import React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-primary text-white hover:bg-brand-secondary",
        primary: "border-transparent bg-brand-primary text-white hover:bg-brand-secondary",
        secondary: "border-transparent bg-gray-200 text-gray-900 hover:bg-gray-300",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
        danger: "border-transparent bg-red-500 text-white hover:bg-red-600",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: "border-transparent bg-orange-500 text-white hover:bg-orange-600",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        outline: "text-gray-900 border-gray-300 hover:bg-gray-100",
        subtle: "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200",
        dot: "bg-transparent border-transparent text-gray-900 pl-1.5",
      },
      size: {
        xs: "px-2 py-0.5 text-[10px]",
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
)

function Badge({ className, variant, size, icon: Icon, dismissible, onDismiss, children, dotColor, ...props }) {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {variant === 'dot' && (
        <span className={cn("mr-1.5 h-2 w-2 rounded-full", dotColor || "bg-brand-primary")} />
      )}
      {Icon && variant !== 'dot' && <Icon className={cn("mr-1.5", size === 'xs' ? 'h-2 w-2' : size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />}
      {childrenArray}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-1.5 hover:bg-black/10 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          <X className={cn(size === 'xs' ? 'h-2 w-2' : size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
          <span className="sr-only">Dismiss</span>
        </button>
      )}
    </div>
  )
}

export { Badge, badgeVariants }