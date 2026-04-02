import React from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'apple-btn inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-150',
  {
    variants: {
      variant: {
        default: 'bg-brand-primary text-white hover:bg-brand-primary-dark active:bg-brand-primary-darker shadow-sm',
        primary: 'bg-brand-primary text-white hover:bg-brand-primary-dark active:bg-brand-primary-darker shadow-sm',
        secondary: 'border border-brand-secondary text-brand-secondary bg-transparent hover:bg-brand-secondary/10 active:bg-brand-secondary/20',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 hover:text-gray-900',
        ghost: 'text-brand-primary bg-transparent hover:bg-brand-primary/10 active:bg-brand-primary/20',
        link: 'text-brand-primary underline-offset-4 hover:underline hover:text-brand-primary-dark',
        destructive: 'bg-destructive text-white hover:bg-red-600 active:bg-red-700 shadow-sm',
      },
      size: {
        default: 'h-11 px-5 py-2 min-h-[44px] md:h-10 md:min-h-0',
        sm: 'h-10 px-4 min-h-[44px] md:h-9 md:min-h-0 text-xs',
        md: 'h-12 px-6 min-h-[48px] md:h-11 md:min-h-0',
        lg: 'h-14 px-8 min-h-[56px] md:h-12 md:min-h-0 text-base font-semibold',
        icon: 'h-11 w-11 min-h-[44px] md:h-10 md:w-10 md:min-h-0 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, isLoading, children, icon: Icon, ...props }, ref) => {
  const childrenArray = React.Children.toArray(children);
  const Comp = asChild ? Slot : "button";

  if (asChild) {
    const validElement = childrenArray.find(child => React.isValidElement(child));
    if (validElement) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }), isLoading && "opacity-70 pointer-events-none")}
          ref={ref}
          disabled={isLoading || props.disabled}
          {...props}
        >
          {React.cloneElement(validElement, {
            children: (
              <>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && Icon && <Icon className="mr-2 h-4 w-4" />}
                {validElement.props.children}
              </>
            )
          })}
        </Comp>
      );
    }
  }

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }), isLoading && "opacity-70 pointer-events-none")}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && Icon && <Icon className="mr-2 h-4 w-4" />}
      {childrenArray}
    </Comp>
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };