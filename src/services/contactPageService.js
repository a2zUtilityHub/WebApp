import { supabase } from '@/lib/customSupabaseClient';

export const contactPageService = {
  async getContactPageContent() {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', 'contact-us');
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  async getContactSettings() {
    try {
      const { data, error } = await supabase
        .from('page_settings')
        .select('*')
        .eq('page_slug', 'contact-us');
      if (error) throw error;
      
      // Transform array to object
      const settings = {};
      data?.forEach(item => {
        settings[item.setting_key] = item.setting_value;
      });
      return { success: true, data: settings };
    } catch (error) {
      return { success: false, error };
    }
  },

  async updateContactPageContent(sectionName, content) {
    // Upsert logic similar to AboutPage
     try {
      const { data: existing } = await supabase
        .from('page_content')
        .select('id')
        .eq('page_slug', 'contact-us')
        .eq('section_name', sectionName)
        .maybeSingle();

      if (existing) {
        await supabase.from('page_content').update({ section_content: content }).eq('id', existing.id);
      } else {
        await supabase.from('page_content').insert({ page_slug: 'contact-us', section_name: sectionName, section_content: content });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  async updateContactSettings(key, value) {
    try {
      const { data: existing } = await supabase
        .from('page_settings')
        .select('id')
        .eq('page_slug', 'contact-us')
        .eq('setting_key', key)
        .maybeSingle();

      if (existing) {
        await supabase.from('page_settings').update({ setting_value: value }).eq('id', existing.id);
      } else {
        await supabase.from('page_settings').insert({ page_slug: 'contact-us', setting_key: key, setting_value: value });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  async getContactPageVisibility() {
      // Check pages table
      const { data } = await supabase.from('pages').select('is_visible').eq('slug', 'contact-us').maybeSingle();
      return { success: true, isVisible: data?.is_visible ?? true };
  },

  async toggleContactPageVisibility(isVisible) {
      const { data: existing } = await supabase.from('pages').select('id').eq('slug', 'contact-us').maybeSingle();
      if (existing) {
          await supabase.from('pages').update({ is_visible: isVisible }).eq('id', existing.id);
      } else {
          await supabase.from('pages').insert({ slug: 'contact-us', title: 'Contact Us', status: 'published', is_visible: isVisible });
      }
      return { success: true };
  }
};