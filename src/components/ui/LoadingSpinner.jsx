import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const LoadingSpinner = ({ size = 'md', className, text }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader2 className={cn("text-primary", sizeClasses[size])} />
      </motion.div>
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;