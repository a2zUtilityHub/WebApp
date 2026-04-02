import { supabase } from '@/lib/customSupabaseClient';

export const couponsService = {
  async getCoupons({ search = '', store = 'all', status = 'all', page = 1, limit = 10 } = {}) {
    let query = supabase.from('coupons').select('*', { count: 'exact' });

    if (search) query = query.or(`title.ilike.%${search}%,coupon_code.ilike.%${search}%`);
    if (store !== 'all') query = query.eq('store', store);
    if (status !== 'all') query = query.eq('status', status);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data, count };
  },

  async createCoupon(coupon) {
    const { data, error } = await supabase.from('coupons').insert(coupon).select().single();
    if (error) throw error;
    return data;
  },

  async updateCoupon(id, updates) {
    const { data, error } = await supabase.from('coupons').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteCoupon(id) {
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) throw error;
  },

  async bulkAction(ids, action, value) {
    let updateData = {};
    if (action === 'publish') updateData = { status: 'active' };
    else if (action === 'unpublish') updateData = { status: 'inactive' };
    else if (action === 'feature') updateData = { is_featured: value };

    if (action === 'delete') {
      const { error } = await supabase.from('coupons').delete().in('id', ids);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('coupons').update(updateData).in('id', ids);
      if (error) throw error;
    }
  }
};