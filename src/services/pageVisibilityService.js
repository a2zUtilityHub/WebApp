import { supabase } from '@/lib/customSupabaseClient';

export const pageVisibilityService = {
  async getPageVisibility(slug) {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('is_visible')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      // If page doesn't exist in DB (e.g. hardcoded route not yet in CMS), default to true
      return { success: true, data: data || { is_visible: true } };
    } catch (error) {
      console.error(`Error fetching visibility for ${slug}:`, error);
      // Default to visible on error to prevent accidental blocking of pages
      return { success: true, data: { is_visible: true }, error };
    }
  },

  async getPageBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`Error fetching page ${slug}:`, error);
      return { success: false, error };
    }
  },

  async togglePageVisibility(slug, currentStatus) {
    try {
      const { data, error } = await supabase
        .from('pages')
        .update({ is_visible: !currentStatus })
        .eq('slug', slug)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`Error toggling visibility for ${slug}:`, error);
      return { success: false, error };
    }
  },

  async hidePageBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('pages')
        .update({ is_visible: false })
        .eq('slug', slug)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`Error hiding page ${slug}:`, error);
      return { success: false, error };
    }
  },

  async showPageBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('pages')
        .update({ is_visible: true })
        .eq('slug', slug)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`Error showing page ${slug}:`, error);
      return { success: false, error };
    }
  },

  async getVisiblePages() {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('title, slug, is_visible')
        .eq('is_visible', true)
        .eq('status', 'published');

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching visible pages:", error);
      return { success: false, error, data: [] };
    }
  },

  async getAllPages() {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('title');

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching all pages:", error);
      return { success: false, error, data: [] };
    }
  }
};