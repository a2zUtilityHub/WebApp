import { supabase } from '@/lib/customSupabaseClient';

export const shareEarnPageService = {
  async getPageContent() {
    const { data } = await supabase.from('page_content').select('*').eq('page_slug', 'share-earn');
    return { success: true, data };
  },

  async updatePageContent(sectionName, content) {
    const { data: existing } = await supabase.from('page_content').select('id').eq('page_slug', 'share-earn').eq('section_name', sectionName).maybeSingle();
    if (existing) {
        await supabase.from('page_content').update({ section_content: content }).eq('id', existing.id);
    } else {
        await supabase.from('page_content').insert({ page_slug: 'share-earn', section_name: sectionName, section_content: content });
    }
    return { success: true };
  },

  async getVisibility() {
      const { data } = await supabase.from('pages').select('is_visible').eq('slug', 'share-earn').maybeSingle();
      return { success: true, isVisible: data?.is_visible ?? true };
  },
  
  async toggleVisibility(isVisible) {
      const { data: existing } = await supabase.from('pages').select('id').eq('slug', 'share-earn').maybeSingle();
      if (existing) {
          await supabase.from('pages').update({ is_visible: isVisible }).eq('id', existing.id);
      } else {
          await supabase.from('pages').insert({ slug: 'share-earn', title: 'Share & Earn', status: 'published', is_visible: isVisible });
      }
      return { success: true };
  }
};