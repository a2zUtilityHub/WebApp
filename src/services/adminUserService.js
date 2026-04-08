import { supabase } from '@/lib/customSupabaseClient';

export const adminUserService = {
  // SEED: Inserts demo data with is_mock flag
  seedUsers: async (users) => {
    const { data, error } = await supabase.from('profiles').insert(
      users.map(u => {
        const parts = u.name.split(' ');
        return {
          first_name: parts[0],
          last_name: parts.slice(1).join(' ') || '',
          email: u.email,
          role: u.role.toLowerCase(),
          status: u.status.toLowerCase(),
          is_mock: true 
        };
      })
    );
    return { data, error };
  },

  // REMOVE MOCK: Deletes only seeded demo records
  removeMockUsers: async () => {
    const { error } = await supabase.from('profiles').delete().eq('is_mock', true);
    return { error };
  },

  // RESET: Super Admin only - Wipes table except current user
  resetAllUsers: async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const { error } = await supabase.from('profiles').delete().neq('id', authUser?.id);
    return { error };
  },

  // CRUD: Add User with Schema-correct columns
  createUser: async (userData) => {
    const parts = userData.name.split(' ');
    const { data, error } = await supabase.from('profiles').insert([{
      first_name: parts[0],
      last_name: parts.slice(1).join(' ') || '',
      email: userData.email,
      role: userData.role.toLowerCase(),
      status: userData.status.toLowerCase(),
      is_mock: false
    }]);
    return { data, error };
  },

  async getAllAdminUsers() {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    return { data, error };
  },

  async deleteUser(userId) {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    return { error };
  }
};