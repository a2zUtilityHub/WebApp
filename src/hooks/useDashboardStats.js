import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authReady } = useAuth();

  const fetchStats = useCallback(async () => {
    if (!authReady) return;

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.warn('useDashboardStats: No session');
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    const token = session.access_token;
    console.log('useDashboardStats: Token available for request');

    try {
      setLoading(true);
      setError(null);

      const { data, error: invokeError } = await supabase.functions.invoke('get-dashboard-stats', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (invokeError) throw invokeError;
      if (data.error) throw new Error(data.error);

      setStats(data);
    } catch (err) {
      console.error('useDashboardStats Error:', err);
      setError(err.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, [authReady]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};