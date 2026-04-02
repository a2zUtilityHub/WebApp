import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useCopyright = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchCopyrightInfo = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('copyright_info').select('*').limit(1).maybeSingle();
            if (error) throw error;
            return data;
        } catch (error) {
             // Suppress no rows error for cleaner UI init
            console.error(error);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCopyrightInfo = async (info) => {
        setLoading(true);
        try {
            const { data: existing } = await supabase.from('copyright_info').select('id').limit(1).maybeSingle();
            
            let query;
            if (existing) {
                query = supabase.from('copyright_info').update(info).eq('id', existing.id);
            } else {
                query = supabase.from('copyright_info').insert(info);
            }

            const { data, error } = await query.select().single();
            if (error) throw error;
            toast({ title: 'Success', description: 'Copyright info updated' });
            return data;
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { loading, fetchCopyrightInfo, updateCopyrightInfo };
};