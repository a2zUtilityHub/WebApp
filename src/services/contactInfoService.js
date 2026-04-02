import { supabase } from '@/lib/customSupabaseClient';

export const contactInfoService = {
  async getContactInfo() {
    const { data, error } = await supabase.from('contact_info').select('*').maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateContactInfo(data) {
    const { data: existing } = await supabase.from('contact_info').select('id').maybeSingle();
    
    let result;
    if (existing) {
      result = await supabase.from('contact_info').update(data).eq('id', existing.id).select().single();
    } else {
      result = await supabase.from('contact_info').insert(data).select().single();
    }
    
    if (result.error) throw result.error;
    return result.data;
  }
};