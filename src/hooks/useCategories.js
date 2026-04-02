import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { logDetailedError } from '@/utils/supabaseErrorHandler';

const FALLBACK_CATEGORIES = [
  { id: '1001', name: 'Mobiles', slug: 'mobiles', icon_url: null, item_count: 0 },
  { id: '1002', name: 'Electronics', slug: 'electronics', icon_url: null, item_count: 0 },
  { id: '1003', name: 'Fashion', slug: 'fashion', icon_url: null, item_count: 0 },
  { id: '1004', name: 'Home Appliances', slug: 'home-appliances', icon_url: null, item_count: 0 },
  { id: '1005', name: 'Travel', slug: 'travel', icon_url: null, item_count: 0 }
];

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchCategoriesWithCounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Categories Robustly
      const { data: cats, error: catsError } = await supabase
        .from('categories')
        .select('*')
        .or('status.eq.active,status.is.null'); 
        
      if (catsError) throw catsError;
      
      const activeCats = cats && cats.length > 0 ? cats : FALLBACK_CATEGORIES;

      // 2. Fetch Item Counts Gracefully
      const countsMap = {};
      const incrementCount = (catId) => {
        if (!catId) return;
        countsMap[catId] = (countsMap[catId] || 0) + 1;
      };

      try {
          const [appsRes, blogsRes, couponsRes] = await Promise.all([
            supabase.from('apps_categories').select('category_id'),
            supabase.from('blog_posts').select('category_id').eq('status', 'published'),
            supabase.from('coupons').select('category_id').in('status', ['published', 'active']).eq('is_active', true)
          ]);

          (appsRes.data || []).forEach(item => incrementCount(item.category_id));
          (blogsRes.data || []).forEach(item => incrementCount(item.category_id));
          (couponsRes.data || []).forEach(item => incrementCount(item.category_id));
      } catch (countErr) {
          logDetailedError('useCategories:counts', countErr);
          // Don't fail the whole fetch just because counts failed
      }

      // 3. Assemble Final Array
      const enrichedCats = activeCats.map(cat => ({
        ...cat,
        item_count: countsMap[cat.id] || cat.item_count || 0
      })).sort((a, b) => (b.item_count || 0) - (a.item_count || 0));

      setCategories(enrichedCats);
      return enrichedCats;
      
    } catch (err) {
      logDetailedError('fetchCategoriesWithCounts', err);
      // Fallback to hardcoded categories on critical failure to prevent blank pages
      setCategories(FALLBACK_CATEGORIES);
      setError("Unable to sync latest categories, displaying defaults.");
      return FALLBACK_CATEGORIES;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const data = await fetchCategoriesWithCounts();
    return { data, count: data.length };
  }, [fetchCategoriesWithCounts]);

  return { categories, loading, error, fetchCategoriesWithCounts, fetchCategories };
};