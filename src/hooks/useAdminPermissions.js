import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useAdminPermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simplified query to avoid recursion and unnecessary joins as requested
      const { data, error: fetchError } = await supabase
        .from('permissions')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      setPermissions(data);
    } catch (err) {
      console.error('Error fetching permissions:', err);
      setError(err.message);
      toast({ 
        title: 'Error', 
        description: 'Failed to fetch permissions: ' + err.message, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createPermission = async (permData) => {
    setLoading(true);
    try {
      const { data, error: createError } = await supabase
        .from('permissions')
        .insert([permData])
        .select()
        .single();

      if (createError) throw createError;

      toast({ title: 'Success', description: 'Permission created successfully' });
      await fetchPermissions();
      return { success: true };
    } catch (err) {
      console.error('Error creating permission:', err);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = async (id, permData) => {
    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('permissions')
        .update(permData)
        .eq('id', id);

      if (updateError) throw updateError;

      toast({ title: 'Success', description: 'Permission updated successfully' });
      await fetchPermissions();
      return { success: true };
    } catch (err) {
      console.error('Error updating permission:', err);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deletePermission = async (id) => {
    setLoading(true);
    try {
      // Delete associations first manually if needed
      const { error: assocError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('permission_id', id);

      if (assocError) {
        console.warn('Error deleting associated role permissions:', assocError);
      }

      const { error: deleteError } = await supabase
        .from('permissions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast({ title: 'Success', description: 'Permission deleted successfully' });
      await fetchPermissions();
      return { success: true };
    } catch (err) {
      console.error('Error deleting permission:', err);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    permissions,
    loading,
    error,
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission
  };
};