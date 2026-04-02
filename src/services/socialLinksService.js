import { supabase } from '@/lib/customSupabaseClient';

export const socialLinksService = {
  async getSocialLinks() {
    const { data, error } = await supabase.from('social_links').select('*').order('platform');
    if (error) throw error;
    return data;
  },

  async updateSocialLink(id, url, status) {
    const { data, error } = await supabase.from('social_links').update({ url, status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async createSocialLink(platform, url) {
     const { data, error } = await supabase.from('social_links').insert({ platform, url }).select().single();
     if (error) throw error;
     return data;
  }
};