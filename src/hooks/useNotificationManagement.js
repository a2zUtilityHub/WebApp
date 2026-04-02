import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useNotificationManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchNotifications = useCallback(async ({ page = 1, limit = 20, filters = {} }) => {
    try {
      setLoading(true);
      setError(null);

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Simplified query: No joins initially
      let query = supabase
        .from('user_notifications')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status === 'read') {
        query = query.eq('is_read', true);
      } else if (filters.status === 'unread') {
        query = query.eq('is_read', false);
      }

      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', new Date(filters.dateFrom).toISOString());
      }
      if (filters.dateTo) {
        const endDate = new Date(filters.dateTo);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('created_at', endDate.toISOString());
      }

      if (filters.search) {
        // Search local fields only first
        query = query.or(`title.ilike.%${filters.search}%,message.ilike.%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false }).range(from, to);

      const { data: notifications, count, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Manual Join for User Data
      // This bypasses the PostgREST relationship error
      let enhancedNotifications = notifications || [];
      
      if (enhancedNotifications.length > 0) {
        const userIds = [...new Set(enhancedNotifications.map(n => n.user_id).filter(Boolean))];
        
        if (userIds.length > 0) {
            const { data: users, error: usersError } = await supabase
                .from('profiles')
                .select('id, email, first_name, last_name')
                .in('id', userIds);
                
            if (!usersError && users) {
                const userMap = users.reduce((acc, user) => {
                    acc[user.id] = user;
                    return acc;
                }, {});

                enhancedNotifications = enhancedNotifications.map(notification => ({
                    ...notification,
                    user: userMap[notification.user_id] || { email: 'Unknown User' }
                }));
            }
        }
      }

      return { data: enhancedNotifications, count };
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
      toast({
        title: "Error fetching notifications",
        description: err.message,
        variant: "destructive"
      });
      return { data: [], count: 0 };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const sendNotification = async (notificationData) => {
    try {
      setLoading(true);
      let userId = notificationData.userId;
      
      if (!userId && notificationData.email) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', notificationData.email)
            .single();
            
          if (userError || !userData) throw new Error("User not found with this email");
          userId = userData.id;
      }

      if (!userId) throw new Error("Recipient is required");

      const { error: sendError } = await supabase
        .from('user_notifications')
        .insert({
          user_id: userId,
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type || 'system',
          is_read: false
        });

      if (sendError) throw sendError;

      toast({ title: "Success", description: "Notification sent successfully" });
      return true;
    } catch (err) {
      console.error('Error sending notification:', err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const { error } = await supabase.from('user_notifications').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Notification deleted" });
      return true;
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return false;
    }
  };

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return false;
    }
  };

  const markAsUnread = async (id) => {
    try {
        const { error } = await supabase
          .from('user_notifications')
          .update({ is_read: false })
          .eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
        return false;
      }
  };

  const bulkDelete = async (ids) => {
    try {
      const { error } = await supabase.from('user_notifications').delete().in('id', ids);
      if (error) throw error;
      toast({ title: "Success", description: `${ids.length} notifications deleted` });
      return true;
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return false;
    }
  };

  const bulkMarkAsRead = async (ids) => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .in('id', ids);
      if (error) throw error;
      toast({ title: "Success", description: `${ids.length} notifications marked as read` });
      return true;
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return false;
    }
  };

  return {
    loading,
    error,
    fetchNotifications,
    sendNotification,
    deleteNotification,
    markAsRead,
    markAsUnread,
    bulkDelete,
    bulkMarkAsRead
  };
};