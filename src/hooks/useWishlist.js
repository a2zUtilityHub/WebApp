import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getWishlist, addToWishlist as apiAdd, removeFromWishlist as apiRemove } from '@/api/WishlistApi';
import { useToast } from '@/components/ui/use-toast';

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }
    try {
      const data = await getWishlist(user.id);
      setWishlist(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    if (!user) {
      toast({ title: "Login Required", description: "Please login to save items to your wishlist.", variant: "destructive" });
      return;
    }
    try {
      const newItem = await apiAdd(user.id, product.id, product);
      setWishlist(prev => [newItem, ...prev]);
      toast({ title: "Added to Wishlist", description: `${product.title} saved to your wishlist.` });
    } catch (error) {
      toast({ title: "Error", description: "Could not add to wishlist.", variant: "destructive" });
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      await apiRemove(user.id, productId);
      setWishlist(prev => prev.filter(item => item.product_id !== productId));
      toast({ title: "Removed from Wishlist", description: "Item removed from your wishlist." });
    } catch (error) {
      toast({ title: "Error", description: "Could not remove from wishlist.", variant: "destructive" });
    }
  };

  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => item.product_id === productId);
  }, [wishlist]);

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist
  };
};