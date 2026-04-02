import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useOptimisticUpdate = (updateFn, onSuccess, onError) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const performUpdate = useCallback(async (currentData, updatedData, optimisticData) => {
    setIsUpdating(true);
    
    // Optimistic UI callback usually managed by the component state before calling this
    try {
      const result = await updateFn(updatedData);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Optimistic update failed, rolling back:', error);
      
      toast({
        title: "Action failed",
        description: error.message || "Something went wrong. Changes have been reverted.",
        variant: "destructive"
      });
      
      if (onError) {
        onError(error, currentData); // Pass currentData for rollback
      }
      
      return { success: false, error };
    } finally {
      setIsUpdating(false);
    }
  }, [updateFn, onSuccess, onError, toast]);

  return { performUpdate, isUpdating };
};