import React, { useEffect, useState } from 'react';
import { useProductReviews } from '@/hooks/useProductReviews';
import RatingStars from '@/components/RatingStars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReviewsList = ({ productId }) => {
  const { reviews, stats, totalCount, loading, fetchReviews } = useProductReviews(productId);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchReviews(page, sortBy);
  }, [productId, page, sortBy, fetchReviews]);

  if (loading && page === 1) return <div className="py-8 text-center animate-pulse">Loading reviews...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-xl font-bold">Customer Reviews ({totalCount})</h3>
        <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="pb-6 border-b last:border-0">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.profiles?.avatar_url} />
                  <AvatarFallback>{review.profiles?.first_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{review.profiles?.first_name || 'Anonymous'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <RatingStars rating={review.rating} size={14} />
                        <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    {review.verified_purchase && (
                      <Badge variant="secondary" className="flex items-center gap-1 text-green-700 bg-green-50">
                        <CheckCircle2 size={12} /> Verified
                      </Badge>
                    )}
                  </div>
                  {review.title && <h4 className="font-semibold mt-3">{review.title}</h4>}
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{review.review_text}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <button className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                      <ThumbsUp size={14} /> Helpful ({review.helpful_count})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalCount > reviews.length && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => setPage(p => p + 1)}>Load More Reviews</Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;