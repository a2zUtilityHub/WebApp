import { supabase } from '@/lib/customSupabaseClient';

export const getProductReviews = async (productId, page = 1, limit = 5, sortBy = 'newest') => {
  let query = supabase
    .from('product_reviews')
    .select(`*, profiles(first_name, last_name, avatar_url)`, { count: 'exact' })
    .eq('product_id', productId);
    
  if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
  if (sortBy === 'helpful') query = query.order('helpful_count', { ascending: false });
  if (sortBy === 'highest') query = query.order('rating', { ascending: false });
  if (sortBy === 'lowest') query = query.order('rating', { ascending: true });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) throw error;
  return { reviews: data, totalCount: count };
};

export const createProductReview = async (reviewData) => {
  const { data, error } = await supabase
    .from('product_reviews')
    .insert([reviewData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getProductRatingStats = async (productId) => {
  const { data, error } = await supabase
    .from('product_reviews')
    .select('rating')
    .eq('product_id', productId);
  if (error) throw error;
  
  const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, total: data.length, average: 0 };
  if (data.length > 0) {
    let sum = 0;
    data.forEach(r => { stats[r.rating]++; sum += r.rating; });
    stats.average = sum / data.length;
  }
  return stats;
};