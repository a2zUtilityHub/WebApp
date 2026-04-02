import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useSEO = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchSEOSettings = useCallback(async (pageId) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('seo_settings').select('*').eq('page_id', pageId).maybeSingle();
            if (error) throw error;
            return data;
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
            return null;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const updateSEOSettings = async (pageId, settings) => {
        setLoading(true);
        try {
            // Upsert based on page_id if unique constraint exists, else check exist
            const { data: existing } = await supabase.from('seo_settings').select('id').eq('page_id', pageId).maybeSingle();
            
            let query;
            if (existing) {
                query = supabase.from('seo_settings').update(settings).eq('id', existing.id);
            } else {
                query = supabase.from('seo_settings').insert({ ...settings, page_id: pageId });
            }
            
            const { data, error } = await query.select().single();
            if (error) throw error;
            toast({ title: 'Success', description: 'SEO settings saved' });
            return data;
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { loading, fetchSEOSettings, updateSEOSettings };
};