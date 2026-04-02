import { supabase } from '@/lib/customSupabaseClient';

/**
 * Utility for centralized category data fetching with robust error handling
 * and application-level filtering to avoid complex Supabase join issues.
 */

export const logDebug = (context, action, data = null, error = null) => {
  const timestamp = new Date().toISOString();
  if (error) {
    console.error(`[${timestamp}] ❌ [${context}] ${action} - ERROR:`, error.message || error);
  } else {
    console.log(`[${timestamp}] ℹ️ [${context}] ${action}`, data ? `(Data: ${JSON.stringify(data).substring(0, 100)}...)` : '');
  }
};

export const diagnosticListAllCategories = async () => {
  console.log('[DB_DUMP] 🔍 Fetching all categories to verify slugs and IDs...');
  try {
    const { data, error } = await supabase.from('categories').select('id, slug, name, status, is_visible');
    if (error) throw error;
    
    console.log(`[DB_DUMP] 📊 Total categories found: ${data?.length}`);
    const targetSlugs = ['fashion', 'electronics', 'travel', 'technology', 'marketing'];
    
    data?.forEach(c => {
      const isTarget = targetSlugs.includes(c.slug?.toLowerCase());
      if (isTarget) {
        console.log(`[DB_DUMP_HIGHLIGHT] 👉 ID: ${c.id} | Slug: '${c.slug}' | Name: '${c.name}' | Status: ${c.status} | Visible: ${c.is_visible}`);
      } else {
        console.log(`[DB_DUMP] ID: ${c.id} | Slug: '${c.slug}' | Name: '${c.name}'`);
      }
    });
  } catch (err) {
    console.error('[DB_DUMP] ❌ Error fetching all categories:', err);
  }
};

export const fetchCategoryBySlug = async (slug) => {
  console.log(`\n[CATEGORY_LOOKUP] ----------------------------------------`);
  console.log(`[CATEGORY_LOOKUP] 🎯 Looking up category by slug: '${slug}'`);
  try {
    // Check for exact query params
    console.log(`[QUERY_PARAMS] Executing .ilike('slug', '${slug}') on 'categories' table`);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .ilike('slug', slug)
      .maybeSingle();
      
    if (error) {
      console.error(`[CATEGORY_LOOKUP] ❌ Supabase error for ${slug}:`, error);
      throw error;
    }
    
    if (!data) {
      console.warn(`[CATEGORY_LOOKUP] ⚠️ Category not found for slug: '${slug}'`);
      return { data: null, error: new Error(`Category '${slug}' not found in database.`) };
    }
    
    console.log(`[CATEGORY_ID] ✅ SUCCESS | Input Slug: '${slug}' -> DB Slug: '${data.slug}' | DB ID: ${data.id} (Type: ${typeof data.id})`);
    console.log(`[CATEGORY_LOOKUP] Raw DB Object:`, data);
    return { data, error: null };
  } catch (err) {
    console.error(`[CATEGORY_LOOKUP] ❌ Fetch failed:`, err);
    return { data: null, error: err };
  }
};

export const fetchItemsByCategoryId = async (type, categoryId) => {
  if (!categoryId) {
    console.warn(`[QUERY_PARAMS] ⚠️ No categoryId provided for ${type} fetch (Value: ${categoryId})`);
    return { data: [], error: null };
  }

  // Ensure consistent type comparison
  const targetId = Number(categoryId) || categoryId;
  console.log(`\n[QUERY_PARAMS] ----------------------------------------`);
  console.log(`[QUERY_PARAMS] 🔄 Fetching ${type} for category_id: ${targetId} (Type: ${typeof targetId})`);
  
  try {
    let query;
    
    // Server-side filtering with comprehensive logs
    if (type === 'apps') {
      console.log(`[FILTER_LOGIC] Apps: category_id=${targetId}, status in ['published', 'Production', 'active', 'development', 'Development']`);
      query = supabase
        .from('apps')
        .select('*, apps_categories!inner(category_id)')
        .eq('apps_categories.category_id', targetId)
        .in('status', ['published', 'Production', 'active', 'development', 'Development']);
        
    } else if (type === 'blogs') {
      console.log(`[FILTER_LOGIC] Blogs: category_id=${targetId}, status='published'`);
      query = supabase
        .from('blog_posts')
        .select('*, author:profiles(first_name, last_name)')
        .eq('category_id', targetId)
        .eq('status', 'published');
        
    } else if (type === 'deals' || type === 'coupons') {
      const itemType = type === 'deals' ? 'deal' : 'coupon';
      console.log(`[FILTER_LOGIC] ${itemType}s: category_id=${targetId}, type='${itemType}'`);
      query = supabase
        .from('coupons')
        .select('*, merchant:merchants(*)')
        .eq('category_id', targetId)
        .eq('type', itemType);
    }
    
    const { data: results, error } = await query;
    
    if (error) {
      console.error(`[ITEMS_RAW] ❌ Supabase Query Error for ${type}:`, error);
      throw error;
    }
    
    console.log(`[ITEMS_RAW] 📦 DB Results for ${type}: ${results?.length || 0} raw items returned.`);

    if (results && results.length > 0) {
      // Diagnostic check for status flags
      const statuses = results.map(r => r.status);
      const isVisible = results.map(r => r.is_visible);
      const isActives = results.map(r => r.is_active);
      console.log(`[STATUS_CHECK] ${type} statuses:`, [...new Set(statuses)]);
      console.log(`[STATUS_CHECK] ${type} is_visible:`, [...new Set(isVisible)]);
      console.log(`[STATUS_CHECK] ${type} is_active:`, [...new Set(isActives)]);
    }
    
    // Client side filter for active items if we bypassed them for debugging
    let filteredData = results || [];
    if (type === 'deals' || type === 'coupons') {
      const initialLen = filteredData.length;
      console.log(`[EXCLUSION_LOGIC] Client-side filtering active/published for ${type}`);
      filteredData = filteredData.filter(item => {
        const keeps = ['published', 'active'].includes(item.status) && item.is_active !== false;
        if (!keeps) {
          console.log(`[EXCLUSION_LOGIC] 🚫 Excluded ${type} ID ${item.id} - status: ${item.status}, is_active: ${item.is_active}`);
        }
        return keeps;
      });
      console.log(`[ITEMS_FILTERED] 🎯 ${type} filtered from ${initialLen} down to ${filteredData.length} items.`);
    }

    // Sort by created_at desc by default
    filteredData = filteredData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    console.log(`[ITEMS_FILTERED] ✅ Successfully processed ${filteredData.length} ${type} for category ${targetId}`);
    return { data: filteredData, error: null };
  } catch (err) {
    console.error(`[ITEMS_RAW] ❌ Failed fetching ${type}:`, err);
    return { data: [], error: err };
  }
};

export const fetchAllCategories = async () => {
  logDebug('CategoryQuery', `Fetching all categories`);
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .in('status', ['active', 'published']);
      
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    logDebug('CategoryQuery', `Failed to fetch all categories`, null, err);
    return { data: [], error: err };
  }
};