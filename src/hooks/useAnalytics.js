import { useState, useEffect } from 'react';
import { analyticsService } from '@/services/analyticsService';

export const useAnalytics = (tasks = []) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const calculated = analyticsService.calculateMetrics(tasks);
      setMetrics(calculated);
    } catch (err) {
      console.error('Analytics calculation error', err);
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  return { metrics, loading };
};