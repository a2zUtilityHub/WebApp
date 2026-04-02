import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useCareers = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchJobPostings = useCallback(async ({ search = '', job_type = 'all', location = 'all', status = 'all', page = 1, limit = 10 } = {}) => {
        setLoading(true);
        try {
            let query = supabase.from('job_postings').select('*', { count: 'exact' });

            if (search) query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
            if (job_type !== 'all') query = query.eq('job_type', job_type);
            if (status !== 'all') query = query.eq('status', status);
            // location filter logic would depend on exact match or like
            if (location !== 'all') query = query.ilike('location', `%${location}%`);

            const { data, count, error } = await query
                .order('created_at', { ascending: false })
                .range((page - 1) * limit, page * limit - 1);

            if (error) throw error;
            return { data, count };
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
            return { data: [], count: 0 };
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const saveJobPosting = async (job, id = null) => {
        setLoading(true);
        try {
            const op = id 
                ? supabase.from('job_postings').update(job).eq('id', id)
                : supabase.from('job_postings').insert(job);
            
            const { data, error } = await op.select().single();
            if (error) throw error;
            toast({ title: 'Success', description: id ? 'Job updated' : 'Job posted' });
            return { data };
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
            return { error };
        } finally {
            setLoading(false);
        }
    };
    
    const deleteJobPosting = async (id) => {
        setLoading(true);
        try {
             const { error } = await supabase.from('job_postings').delete().eq('id', id);
             if (error) throw error;
             toast({ title: 'Success', description: 'Job posting deleted' });
             return true;
        } catch (error) {
             toast({ title: 'Error', description: error.message, variant: 'destructive' });
             return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, fetchJobPostings, saveJobPosting, deleteJobPosting };
};