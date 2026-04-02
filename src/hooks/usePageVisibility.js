import { useState, useCallback, useRef } from 'react';
import { pageVisibilityService } from '@/services/pageVisibilityService';
import { useToast } from '@/components/ui/use-toast';

export const usePageVisibility = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  
  // Simple cache to prevent redundant fetches
  const cache = useRef({});

  const getPageVisibility = useCallback(async (slug) => {
    // If cached, return immediately
    if (cache.current[slug] !== undefined) {
      return cache.current[slug];
    }

    setLoading(true);
    try {
      const { success, data, error } = await pageVisibilityService.getPageVisibility(slug);
      if (!success) throw error;
      
      const isVisible = data?.is_visible ?? true;
      cache.current[slug] = isVisible;
      return isVisible;
    } catch (err) {
      console.warn("Visibility check failed, defaulting to visible:", err);
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPageBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    try {
      const { success, data, error } = await pageVisibilityService.getPageBySlug(slug);
      if (!success) throw error;
      return { data, loading: false, error: null };
    } catch (err) {
      setError(err);
      return { data: null, loading: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePageVisibility = async (slug, currentStatus) => {
    setLoading(true);
    try {
      const { success, error } = await pageVisibilityService.togglePageVisibility(slug, currentStatus);
      if (!success) throw error;
      
      // Update cache
      cache.current[slug] = !currentStatus;
      
      toast({ 
        title: 'Success', 
        description: `Page is now ${!currentStatus ? 'visible' : 'hidden'}` 
      });
      return true;
    } catch (err) {
      toast({ 
        title: 'Error', 
        description: err.message, 
        variant: 'destructive' 
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const hidePageBySlug = async (slug) => {
    setLoading(true);
    try {
        const { success, error } = await pageVisibilityService.hidePageBySlug(slug);
        if (!success) throw error;
        cache.current[slug] = false;
        toast({ title: 'Success', description: 'Page hidden successfully.' });
        return true;
    } catch (err) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
        return false;
    } finally {
        setLoading(false);
    }
  };

  const showPageBySlug = async (slug) => {
    setLoading(true);
    try {
        const { success, error } = await pageVisibilityService.showPageBySlug(slug);
        if (!success) throw error;
        cache.current[slug] = true;
        toast({ title: 'Success', description: 'Page is now visible.' });
        return true;
    } catch (err) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
        return false;
    } finally {
        setLoading(false);
    }
  };

  const getVisiblePages = useCallback(async () => {
    setLoading(true);
    try {
      const { success, data } = await pageVisibilityService.getVisiblePages();
      if (!success) throw new Error("Failed to fetch visible pages");
      return data;
    } catch (err) {
      console.error("Error fetching visible pages", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllPages = useCallback(async () => {
    setLoading(true);
    try {
      const { success, data, error } = await pageVisibilityService.getAllPages();
      if (!success) throw error;
      return data;
    } catch (err) {
      toast({ 
        title: 'Error', 
        description: err.message, 
        variant: 'destructive' 
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    error,
    getPageVisibility,
    getPageBySlug,
    togglePageVisibility,
    hidePageBySlug,
    showPageBySlug,
    getVisiblePages,
    getAllPages
  };
};