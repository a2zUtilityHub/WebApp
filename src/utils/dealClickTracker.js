import { supabase } from '@/lib/customSupabaseClient';

/**
 * Tracks a click on a deal/coupon by incrementing its click_count in the database.
 * @param {number} dealId - The ID of the coupon/deal
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export const trackDealClick = async (dealId) => {
  try {
    // Attempt to use the RPC function first
    const { error } = await supabase.rpc('increment_coupon_click', { coupon_id: dealId });
    
    if (error) {
      console.warn('RPC increment_coupon_click failed, falling back to direct update:', error);
      
      // Fallback: Fetch current count and update
      const { data: coupon, error: fetchError } = await supabase
        .from('coupons')
        .select('click_count')
        .eq('id', dealId)
        .single();
        
      if (fetchError) throw fetchError;
      
      const newCount = (coupon?.click_count || 0) + 1;
      
      const { error: updateError } = await supabase
        .from('coupons')
        .update({ click_count: newCount })
        .eq('id', dealId);
        
      if (updateError) throw updateError;
    }
    
    return { success: true };
  } catch (err) {
    console.error('Failed to track deal click:', err);
    return { success: false, error: err };
  }
};