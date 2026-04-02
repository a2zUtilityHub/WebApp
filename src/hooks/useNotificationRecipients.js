import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useNotificationRecipients = () => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const getRecipients = useCallback(async () => {
    if (!user) return;
    
    try {
        setLoading(true);
        setError(null);

        // This query might be restricted by RLS for non-admins
        const { data, error: apiError } = await supabase
            .from('notification_recipients')
            .select(`
                *,
                settings:notification_settings(setting_name)
            `);
        
        if (apiError) {
            if (apiError.code === '42501' || apiError.message.includes('row-level security')) {
                // RLS restriction
                setRecipients([]);
                setError('Access denied: You cannot view these recipients.');
            } else {
                throw apiError;
            }
        } else {
            // Transform for easier UI consumption if needed
            // Grouping by email if multiple rows per user, or flattened
            // Assuming simple list for now based on previous usage
            setRecipients(data || []);
        }
    } catch (err) {
        console.error("Error fetching recipients:", err);
        setError(err.message || "Failed to fetch recipients");
    } finally {
        setLoading(false);
    }
  }, [user]);

  const addRecipient = async (email, settingIds) => {
    try {
        // This likely needs an Edge Function or Admin client if adding OTHER users
        // But if RLS allows inserting OWN, we can do it directly.
        // Assuming Admin usage based on "AddRecipientModal"
        const inserts = settingIds.map(sid => ({
            email,
            notification_setting_id: sid,
            // user_id might be needed if linked to auth.users, but schema shows email primary
        }));

        const { error: apiError } = await supabase
            .from('notification_recipients')
            .insert(inserts);
        
        if (apiError) throw apiError;
        
        await getRecipients(); 
        return { success: true };
    } catch (err) {
        console.error("Error adding recipient:", err);
        return { success: false, error: err.message };
    }
  };

  const deleteRecipient = async (email) => {
      try {
        const { error: apiError } = await supabase
            .from('notification_recipients')
            .delete()
            .eq('email', email);
        
        if (apiError) throw apiError;
        
        await getRecipients(); 
        return { success: true };
    } catch (err) {
        console.error("Error removing recipient:", err);
        return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    getRecipients();
  }, [getRecipients]);

  return { recipients, loading, error, addRecipient, deleteRecipient, refetch: getRecipients };
};