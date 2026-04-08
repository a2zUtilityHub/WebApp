import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminLoading = ({ message = "Loading data...", className }) => {
  return (
    <div className={cn("min-h-[400px] h-full w-full flex flex-col items-center justify-center p-8 space-y-6 animate-in fade-in duration-500", className)}>
      <div className="relative flex items-center justify-center">
        {/* Outer ambient glow */}
        <div className="absolute inset-0 rounded-full blur-xl bg-primary/20 animate-pulse" />
        
        {/* Inner structural spinner */}
        <div className="relative flex items-center justify-center w-14 h-14 bg-card border border-border shadow-sm rounded-2xl">
          <Loader2 className="h-7 w-7 text-primary animate-spin" strokeWidth={2.5} />
        </div>
      </div>
      
      <div className="space-y-1 text-center">
        <p className="text-sm font-semibold tracking-tight text-foreground animate-pulse">
          {message}
        </p>
        <p className="text-xs text-muted-foreground">
          Please wait while we prepare your workspace.
        </p>
      </div>
    </div>
  );
};

export default AdminLoading;