import React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle } from "lucide-react"

const Input = React.forwardRef(({ className, type, icon: Icon, error, success, helperText, label, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5 mb-4 group">
      {label && <label className="text-[14px] font-medium text-foreground/90 mb-1 group-focus-within:text-primary transition-colors">{label}</label>}
      <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-3.5 h-[18px] w-[18px] text-muted-foreground group-focus-within:text-primary transition-colors" />}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border border-input bg-background/60 px-3.5 py-2 text-[15px] text-foreground transition-all duration-300 ease-out backdrop-blur-sm shadow-sm",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground/60",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary hover:border-primary/50",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
            Icon && "pl-10",
            error ? "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive pr-10" : 
            success ? "border-success focus-visible:ring-success/20 focus-visible:border-success pr-10" : "",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props} 
        />
        {error && <AlertCircle className="absolute right-3.5 h-[18px] w-[18px] text-destructive pointer-events-none" />}
        {success && !error && <CheckCircle2 className="absolute right-3.5 h-[18px] w-[18px] text-success pointer-events-none" />}
      </div>
      {error && <span className="text-[13px] text-destructive animate-in fade-in slide-in-from-top-1 pl-1 font-medium">{error}</span>}
      {!error && helperText && <span className="text-[13px] text-muted-foreground pl-1">{helperText}</span>}
    </div>
  );
})
Input.displayName = "Input"

export { Input }