import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const SuccessAnimation = ({ message = "Success!", onDismiss, duration = 3000, className }) => {
  useEffect(() => {
    if (onDismiss && duration > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [onDismiss, duration]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn("flex flex-col items-center justify-center p-6 bg-card rounded-lg shadow-sm border border-success/20", className)}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1 
        }}
      >
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      </motion.div>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-medium text-foreground text-center"
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default SuccessAnimation;