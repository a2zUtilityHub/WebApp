import { supabase } from '@/lib/customSupabaseClient';

export const getWishlist = async (userId) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('wishlist')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const addToWishlist = async (userId, productId, productData) => {
  if (!userId) throw new Error('User must be logged in');
  const { data, error } = await supabase
    .from('wishlist')
    .insert([{ user_id: userId, product_id: productId, product_data: productData }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const removeFromWishlist = async (userId, productId) => {
  if (!userId) throw new Error('User must be logged in');
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .match({ user_id: userId, product_id: productId });
    
  if (error) throw error;
  return true;
};