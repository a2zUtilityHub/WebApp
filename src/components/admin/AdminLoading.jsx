import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminLoading = ({ message = "Loading...", className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] w-full", className)}>
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground font-medium animate-pulse">{message}</p>
    </div>
  );
};

export default AdminLoading;