import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { retryWithBackoff } from '@/utils/supabaseErrorHandler';

export const useTestimonials = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchTestimonials = useCallback(async ({ search = '', status = 'all', rating = 'all', page = 1, limit = 10 } = {}) => {
        setLoading(true);
        try {
            return await retryWithBackoff(async () => {
                let query = supabase.from('testimonials').select('*', { count: 'exact' });
                if (search) query = query.or(`author_name.ilike.%${search}%,content.ilike.%${search}%`);
                if (status !== 'all') query = query.eq('status', status);
                if (rating !== 'all') query = query.eq('rating', parseInt(rating));

                const from = (page - 1) * limit;
                const to = from + limit - 1;

                const { data, count, error } = await query.order('sort_order', { ascending: true }).order('created_at', { ascending: false }).range(from, to);
                if (error) throw error;
                return { data, count };
            }, { context: 'fetchTestimonials' });
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
            const result = await retryWithBackoff(operation);
            if (result.error) throw result.error;
            if (successMessage) toast({ title: 'Success', description: successMessage });
            return { data: result.data, error: null };
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
            return { data: null, error };
        } finally {
            setLoading(false);
        }
    };

    const createTestimonial = (t) => handleOperation(() => supabase.from('testimonials').insert(t).select().single(), 'Testimonial created');
    const updateTestimonial = (id, u) => handleOperation(() => supabase.from('testimonials').update(u).eq('id', id).select().single(), 'Testimonial updated');
    const deleteTestimonial = (id) => handleOperation(() => supabase.from('testimonials').delete().eq('id', id), 'Testimonial deleted');
    
    const bulkDelete = async (ids) => {
        setLoading(true);
        try {
            await retryWithBackoff(async () => {
                const { error } = await supabase.from('testimonials').delete().in('id', ids);
                if (error) throw error;
            });
            toast({ title: 'Success', description: `${ids.length} testimonials deleted` });
            return true;
        } catch (error) {
             toast({ title: 'Error', description: error.message, variant: 'destructive' });
             return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, bulkDelete };
};