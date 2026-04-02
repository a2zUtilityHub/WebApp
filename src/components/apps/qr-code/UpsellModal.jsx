import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';

const UpsellModal = ({ isOpen, onClose }) => {
  const handleUpgrade = () => {
    onClose();
    // Here you would redirect to your pricing/subscription page
    // e.g., navigate('/pricing');
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Crown className="h-10 w-10 text-primary" />
              </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl font-bold">You've Reached Your Limit!</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground">
            You have used all your free QR code generations for this period. Upgrade to a Pro plan for unlimited QR codes, advanced customization, and more!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose}>Maybe Later</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleUpgrade}>
              Upgrade to Pro
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpsellModal;