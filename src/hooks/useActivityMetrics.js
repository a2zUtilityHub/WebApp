import { useMemo } from 'react';
import { format } from 'date-fns';

export const useActivityMetrics = (activityLogs = []) => {
  const metrics = useMemo(() => {
    if (!activityLogs.length) {
      return {
        totalActivities: 0,
        activitiesByType: [],
        peakTimes: [],
        recentTrends: []
      };
    }

    // 1. Total Activities
    const totalActivities = activityLogs.length;

    // 2. Activities by Type
    const typeMap = {};
    activityLogs.forEach(log => {
      const type = log.activity_type || 'unknown';
      typeMap[type] = (typeMap[type] || 0) + 1;
    });

    const activitiesByType = Object.entries(typeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5

    // 3. Peak Times (Hour of day)
    const hourMap = {};
    activityLogs.forEach(log => {
      const hour = new Date(log.created_at).getHours();
      hourMap[hour] = (hourMap[hour] || 0) + 1;
    });

    const peakTimes = Object.entries(hourMap)
      .map(([hour, count]) => ({ 
        hour: `${hour}:00`, 
        count 
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    // 4. Activity Trends (Daily count for the fetched range)
    const trendMap = {};
    activityLogs.forEach(log => {
      const date = format(new Date(log.created_at), 'MMM d');
      trendMap[date] = (trendMap[date] || 0) + 1;
    });

    const recentTrends = Object.entries(trendMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Note: simple sort needs real date obj usually

    return {
      totalActivities,
      activitiesByType,
      peakTimes,
      recentTrends
    };
  }, [activityLogs]);

  return metrics;
};