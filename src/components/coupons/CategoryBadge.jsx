import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const CategoryBadge = ({ category, className }) => {
  if (!category) return null;
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "rounded-full px-3 py-1 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-brand-primary/30 transition-colors shadow-sm",
        className
      )}
    >
      {category.icon_url ? (
        <img 
          src={category.icon_url} 
          alt={category.name || category.slug} 
          className="h-3.5 w-3.5 mr-1.5 object-contain" 
        />
      ) : (
        <Tag className="h-3 w-3 mr-1.5 text-brand-primary" />
      )}
      <span className="capitalize font-medium text-gray-700">
        {category.name || category.slug}
      </span>
    </Badge>
  );
};

export default CategoryBadge;