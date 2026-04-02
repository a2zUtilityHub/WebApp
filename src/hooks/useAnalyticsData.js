import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { subDays, startOfDay, format } from 'date-fns';

export const useAnalyticsData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    users: [],
    activityLogs: [],
    analyticsEvents: [],
    dailySignups: []
  });

  const fetchAnalytics = useCallback(async (dateRange = '30days') => {
    setLoading(true);
    setError(null);
    console.log(`[Analytics] Fetching data for range: ${dateRange}`);

    try {
      let daysToSubtract = 7;
      if (dateRange === '30days') daysToSubtract = 30;
      if (dateRange === '90days') daysToSubtract = 90;
      
      const startDate = subDays(startOfDay(new Date()), daysToSubtract).toISOString();

      // 1. Attempt to fetch users directly via View (if created) or Profiles
      // We try the view first as it maps to auth.users
      let usersData = [];
      let { data: viewData, error: viewError } = await supabase
        .from('analytics_users') // This view exposes auth.users safely
        .select('*');

      if (viewError) {
        console.warn('[Analytics] View query failed, trying profiles...', viewError);
        // Fallback to profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) throw profilesError;
        usersData = profilesData;
      } else {
        usersData = viewData;
      }

      // 2. Fetch User Activity Logs
      const { data: activityData, error: activityError } = await supabase
        .from('user_activity_logs')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false });

      if (activityError) throw activityError;

      // 3. Fetch Analytics Events
      const { data: eventsData, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      // Process Daily Signups Locally
      const signupsMap = {};
      usersData.forEach(user => {
        const created = user.created_at || user.updated_at; // Fallback
        if (!created) return;
        
        const dateKey = format(new Date(created), 'MMM d');
        // Only count if within range
        if (new Date(created) >= new Date(startDate)) {
             signupsMap[dateKey] = (signupsMap[dateKey] || 0) + 1;
        }
      });

      // Fill in missing dates with 0 if needed, or just return sparse
      const sortedDates = Object.keys(signupsMap).sort((a,b) => new Date(a) - new Date(b)); // Simple string sort might fail for cross-month
      // Better: map to array
      const dailySignups = Object.entries(signupsMap).map(([date, count]) => ({ date, count }));

      setData({
        users: usersData,
        activityLogs: activityData || [],
        analyticsEvents: eventsData || [],
        dailySignups
      });

      console.log('[Analytics] Data fetched successfully', { 
        users: usersData.length, 
        activities: activityData?.length 
      });

    } catch (err) {
      console.error('[Analytics] Error fetching direct data:', err);
      
      // Fallback to Edge Function if direct query fails critically
      try {
        console.log('[Analytics] Attempting fallback to Edge Function...');
        const { data: edgeData, error: edgeError } = await supabase.functions.invoke('get-analytics-data', {
            body: { dateRange }
        });

        if (edgeError) throw edgeError;

        if (edgeData) {
            setData({
                users: edgeData.users || [],
                activityLogs: edgeData.activityLogs || [],
                analyticsEvents: [], // Edge function might not return this yet
                dailySignups: edgeData.dailySignups || []
            });
            setError(null); // Clear error if fallback succeeded
        }
      } catch (fallbackErr) {
          console.error('[Analytics] Edge function fallback failed:', fallbackErr);
          setError(err.message || 'Failed to fetch analytics data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { ...data, loading, error, refetch: fetchAnalytics };
};