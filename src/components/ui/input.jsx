import React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle } from "lucide-react"

const Input = React.forwardRef(({ className, type, icon: Icon, error, success, helperText, label, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5 mb-4">
      {label && <label className="text-[14px] font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-3.5 h-[18px] w-[18px] text-gray-400" />}
        <input
          type={type}
          className={cn(
            "flex h-11 md:h-10 w-full rounded-xl border bg-white/80 px-3.5 py-2 text-[15px] transition-all duration-200 ease-out backdrop-blur-sm",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-gray-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
            Icon && "pl-10",
            error ? "border-destructive focus-visible:ring-destructive pr-10" : 
            success ? "border-success focus-visible:ring-success pr-10" : "border-gray-200 hover:border-gray-300",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props} 
        />
        {error && <AlertCircle className="absolute right-3.5 h-[18px] w-[18px] text-destructive pointer-events-none" />}
        {success && !error && <CheckCircle2 className="absolute right-3.5 h-[18px] w-[18px] text-success pointer-events-none" />}
      </div>
      {error && <span className="text-[13px] text-destructive animate-fade-in pl-1 font-medium">{error}</span>}
      {!error && helperText && <span className="text-[13px] text-gray-500 pl-1">{helperText}</span>}
    </div>
  );
})
Input.displayName = "Input"

export { Input }