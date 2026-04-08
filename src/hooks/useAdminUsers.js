import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import { executeQuery, executeEdgeFunction } from '@/utils/supabaseErrorHandler';
import { useResilientQuery } from './useResilientQuery';

export const useAdminUsers = () => {
  const { toast } = useToast();

  const { data: users, loading, error, refetch } = useResilientQuery(
    'admin_users_list',
    () => supabase.from('profiles').select('*, roles(id, name)'),
    { ttlMinutes: 2 }
  );

  const createUser = async (userData) => {
    try {
      const { data, error } = await executeEdgeFunction('manage-users', { action: 'create', ...userData });
      if (error || !data?.success) throw new Error(error?.message || data?.error || 'Failed to create user');
      
      sonnerToast.success('User created successfully');
      refetch(true);
      return { success: true };
    } catch (error) {
      sonnerToast.error(`Creation failed: ${error.message}`);
      return { success: false, error };
    }
  };

  const updateUser = async (userId, updateData) => {
    try {
      const { data, error } = await executeEdgeFunction('manage-users', { action: 'update', user_id: userId, ...updateData });
      if (error || !data?.success) throw new Error(error?.message || data?.error || 'Failed to update user');
      
      sonnerToast.success('User updated successfully');
      refetch(true);
      return { success: true };
    } catch (error) {
      sonnerToast.error(`Update failed: ${error.message}`);
      return { success: false, error };
    }
  };

  const deleteUser = async (userId) => {
    try {
      const { data, error } = await executeEdgeFunction('manage-users', { action: 'delete', user_id: userId });
      if (error || !data?.success) throw new Error(error?.message || data?.error || 'Failed to delete user');
      
      sonnerToast.success('User deleted successfully');
      refetch(true);
      return { success: true };
    } catch (error) {
      sonnerToast.error(`Deletion failed: ${error.message}`);
      return { success: false, error };
    }
  };

  // Safe side-effect execution to prevent infinite re-renders
  useEffect(() => {
    if (error && !users) {
      toast({ title: 'Error fetching users', description: error.message || String(error), variant: 'destructive' });
    }
  }, [error, users, toast]);

  return { users: users || [], loading, refetch, createUser, updateUser, deleteUser };
};