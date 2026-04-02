import React, { useState, useMemo } from 'react';
import Section from './Section';
import ItemCard from './ItemCard';
import PaginationControls from './PaginationControls';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ITEMS_PER_PAGE = 12;

const CategoryDataSection = ({ type, title, items = [], loading = false, error = null, viewAllLink, infiniteScroll = false }) => {
  const [page, setPage] = useState(1);

  // MOVE HOOKS TO TOP: Local pagination based on passed items
  const paginatedItems = useMemo(() => {
    const safeItems = items || [];
    if (infiniteScroll) {
      return safeItems.slice(0, page * ITEMS_PER_PAGE);
    }
    return safeItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  }, [items, page, infiniteScroll]);

  const totalCount = items?.length || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const hasMore = page < totalPages;

  const handleLoadMore = () => {
    if (hasMore) setPage(p => p + 1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Minimal scroll adjustment on pagination
    window.scrollBy({ top: -100, behavior: 'smooth' });
  };

  // CONDITIONAL RENDERING AFTER HOOKS

  // If currently loading, show skeleton loaders
  if (loading) {
    return (
      <div className="space-y-6 mb-12">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[280px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // If there's an error, show it
  if (error) {
    return (
      <Alert variant="destructive" className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading {title}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Hide section entirely if no items exist (dynamic visibility requirement)
  if (!items || items.length === 0) {
    return null;
  }

  const displayTitle = `${title} (${totalCount})`;

  return (
    <div className="mb-12">
      <Section 
        title={displayTitle} 
        count={totalCount}
        viewAllLink={viewAllLink}
        isLoading={false} 
        isEmpty={false}
      >
        {paginatedItems.map((item, idx) => (
          <ItemCard 
            key={`${item.id}-${idx}`} 
            item={item} 
            type={type} 
            isTop={idx === 0 && page === 1 && (item.is_featured || item.click_count > 10)} 
          />
        ))}
        
        {totalCount > ITEMS_PER_PAGE && (
          <div className="col-span-full mt-8 flex justify-center">
            <PaginationControls 
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              mode={infiniteScroll ? 'infinite' : 'pagination'}
              isLoading={loading}
            />
          </div>
        )}
      </Section>
    </div>
  );
};

export default CategoryDataSection;