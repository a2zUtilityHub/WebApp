import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { retryWithBackoff } from '@/utils/supabaseErrorHandler';

export const useSupport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTickets = useCallback(async ({ status, priority, categoryId, searchQuery, page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc' } = {}) => {
    if (!user) return { tickets: [], count: 0 };
    try {
      setLoading(true);
      setError(null);
      return await retryWithBackoff(async () => {
        let query = supabase.from('support_tickets').select(`*, support_categories(name, slug)`, { count: 'exact' });
        if (status && status !== 'all') query = query.eq('status', status);
        if (priority && priority !== 'all') query = query.eq('priority', priority);
        if (categoryId && categoryId !== 'all') query = query.eq('category_id', categoryId);
        if (searchQuery) query = query.or(`subject.ilike.%${searchQuery}%,id.eq.${!isNaN(searchQuery) ? searchQuery : -1}`);

        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, error: fetchError, count } = await query;
        if (fetchError) throw fetchError;
        return { tickets: data, count };
      });
    } catch (err) {
      setError(err.message);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return { tickets: [], count: 0 };
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  const getTicketDetail = useCallback(async (ticketId) => {
    if (!user) return null;
    try {
      setLoading(true);
      return await retryWithBackoff(async () => {
        const { data: ticket, error: ticketError } = await supabase.from('support_tickets').select(`*, support_categories(name, slug)`).eq('id', ticketId).single();
        if (ticketError) throw ticketError;

        const { data: messages, error: messagesError } = await supabase.from('support_messages').select(`*, profiles:user_id (first_name, last_name, avatar_url, role_id)`).eq('ticket_id', ticketId).order('created_at', { ascending: true });
        if (messagesError) throw messagesError;

        return { ticket, messages };
      });
    } catch (err) {
      setError(err.message);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  const createTicket = useCallback(async (ticketData) => {
    if (!user) return;
    try {
      setLoading(true);
      return await retryWithBackoff(async () => {
        const { data, error } = await supabase.from('support_tickets').insert({ ...ticketData, user_id: user.id, status: 'Open' }).select().single();
        if (error) throw error;
        return data;
      });
    } catch (err) {
      setError(err.message);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const replyToTicket = useCallback(async ({ ticketId, message, file }) => {
    if (!user) return;
    try {
      setLoading(true);
      return await retryWithBackoff(async () => {
        let fileUrl = null;
        if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${ticketId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `support-attachments/${fileName}`;
          const { error: uploadError } = await supabase.storage.from('public_uploads').upload(filePath, file);
          if (uploadError) throw uploadError;
          const { data: { publicUrl } } = supabase.storage.from('public_uploads').getPublicUrl(filePath);
          fileUrl = publicUrl;
        }

        const { data, error } = await supabase.from('support_messages').insert({ ticket_id: ticketId, user_id: user.id, message, file_url: fileUrl }).select().single();
        if (error) throw error;
        return data;
      });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const updateTicketStatus = useCallback(async (ticketId, status) => {
    if (!user) return;
    try {
      setLoading(true);
      await retryWithBackoff(async () => {
        const { error } = await supabase.from('support_tickets').update({ status, updated_at: new Date() }).eq('id', ticketId);
        if (error) throw error;
      });
      toast({ title: 'Success', description: `Ticket marked as ${status}` });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  const getCategories = useCallback(async () => {
    try {
      return await retryWithBackoff(async () => {
        const { data, error } = await supabase.from('support_categories').select('*');
        if (error) throw error;
        return data || [];
      });
    } catch (err) {
      return [];
    }
  }, []);

  return { getTickets, getTicketDetail, createTicket, replyToTicket, updateTicketStatus, getCategories, loading, error };
};