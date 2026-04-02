import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

const RatingStars = ({ rating = 0, max = 5, size = 16, className, readOnly = true, onChange }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= max; i++) {
    const isInteractive = !readOnly && onChange;
    
    let Icon = Star;
    let fill = "none";
    let color = "text-gray-300";

    if (i <= fullStars) {
      fill = "currentColor";
      color = "text-yellow-400";
    } else if (i === fullStars + 1 && hasHalfStar) {
      Icon = StarHalf;
      fill = "currentColor";
      color = "text-yellow-400";
    }

    stars.push(
      <button
        key={i}
        type="button"
        disabled={readOnly}
        onClick={() => isInteractive && onChange(i)}
        className={cn("p-0 bg-transparent border-none", isInteractive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default")}
      >
        <Icon size={size} className={cn(color, fill === 'currentColor' ? 'fill-yellow-400' : '')} />
      </button>
    );
  }

  return <div className={cn("flex items-center gap-1", className)}>{stars}</div>;
};

export default RatingStars;