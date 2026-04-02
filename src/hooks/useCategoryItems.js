import { useState, useEffect } from 'react';
import { fetchItemsByCategoryId } from '@/utils/categoryQueryHandler';

/**
 * Hook to fetch and manage data for a specific category section.
 * Handles loading states, errors, and provides item counts.
 */
export const useCategoryItems = (categoryId, type) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    console.log(`[HOOK_USE_CATEGORY_ITEMS] Triggered for [${type}]. categoryId passed: ${categoryId} (Type: ${typeof categoryId})`);

    const loadItems = async () => {
      // If no categoryId yet, keep loading state true but don't fetch
      if (!categoryId) {
        console.log(`[HOOK_USE_CATEGORY_ITEMS] ⚠️ No categoryId provided to hook for [${type}], skipping fetch. (Value: ${categoryId})`);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`[HOOK_USE_CATEGORY_ITEMS] 🚀 Initiating fetchItemsByCategoryId for ${type} (CatID: ${categoryId})`);
        
        // Add a safety timeout (30 seconds max)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 30000)
        );
        
        const fetchPromise = fetchItemsByCategoryId(type, categoryId);
        
        const { data: fetchedData, error: fetchErr } = await Promise.race([
          fetchPromise,
          timeoutPromise
        ]);
        
        if (fetchErr) {
          console.error(`[HOOK_USE_CATEGORY_ITEMS] ❌ fetchItemsByCategoryId returned error for ${type}:`, fetchErr);
          throw fetchErr;
        }
        
        if (isMounted) {
          console.log(`[HOOK_USE_CATEGORY_ITEMS] ✅ [${type}] hook resolved successfully. Final data length:`, fetchedData?.length || 0);
          setData(fetchedData || []);
        }
      } catch (err) {
        console.error(`[HOOK_USE_CATEGORY_ITEMS] ❌ Error in ${type} hook catch block:`, err);
        if (isMounted) {
          setError(err.message || `Failed to load ${type}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadItems();

    return () => {
      isMounted = false;
    };
  }, [categoryId, type]);

  return { 
    data, 
    count: data.length, 
    loading, 
    error 
  };
};