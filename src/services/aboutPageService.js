import { supabase } from '@/lib/customSupabaseClient';

export const aboutPageService = {
  async getAboutPageContent() {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', 'about-us')
        .order('section_order', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching about page content:', error);
      return { success: false, error };
    }
  },

  async updateAboutPageContent(sectionName, content) {
    try {
      const { data: existing } = await supabase
        .from('page_content')
        .select('id')
        .eq('page_slug', 'about-us')
        .eq('section_name', sectionName)
        .maybeSingle();

      let result;
      if (existing) {
        result = await supabase
          .from('page_content')
          .update({ section_content: content, updated_at: new Date() })
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('page_content')
          .insert({
            page_slug: 'about-us',
            section_name: sectionName,
            section_content: content
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;
      return { success: true, data: result.data };
    } catch (error) {
      console.error(`Error updating section ${sectionName}:`, error);
      return { success: false, error };
    }
  },

  async getAboutPageVisibility() {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('is_visible')
        .eq('slug', 'about-us')
        .maybeSingle();

      if (error) throw error;
      return { success: true, isVisible: data?.is_visible ?? true };
    } catch (error) {
      console.error('Error fetching visibility:', error);
      return { success: false, error };
    }
  },

  async toggleAboutPageVisibility(isVisible) {
    try {
      // Upsert into pages table if not exists, otherwise update
      const { data: existing } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', 'about-us')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('pages')
          .update({ is_visible: isVisible })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pages')
          .insert({
            slug: 'about-us',
            title: 'About Us',
            status: 'published',
            is_visible: isVisible
          });
        if (error) throw error;
      }
      return { success: true };
    } catch (error) {
      console.error('Error toggling visibility:', error);
      return { success: false, error };
    }
  }
};