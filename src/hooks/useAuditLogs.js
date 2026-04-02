import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authReady } = useAuth();

  const fetchAuditLogs = useCallback(async (filters = {}, page = 1, limit = 20) => {
    if (!authReady) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const token = session.access_token;
    console.log('useAuditLogs: Fetching with token...');

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const { data, error: invokeError } = await supabase.functions.invoke(`get-audit-logs?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (invokeError) throw invokeError;
      if (data.error) throw new Error(data.error);

      setLogs(data.logs || []);
      setTotal(data.total || 0);

      return data;
    } catch (err) {
      console.error('useAuditLogs Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authReady]);

  return {
    logs,
    total,
    loading,
    error,
    fetchAuditLogs
  };
};