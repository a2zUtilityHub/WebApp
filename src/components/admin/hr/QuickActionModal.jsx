import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const QuickActionModal = ({ title, children, isOpen, onClose, size = "max-w-2xl", className }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(size, "max-h-[90vh] overflow-y-auto", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickActionModal;