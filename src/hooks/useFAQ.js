import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { retryWithBackoff } from '@/utils/supabaseErrorHandler';

export const useFAQ = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchFAQItems = useCallback(async ({ search = '', category = 'all', status = 'all', page = 1, limit = 10 } = {}) => {
        setLoading(true);
        try {
            return await retryWithBackoff(async () => {
                let query = supabase.from('faq_items').select('*', { count: 'exact' });
                if (search) query = query.or(`question.ilike.%${search}%,answer.ilike.%${search}%`);
                if (category !== 'all') query = query.eq('category', category);
                if (status !== 'all') query = query.eq('status', status);

                const { data, count, error } = await query.order('order_index', { ascending: true }).range((page - 1) * limit, page * limit - 1);
                if (error) throw error;
                return { data, count };
            });
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
            return { data: [], count: 0 };
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleOperation = async (operation, successMessage) => {
        setLoading(true);
        try {
            const { data, error } = await retryWithBackoff(operation);
            if (error) throw error;
            if (successMessage) toast({ title: 'Success', description: successMessage });
            return { data, error: null };
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
            return { data: null, error };
        } finally {
            setLoading(false);
        }
    };

    const createFAQItem = (item) => handleOperation(() => supabase.from('faq_items').insert(item).select().single(), 'FAQ created');
    const updateFAQItem = (id, updates) => handleOperation(() => supabase.from('faq_items').update(updates).eq('id', id).select().single(), 'FAQ updated');
    const deleteFAQItem = (id) => handleOperation(() => supabase.from('faq_items').delete().eq('id', id), 'FAQ deleted');
    const fetchCategories = useCallback(async () => {
         try {
             return await retryWithBackoff(async () => {
                 const { data } = await supabase.from('faq_categories').select('*').order('name');
                 return data || [];
             });
         } catch { return []; }
    }, []);

    return { loading, fetchFAQItems, createFAQItem, updateFAQItem, deleteFAQItem, fetchCategories };
};