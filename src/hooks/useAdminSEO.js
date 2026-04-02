import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useAdminSEO = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleError = (error, action) => {
    console.error(`Error ${action}:`, error);
    toast({
      title: 'Error',
      description: error.message || `Failed to ${action}`,
      variant: 'destructive',
    });
    setLoading(false);
  };

  const genericFetch = async (table, options = {}) => {
    setLoading(true);
    try {
      let query = supabase.from(table).select('*', { count: 'exact' });
      
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      if (options.eq) {
        Object.entries(options.eq).forEach(([key, value]) => {
           if (value !== null && value !== undefined) query = query.eq(key, value);
        });
      }

      if (options.range) {
        query = query.range(options.range.from, options.range.to);
      }
      
      const { data, count, error } = await query;
      if (error) throw error;
      setLoading(false);
      return { data, count };
    } catch (error) {
      handleError(error, `fetch ${table}`);
      return { data: [], count: 0 };
    }
  };

  const genericCRUD = async (action, table, data, id) => {
    setLoading(true);
    try {
      let query;
      if (action === 'create') query = supabase.from(table).insert(data).select().single();
      if (action === 'update') query = supabase.from(table).update(data).eq('id', id).select().single();
      if (action === 'delete') query = supabase.from(table).delete().eq('id', id);

      const { data: result, error } = await query;
      if (error) throw error;
      
      toast({ title: 'Success', description: `${table} ${action}d successfully` });
      setLoading(false);
      return result || true;
    } catch (error) {
      handleError(error, `${action} ${table}`);
      return null;
    }
  };

  // SEO Pages
  const fetchSEOPages = (options) => genericFetch('seo_pages', options);
  const createSEOPage = (data) => genericCRUD('create', 'seo_pages', data);
  const updateSEOPage = (id, data) => genericCRUD('update', 'seo_pages', data, id);
  const deleteSEOPage = (id) => genericCRUD('delete', 'seo_pages', null, id);

  // Keywords
  const fetchKeywords = (options) => genericFetch('seo_keywords', options);
  const createKeyword = (data) => genericCRUD('create', 'seo_keywords', data);
  const updateKeyword = (id, data) => genericCRUD('update', 'seo_keywords', data, id);
  const deleteKeyword = (id) => genericCRUD('delete', 'seo_keywords', null, id);

  // Backlinks
  const fetchBacklinks = (options) => genericFetch('seo_backlinks', options);
  const createBacklink = (data) => genericCRUD('create', 'seo_backlinks', data);
  const updateBacklink = (id, data) => genericCRUD('update', 'seo_backlinks', data, id);
  const deleteBacklink = (id) => genericCRUD('delete', 'seo_backlinks', null, id);

  // Meta Tags
  const fetchMetaTags = (options) => genericFetch('seo_meta_tags', options);
  const createMetaTag = (data) => genericCRUD('create', 'seo_meta_tags', data);
  const updateMetaTag = (id, data) => genericCRUD('update', 'seo_meta_tags', data, id);
  const deleteMetaTag = (id) => genericCRUD('delete', 'seo_meta_tags', null, id);

  // Schema Markup
  const fetchSchemaMarkups = (options) => genericFetch('seo_schema_markups', options);
  const createSchemaMarkup = (data) => genericCRUD('create', 'seo_schema_markups', data);
  const updateSchemaMarkup = (id, data) => genericCRUD('update', 'seo_schema_markups', data, id);
  const deleteSchemaMarkup = (id) => genericCRUD('delete', 'seo_schema_markups', null, id);

  // Audits & Reports
  const fetchSEOAudits = (options) => genericFetch('seo_audits', options);
  const fetchSEOReports = (options) => genericFetch('seo_reports', options);

  const runSEOAudit = async () => {
    setLoading(true);
    // Mock audit process for now
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockAudit = {
            audit_score: Math.floor(Math.random() * 30) + 70,
            issues_found: Math.floor(Math.random() * 5),
            warnings_found: Math.floor(Math.random() * 10),
            status: 'completed',
            suggestions: ['Fix broken links', 'Optimize images', 'Add meta descriptions'],
            audit_date: new Date().toISOString()
        };
        const res = await genericCRUD('create', 'seo_audits', mockAudit);
        setLoading(false);
        return res;
    } catch(e) {
        handleError(e, 'run audit');
        return null;
    }
  };

  const generateSEOReport = async (config) => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const res = await genericCRUD('create', 'seo_reports', { 
            report_date_range: config.dateRange || 'Last 30 Days',
            metrics: { traffic: 12500, ctr: 4.2, impressions: 45000 },
            charts_data: { trend: [10, 15, 12, 18, 20] }
        });
        setLoading(false);
        return res;
      } catch (e) {
        handleError(e, 'generate report');
        return null;
      }
  };

  // Sitemap & Robots
  const fetchSitemapData = async () => {
      // Mock sitemap status
      return { 
          sitemap_url: 'https://a2zutils.com/sitemap.xml', 
          status: 'Active', 
          last_updated: new Date().toISOString(), 
          page_count: 142 
      };
  };

  const fetchRobotsTxt = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('system_settings').select('value').eq('key', 'robots_txt').single();
      setLoading(false);
      if (error && error.code !== 'PGRST116') { // PGRST116 is no rows found
          console.error('Error fetching robots.txt:', error);
      }
      return data?.value?.content || "User-agent: *\nAllow: /";
  };

  const updateRobotsTxt = async (content) => {
      setLoading(true);
      // Upsert into system_settings
      const { error } = await supabase.from('system_settings').upsert({
          key: 'robots_txt',
          value: { content },
          updated_at: new Date().toISOString()
      });
      
      setLoading(false);
      if (error) {
          handleError(error, 'update robots.txt');
          return false;
      }
      toast({ title: 'Success', description: 'Robots.txt updated successfully' });
      return true;
  };

  return {
    loading,
    fetchSEOPages, createSEOPage, updateSEOPage, deleteSEOPage,
    fetchKeywords, createKeyword, updateKeyword, deleteKeyword,
    fetchBacklinks, createBacklink, updateBacklink, deleteBacklink,
    fetchMetaTags, createMetaTag, updateMetaTag, deleteMetaTag,
    fetchSchemaMarkups, createSchemaMarkup, updateSchemaMarkup, deleteSchemaMarkup,
    fetchSEOAudits, runSEOAudit,
    fetchSEOReports, generateSEOReport,
    fetchSitemapData, fetchRobotsTxt, updateRobotsTxt
  };
};