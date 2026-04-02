import { supabase } from '@/lib/customSupabaseClient';

export const adminUserService = {
  async getAllAdminUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, roles(name)')
      .not('role_id', 'is', null);
      
    if (error) throw error;
    return data;
  },

  async assignRoleToAdmin(userId, roleId) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role_id: roleId })
      .eq('id', userId)
      .select();
      
    if (error) throw error;
    return data;
  },

  async createAdminUser(userData) {
    // This typically requires Supabase Admin API or an Edge Function
    // as creating a user is an Auth level operation.
    // For now, we'll assume we are updating an existing profile to be admin
    // or creating profile metadata.
    
    // Real implementation would invoke an Edge Function:
    const { data, error } = await supabase.functions.invoke('admin-user-management', {
        body: { action: 'create', ...userData }
    });
    
    if (error) throw error;
    return data;
  },

  async updateAdminUser(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();

    if (error) throw error;
    return data;
  },

  async deleteAdminUser(userId) {
     const { data, error } = await supabase.functions.invoke('admin-user-management', {
        body: { action: 'delete', userId }
    });
    if (error) throw error;
    return data;
  }
};