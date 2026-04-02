import { useState, useCallback } from 'react';
import { getProductReviews, createProductReview, getProductRatingStats } from '@/api/ReviewsApi';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useProductReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchReviews = useCallback(async (page = 1, sortBy = 'newest') => {
    if (!productId) return;
    setLoading(true);
    try {
      const [{ reviews: fetchedReviews, totalCount }, fetchedStats] = await Promise.all([
        getProductReviews(productId, page, 5, sortBy),
        getProductRatingStats(productId)
      ]);
      setReviews(fetchedReviews);
      setTotalCount(totalCount);
      setStats(fetchedStats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const submitReview = async (reviewData) => {
    if (!user) {
      toast({ title: 'Authentication required', description: 'Please login to submit a review.', variant: 'destructive' });
      return null;
    }
    try {
      const newReview = await createProductReview({ ...reviewData, product_id: productId, user_id: user.id });
      toast({ title: 'Review submitted', description: 'Thank you for your feedback!' });
      await fetchReviews();
      return newReview;
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return null;
    }
  };

  return { reviews, stats, totalCount, loading, fetchReviews, submitReview };
};