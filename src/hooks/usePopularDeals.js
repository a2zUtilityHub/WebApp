import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { fetchCategoryBySlug, fetchItemsByCategoryId, logDebug } from '@/utils/categoryQueryHandler';

export const usePopularDeals = (categorySlug = null) => {
  const [deals, setDeals] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (categorySlug) {
        logDebug('usePopularDeals', `Fetching deals for category: ${categorySlug}`);
        // 1. Fetch category by slug
        const { data: catData, error: catError } = await fetchCategoryBySlug(categorySlug);
        
        if (catError) throw catError;
        if (!catData) throw new Error(`Category "${categorySlug}" not found`);
        
        setCategoryInfo(catData);
        
        // 2. Fetch deals by category ID using the utility
        const { data: dealsData, error: dealsError } = await fetchItemsByCategoryId('deals', catData.id);
        
        if (dealsError) throw dealsError;
        
        // Sort by popularity (click_count) then by date
        const sortedDeals = (dealsData || []).sort((a, b) => {
          const clickDiff = (b.click_count || 0) - (a.click_count || 0);
          if (clickDiff !== 0) return clickDiff;
          return new Date(b.created_at) - new Date(a.created_at);
        });
        
        setDeals(sortedDeals);
      } else {
        // Fetch global trending deals
        logDebug('usePopularDeals', 'Fetching global popular deals');
        
        const { data, error: globalError } = await supabase
          .from('coupons')
          .select('*, merchant:merchants(*), category:categories(*)')
          .in('status', ['published', 'active'])
          .eq('is_active', true)
          .eq('type', 'deal')
          .order('click_count', { ascending: false })
          .limit(20);
            
        if (globalError) throw globalError;
        setDeals(data || []);
      }
    } catch (err) {
      logDebug('usePopularDeals', 'Data load failed', null, err);
      setError(err.message || 'Failed to load popular deals');
    } finally {
      setLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { deals, categoryInfo, loading, error, refetch: loadData };
};