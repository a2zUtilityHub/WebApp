import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { withExponentialBackoff, withTimeout, isOffline } from '@/utils/networkResilience';
import { logNotificationError, getNotificationErrorMessage } from '@/utils/supabaseErrorHandler';

const CACHE_KEY_PREFIX = 'notifications_cache_';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useUserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isOfflineMode, setIsOfflineMode] = useState(isOffline());

  const { authReady, user } = useAuth();
  const abortControllerRef = useRef(null);

  const getCacheKey = useCallback(() => `${CACHE_KEY_PREFIX}${user?.id}`, [user]);

  const loadFromCache = useCallback(() => {
    if (!user) return false;
    try {
      const cached = localStorage.getItem(getCacheKey());
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
          setTotalCount(data.totalCount || 0);
          return true;
        }
      }
    } catch (e) {
      console.warn('Failed to load notifications from cache', e);
    }
    return false;
  }, [user, getCacheKey]);

  const saveToCache = useCallback((data) => {
    if (!user) return;
    try {
      localStorage.setItem(getCacheKey(), JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to save notifications to cache', e);
    }
  }, [user, getCacheKey]);

  const fetchNotifications = useCallback(async (page = 1, filter = 'all') => {
    if (!authReady || !user) {
      setLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      setIsOfflineMode(isOffline());

      if (isOffline()) {
        const hasCache = loadFromCache();
        if (!hasCache) setError('You are offline and no cached data is available.');
        setLoading(false);
        return;
      }

      const startTime = performance.now();

      const fetchOp = async () => {
        let query = supabase
          .from('notifications')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (filter === 'unread') {
          query = query.eq('is_read', false);
        }

        const pageSize = 20;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;
        if (error) throw error;
        
        // Also get total unread count if we are filtering
        let currentUnreadCount = data.filter(n => !n.is_read).length;
        if (filter !== 'unread') {
           const { count: unread } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_read', false);
           currentUnreadCount = unread || 0;
        }

        return { notifications: data || [], totalCount: count || 0, unreadCount: currentUnreadCount };
      };

      const result = await withExponentialBackoff(() => withTimeout(fetchOp(), 30000), {
        maxRetries: 5,
        baseDelay: 1000,
        maxDelay: 8000,
        onRetry: (err, attempt) => console.log(`Retry ${attempt} for notifications due to: ${err.message}`)
      });

      const duration = performance.now() - startTime;
      if (duration > 2000) {
        console.warn(`Slow notification query: ${duration}ms`);
      }

      setNotifications(result.notifications);
      setTotalCount(result.totalCount);
      setUnreadCount(result.unreadCount);
      
      if (page === 1 && filter === 'all') {
        saveToCache(result);
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        logNotificationError('fetch_notifications', err, { userId: user.id });
        setError(getNotificationErrorMessage(err));
        
        // Fallback to cache if available
        if (page === 1) loadFromCache();
      }
    } finally {
      setLoading(false);
    }
  }, [authReady, user, loadFromCache, saveToCache]);

  // Initial fetch
  useEffect(() => {
    const handleOnline = () => {
      setIsOfflineMode(false);
      fetchNotifications();
    };
    const handleOffline = () => setIsOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    fetchNotifications();

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    if (!user || isOfflineMode) return;
    
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await withExponentialBackoff(async () => {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notificationId)
          .eq('user_id', user.id);
        if (error) throw error;
      });
      
      // Update cache
      const cached = localStorage.getItem(getCacheKey());
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.data.notifications = parsed.data.notifications.map(n => n.id === notificationId ? { ...n, is_read: true } : n);
        parsed.data.unreadCount = Math.max(0, (parsed.data.unreadCount || 1) - 1);
        saveToCache(parsed.data);
      }
    } catch (err) {
      logNotificationError('mark_as_read', err, { notificationId, userId: user.id });
      // Revert optimism is complex here, keeping it simple
      fetchNotifications(); 
    }
  };

  const markAllAsRead = async () => {
    if (!user || isOfflineMode) return;

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      await withExponentialBackoff(async () => {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', user.id)
          .eq('is_read', false);
        if (error) throw error;
      });
      fetchNotifications();
    } catch (err) {
      logNotificationError('mark_all_read', err, { userId: user.id });
      fetchNotifications();
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!user || isOfflineMode) return;
    
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    try {
      await withExponentialBackoff(async () => {
        const { error } = await supabase
          .from('notifications')
          .delete()
          .eq('id', notificationId)
          .eq('user_id', user.id);
        if (error) throw error;
      });
    } catch (err) {
      logNotificationError('delete_notification', err, { notificationId, userId: user.id });
      fetchNotifications();
    }
  };

  const deleteAllNotifications = async () => {
    if (!user || isOfflineMode) return;
    
    setNotifications([]);
    setUnreadCount(0);
    setTotalCount(0);
    localStorage.removeItem(getCacheKey());

    try {
      await withExponentialBackoff(async () => {
        const { error } = await supabase
          .from('notifications')
          .delete()
          .eq('user_id', user.id);
        if (error) throw error;
      });
    } catch (err) {
      logNotificationError('delete_all_notifications', err, { userId: user.id });
      fetchNotifications();
    }
  };

  return {
    notifications,
    unreadCount,
    totalCount,
    loading,
    error,
    isOffline: isOfflineMode,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications
  };
};