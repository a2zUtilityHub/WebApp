import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useAdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching roles from database...');
      const { data, error } = await supabase
        .from('roles')
        .select('*, role_permissions(count)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to flatten the count
      const transformedRoles = data.map(role => ({
        ...role,
        permissions_count: role.role_permissions?.[0]?.count || 0
      }));

      setRoles(transformedRoles || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError(err.message);
      toast({ title: 'Error', description: 'Failed to fetch roles', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createRole = async (roleData) => {
    setLoading(true);
    try {
      // Separate permissions from role data
      const { permission_ids, ...roleFields } = roleData;

      // 1. Create the role
      const { data: newRole, error: createError } = await supabase
        .from('roles')
        .insert([roleFields])
        .select()
        .single();

      if (createError) throw createError;

      // 2. Insert permissions if any
      if (permission_ids && permission_ids.length > 0) {
        const permissionInserts = permission_ids.map(permId => ({
          role_id: newRole.id,
          permission_id: permId
        }));

        const { error: permsError } = await supabase
          .from('role_permissions')
          .insert(permissionInserts);

        if (permsError) {
          console.error('Error adding permissions:', permsError);
          // Optional: revert role creation or warn user
          toast({ title: 'Warning', description: 'Role created but permissions failed to save', variant: 'warning' });
        }
      }

      toast({ title: 'Success', description: 'Role created successfully' });
      await fetchRoles();
      return { success: true };
    } catch (err) {
      console.error('Create role error:', err);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, roleData) => {
    setLoading(true);
    try {
      const { permission_ids, ...roleFields } = roleData;

      // 1. Update role details
      const { error: updateError } = await supabase
        .from('roles')
        .update(roleFields)
        .eq('id', id);

      if (updateError) throw updateError;

      // 2. Update permissions if provided
      // Since we don't have atomic transactions easily on client without RPC,
      // we'll delete all existing and insert new ones.
      if (permission_ids !== undefined) {
        // Delete existing
        const { error: deleteError } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', id);

        if (deleteError) throw deleteError;

        // Insert new
        if (permission_ids.length > 0) {
          const permissionInserts = permission_ids.map(permId => ({
            role_id: id,
            permission_id: permId
          }));

          const { error: insertError } = await supabase
            .from('role_permissions')
            .insert(permissionInserts);

          if (insertError) throw insertError;
        }
      }

      toast({ title: 'Success', description: 'Role updated successfully' });
      await fetchRoles();
      return { success: true };
    } catch (err) {
      console.error('Update role error:', err);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id) => {
    setLoading(true);
    try {
      // Delete permissions first (manual cascade if DB cascade not set)
      await supabase.from('role_permissions').delete().eq('role_id', id);

      // Delete role
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Role deleted successfully' });
      await fetchRoles();
      return { success: true };
    } catch (err) {
      console.error('Delete role error:', err);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole
  };
};