import { useEffect, useCallback } from 'react';

export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 200,
  enabled = true
}) => {
  const handleScroll = useCallback(() => {
    if (!enabled || !hasMore || isLoading) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      onLoadMore();
    }
  }, [onLoadMore, hasMore, isLoading, threshold, enabled]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return null;
};