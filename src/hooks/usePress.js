import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const usePress = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchPressReleases = useCallback(async ({ search = '', category = 'all', status = 'all', page = 1, limit = 10 } = {}) => {
        setLoading(true);
        try {
            let query = supabase.from('press_releases').select('*', { count: 'exact' });

            if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
            if (category !== 'all') query = query.eq('category', category);
            if (status !== 'all') query = query.eq('status', status);

            const { data, count, error } = await query
                .order('publication_date', { ascending: false })
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

    const savePressRelease = async (release, id = null) => {
        setLoading(true);
        try {
            const op = id 
                ? supabase.from('press_releases').update(release).eq('id', id)
                : supabase.from('press_releases').insert(release);
            
            const { data, error } = await op.select().single();
            if (error) throw error;
            toast({ title: 'Success', description: id ? 'Press release updated' : 'Press release created' });
            return { data };
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
            return { error };
        } finally {
            setLoading(false);
        }
    };
    
    const deletePressRelease = async (id) => {
        setLoading(true);
        try {
             const { error } = await supabase.from('press_releases').delete().eq('id', id);
             if (error) throw error;
             toast({ title: 'Success', description: 'Press release deleted' });
             return true;
        } catch (error) {
             toast({ title: 'Error', description: error.message, variant: 'destructive' });
             return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, fetchPressReleases, savePressRelease, deletePressRelease };
};