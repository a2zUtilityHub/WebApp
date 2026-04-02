import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useUserActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const refetch = useCallback(async (filters = {}, page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching activity logs with filters:', filters);
      
      let query = supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.activity_type && filters.activity_type !== 'all') {
        query = query.eq('activity_type', filters.activity_type);
      }
      
      if (filters.search) {
        // Search by IP or generic search if supported, 
        // strictly searching by IP here as typically needed or user_id if it's a UUID
        if (filters.search.includes('.')) {
             query = query.ilike('ip_address', `%${filters.search}%`);
        } else {
            // Assume it might be a user_id if valid UUID, otherwise maybe ignore or precise match
             query = query.or(`ip_address.ilike.%${filters.search}%`);
        }
      }

      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      if (filters.startDate) {
        query = query.gte('created_at', new Date(filters.startDate).toISOString());
      }
      
      if (filters.endDate) {
        // End of the day
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        query = query.lte('created_at', endDate.toISOString());
      }

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data: logsData, error: queryError, count } = await query;

      if (queryError) throw queryError;

      // Manually fetch profiles since foreign key constraints might be missing in schema
      // preventing automatic embedding via select('*, profiles(*)')
      let enrichedLogs = logsData || [];
      
      const userIds = [...new Set(enrichedLogs.map(log => log.user_id).filter(Boolean))];
      
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, email, first_name, last_name')
            .in('id', userIds);
            
        const profileMap = (profilesData || []).reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
        }, {});

        enrichedLogs = enrichedLogs.map(log => ({
            ...log,
            profiles: profileMap[log.user_id] || null
        }));
      }

      setLogs(enrichedLogs);
      setTotalCount(count || 0);

    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch activity logs: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { 
    logs, 
    activityLogs: logs, // Alias for compatibility with some components if needed
    totalCount, 
    loading, 
    error, 
    refetch,
    fetchLogs: refetch // Alias
  };
};