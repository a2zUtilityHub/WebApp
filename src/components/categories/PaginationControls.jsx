import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onLoadMore, 
  hasMore, 
  mode = 'pagination', 
  isLoading 
}) => {
  if (mode === 'infinite') {
    if (!hasMore && !isLoading) return null;
    return (
      <div className="flex justify-center mt-8 w-full">
        <Button 
          variant="outline" 
          onClick={onLoadMore} 
          disabled={isLoading}
          className="min-w-[200px] h-12 rounded-full font-medium"
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</>
          ) : (
            'Load More'
          )}
        </Button>
      </div>
    );
  }

  // Standard Pagination
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8 w-full">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        aria-label="Previous page"
        className="rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <span className="text-sm font-medium text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        aria-label="Next page"
        className="rounded-full"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PaginationControls;