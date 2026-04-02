import { useState, useEffect, useCallback } from 'react';

export const useNetworkResilience = () => {
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheData = useCallback((key, data, ttlMinutes = 5) => {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl: ttlMinutes * 60 * 1000
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.error('Failed to cache data', e);
    }
  }, []);

  const getCachedData = useCallback((key) => {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      const item = JSON.parse(itemStr);
      if (Date.now() - item.timestamp > item.ttl) {
        localStorage.removeItem(key);
        return null;
      }
      return item.data;
    } catch (e) {
      return null;
    }
  }, []);

  const clearCache = useCallback((key) => {
    localStorage.removeItem(key);
  }, []);

  return { online, isOnline: online, cacheData, getCachedData, clearCache };
};