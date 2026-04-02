import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { retryWithBackoff } from '@/utils/supabaseErrorHandler';

export const useFooterCMS = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleOperation = async (operation, successMsg) => {
    setLoading(true);
    try {
      const { data, error } = await retryWithBackoff(operation);
      if (error) throw error;
      if (successMsg) toast({ title: "Success", description: successMsg });
      return { data, error: null };
    } catch (error) {
      if (error.code !== 'PGRST116') {
          toast({ title: "Error", description: error.message, variant: "destructive" });
      }
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = useCallback((params = {}) => handleOperation(async () => {
    let query = supabase.from('pages').select('*').order('created_at', { ascending: false });
    if (params.status) query = query.eq('status', params.status);
    if (params.slug) query = query.eq('slug', params.slug).maybeSingle();
    return query;
  }), []);

  const savePage = useCallback((pageData) => handleOperation(async () => {
    if (pageData.id) return supabase.from('pages').update(pageData).eq('id', pageData.id).select().single();
    return supabase.from('pages').insert(pageData).select().single();
  }, "Page saved successfully"), []);

  const deletePage = useCallback((id) => handleOperation(async () => {
    return supabase.from('pages').delete().eq('id', id);
  }, "Page deleted"), []);

  const fetchCollection = useCallback((table, params = {}) => handleOperation(async () => {
    let query = supabase.from(table).select('*');
    if (params.order) query = query.order(params.order.column, { ascending: params.order.asc });
    else query = query.order('created_at', { ascending: false });
    
    if (params.status) query = query.eq('status', params.status);
    if (params.limit) query = query.limit(params.limit);
    
    return query;
  }), []);

  const saveCollectionItem = useCallback((table, item) => handleOperation(async () => {
    if (item.id) return supabase.from(table).update(item).eq('id', item.id).select().single();
    return supabase.from(table).insert(item).select().single();
  }, "Item saved successfully"), []);

  const deleteCollectionItem = useCallback((table, id) => handleOperation(async () => {
    return supabase.from(table).delete().eq('id', id);
  }, "Item deleted"), []);

  const useTestimonials = () => ({
      fetch: (params) => fetchCollection('testimonials', params),
      save: (item) => saveCollectionItem('testimonials', item),
      delete: (id) => deleteCollectionItem('testimonials', id)
  });

  const useFAQItems = () => ({
      fetch: (params) => fetchCollection('faq_items', params),
      save: (item) => saveCollectionItem('faq_items', item),
      delete: (id) => deleteCollectionItem('faq_items', id),
      fetchCategories: () => fetchCollection('faq_categories', { order: { column: 'sort_order', asc: true } })
  });

  const useJobPostings = () => ({
      fetch: (params) => fetchCollection('job_postings', params),
      save: (item) => saveCollectionItem('job_postings', item),
      delete: (id) => deleteCollectionItem('job_postings', id)
  });

  const usePressReleases = () => ({
      fetch: (params) => fetchCollection('press_releases', params),
      save: (item) => saveCollectionItem('press_releases', item),
      delete: (id) => deleteCollectionItem('press_releases', id)
  });

  const fetchCopyright = useCallback(() => handleOperation(async () => {
    return supabase.from('copyright_info').select('*').limit(1).maybeSingle();
  }), []);

  const saveCopyright = useCallback((data) => handleOperation(async () => {
    const { data: existing } = await supabase.from('copyright_info').select('id').limit(1).maybeSingle();
    if (existing) return supabase.from('copyright_info').update(data).eq('id', existing.id).select().single();
    return supabase.from('copyright_info').insert(data).select().single();
  }, "Copyright info updated"), []);

  const fetchSEOSettings = useCallback((pageId) => handleOperation(async () => {
     if(!pageId) return { data: null };
     return supabase.from('seo_settings').select('*').eq('page_id', pageId).maybeSingle();
  }), []);

  const saveSEOSettings = useCallback((settings) => handleOperation(async () => {
     if(settings.id) return supabase.from('seo_settings').update(settings).eq('id', settings.id).select().single();
     return supabase.from('seo_settings').insert(settings).select().single();
  }, "SEO settings updated"), []);

  return {
    loading, fetchPages, savePage, deletePage, fetchCollection, saveCollectionItem, deleteCollectionItem,
    fetchCopyright, saveCopyright, fetchSEOSettings, saveSEOSettings, useTestimonials, useFAQItems, useJobPostings, usePressReleases
  };
};