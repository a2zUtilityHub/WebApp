import React from 'react';
import { cn } from '@/lib/utils';

const Command = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className
    )}
    {...props}
  />
));
Command.displayName = 'Command';

const CommandDialog = ({ children, ...props }) => (
  <div {...props}>
    {children}
  </div>
);

const CommandInput = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
CommandInput.displayName = 'CommandInput';

const CommandList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
));
CommandList.displayName = 'CommandList';

const CommandEmpty = React.forwardRef((props, ref) => (
  <div ref={ref} className="py-6 text-center text-sm" {...props} />
));
CommandEmpty.displayName = 'CommandEmpty';

const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('overflow-hidden', className)} {...props} />
));
CommandGroup.displayName = 'CommandGroup';

const CommandItem = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  />
));
CommandItem.displayName = 'CommandItem';

const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 h-px bg-border', className)}
    {...props}
  />
));
CommandSeparator.displayName = 'CommandSeparator';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
};