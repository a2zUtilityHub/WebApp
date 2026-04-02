import { supabase } from '@/lib/customSupabaseClient';

export const categoriesService = {
  async getCategories({ search = '', status = 'all', page = 1, limit = 10 } = {}) {
    let query = supabase.from('categories').select('*', { count: 'exact' });

    if (search) query = query.ilike('name', `%${search}%`);
    if (status !== 'all') query = query.eq('status', status);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query
      .order('sort_order', { ascending: true })
      .range(from, to);

    if (error) throw error;
    return { data, count };
  },

  async createCategory(category) {
    const { data, error } = await supabase.from('categories').insert([category]).select().single();
    if (error) throw error;
    return data;
  },

  async updateCategory(id, updates) {
    const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteCategory(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  },

  async bulkDeleteCategories(ids) {
    const { error } = await supabase.from('categories').delete().in('id', ids);
    if (error) throw error;
  },

  async toggleStatus(id, status) {
    const { error } = await supabase.from('categories').update({ status }).eq('id', id);
    if (error) throw error;
  }
};