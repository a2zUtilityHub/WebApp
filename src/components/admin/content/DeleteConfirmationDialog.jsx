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
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from 'lucide-react';

const DeleteConfirmationDialog = ({ open, onOpenChange, onConfirm, itemName, loading }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md border-destructive/20">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-destructive mb-2">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-xl">Delete Content?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            Are you sure you want to delete <span className="font-semibold text-foreground">"{itemName}"</span>?
            <br /><br />
            This action cannot be undone. This will permanently remove the item from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;