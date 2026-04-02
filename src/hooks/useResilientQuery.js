import { useState, useEffect, useCallback, useRef } from 'react';
import { executeQuery } from '@/utils/supabaseErrorHandler';
import { isOnline, isOffline } from '@/utils/networkResilience';

export const useResilientQuery = (queryKey, queryFn, options = {}) => {
  const { 
    ttlMinutes = 5, 
    enabled = true, 
    initialData = null,
    timeout = 30000,
    maxRetries = 3
  } = options;
  
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const [offline, setOffline] = useState(isOffline());
  const [retryCount, setRetryCount] = useState(0);
  
  const cacheRef = useRef(new Map());
  const activeRequestsRef = useRef(new Set());

  const getCachedData = useCallback((key) => {
    const cached = cacheRef.current.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > ttlMinutes * 60 * 1000) {
      cacheRef.current.delete(key);
      return null;
    }
    return cached.data;
  }, [ttlMinutes]);

  const setCachedData = useCallback((key, value) => {
    cacheRef.current.set(key, { data: value, timestamp: Date.now() });
  }, []);

  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetch = useCallback(async (force = false) => {
    if (!queryKey || !enabled) return;
    if (activeRequestsRef.current.has(queryKey) && !force) return;
    
    const cached = getCachedData(queryKey);
    if (cached && !force) {
      setData(cached);
      setIsCached(true);
      setLoading(false);
      return;
    }

    if (isOffline()) {
      if (cached) {
        setData(cached);
        setIsCached(true);
      } else {
        setError('You are offline and no cached data is available.');
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setRetryCount(0);
    activeRequestsRef.current.add(queryKey);

    try {
      const { data: resultData, error: queryError } = await executeQuery(queryFn, {
        context: queryKey,
        throwOnError: true,
        timeout,
        maxRetries,
        onRetry: (attempt) => setRetryCount(attempt)
      });

      if (queryError) throw queryError;
      
      setData(resultData);
      setIsCached(false);
      setCachedData(queryKey, resultData);
    } catch (err) {
      if (cached) {
        setData(cached);
        setIsCached(true);
        setError(`${err.message} (Showing cached data)`);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      activeRequestsRef.current.delete(queryKey);
    }
  }, [queryKey, queryFn, enabled, getCachedData, setCachedData, timeout, maxRetries]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: () => fetch(true), isCached, isOffline: offline, retryCount };
};