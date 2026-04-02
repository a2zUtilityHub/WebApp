import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: apiError } = await supabase
        .from('notification_settings')
        .select('*');

      if (apiError) {
        if (apiError.code === '42501' || apiError.message.includes('row-level security')) {
           console.warn('Access denied to notification_settings (RLS)');
           // We set an empty array or handle specific UI logic for denied access
           setSettings([]); 
           setError('You do not have permission to view notification settings.');
        } else {
           throw apiError;
        }
      } else {
        setSettings(data || []);
      }
    } catch (err) {
      console.error("Error fetching notification settings:", err);
      setError(err.message || "Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSetting = async (id, updates) => {
    try {
      const { error: apiError } = await supabase
        .from('notification_settings')
        .update(updates)
        .eq('id', id);

      if (apiError) {
         if (apiError.code === '42501') {
             throw new Error('Permission denied: You cannot update these settings.');
         }
         throw apiError;
      }
      
      // Optimistic update or refetch
      setSettings(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      return { success: true };
    } catch (err) {
      console.error("Error updating setting:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, error, updateSetting, refetch: fetchSettings };
};