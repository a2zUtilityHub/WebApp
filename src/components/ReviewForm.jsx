import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import RatingStars from '@/components/RatingStars';
import { useProductReviews } from '@/hooks/useProductReviews';

const ReviewForm = ({ productId, onSuccess }) => {
  const { submitReview } = useProductReviews(productId);
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (rating === 0) return;
    setIsSubmitting(true);
    const result = await submitReview({ ...data, rating });
    setIsSubmitting(false);
    if (result) {
      reset();
      setRating(0);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
      <h3 className="font-bold text-lg">Write a Review</h3>
      
      <div>
        <Label className="mb-2 block">Your Rating *</Label>
        <RatingStars rating={rating} max={5} size={24} readOnly={false} onChange={setRating} />
        {rating === 0 && isSubmitting && <p className="text-red-500 text-sm mt-1">Please select a rating.</p>}
      </div>

      <div>
        <Label htmlFor="title">Review Title</Label>
        <Input id="title" placeholder="Summarize your experience" {...register('title', { required: 'Title is required' })} />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="review_text">Review</Label>
        <Textarea 
          id="review_text" 
          placeholder="What did you like or dislike?" 
          rows={4}
          {...register('review_text', { required: 'Review text is required', minLength: { value: 10, message: 'Review must be at least 10 characters' } })} 
        />
        {errors.review_text && <p className="text-red-500 text-sm mt-1">{errors.review_text.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full sm:w-auto">
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;