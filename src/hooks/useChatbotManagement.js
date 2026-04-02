import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useChatbotManagement = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleError = (error, action) => {
        console.error(`Error ${action}:`, error);
        toast({
            title: 'Error',
            description: error.message || `Failed to ${action}`,
            variant: 'destructive',
        });
        setLoading(false);
    };

    const getChatbots = useCallback(async (filters = {}, search = '', sort = {}, page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            let query = supabase.from('chatbots').select('*', { count: 'exact' });

            if (search) {
                query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
            }

            if (filters.status?.length) query = query.in('status', filters.status);
            if (filters.type?.length) query = query.in('type', filters.type);
            if (filters.language?.length) query = query.in('language', filters.language);

            if (sort.column) {
                query = query.order(sort.column, { ascending: sort.ascending });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;
            query = query.range(from, to);

            const { data, count, error } = await query;
            if (error) throw error;
            
            setLoading(false);
            return { data, count };
        } catch (error) {
            handleError(error, 'fetch chatbots');
            return { data: [], count: 0 };
        }
    }, []);

    const createChatbot = async (data) => {
        setLoading(true);
        try {
            const { data: newChatbot, error } = await supabase.from('chatbots').insert(data).select().single();
            if (error) throw error;
            toast({ title: 'Success', description: 'Chatbot created successfully' });
            setLoading(false);
            return newChatbot;
        } catch (error) {
            handleError(error, 'create chatbot');
            return null;
        }
    };

    const updateChatbot = async (id, data) => {
        setLoading(true);
        try {
            const { data: updated, error } = await supabase.from('chatbots').update({ ...data, updated_at: new Date() }).eq('id', id).select().single();
            if (error) throw error;
            toast({ title: 'Success', description: 'Chatbot updated successfully' });
            setLoading(false);
            return updated;
        } catch (error) {
            handleError(error, 'update chatbot');
            return null;
        }
    };

    const deleteChatbot = async (id) => {
        setLoading(true);
        try {
            const { error } = await supabase.from('chatbots').delete().eq('id', id);
            if (error) throw error;
            toast({ title: 'Success', description: 'Chatbot deleted successfully' });
            setLoading(false);
            return true;
        } catch (error) {
            handleError(error, 'delete chatbot');
            return false;
        }
    };

    // Generic fetcher for sub-resources
    const getSubResource = useCallback(async (table, chatbotId, search = '') => {
        try {
            let query = supabase.from(table).select('*').eq('chatbot_id', chatbotId).order('created_at', { ascending: false });
            if (search && table === 'chatbot_knowledge_base') query = query.ilike('title', `%${search}%`);
            // Add more specific search logic per table as needed
            const { data, error } = await query;
            if (error) throw error;
            return data;
        } catch (e) {
            console.error(`Error fetching ${table}:`, e);
            return [];
        }
    }, []);

    const getConversations = (id) => getSubResource('chatbot_conversations', id);
    // Messages link to conversation, not chatbot directly usually, but if we need generic:
    // This assumes we fetch messages for a specific conversation
    const getMessages = async (conversationId) => {
        try {
            const { data, error } = await supabase.from('chatbot_messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
            if (error) throw error;
            return data;
        } catch (e) { return []; }
    };

    const getStats = async () => {
         try {
            // Mock stats for dashboard since real aggregations might be heavy
            // In production use a dedicated RPC or view
            const { count: total } = await supabase.from('chatbots').select('*', { count: 'exact', head: true });
            const { count: active } = await supabase.from('chatbots').select('*', { count: 'exact', head: true }).eq('status', 'active');
            return {
                totalChatbots: total || 0,
                activeChatbots: active || 0,
                inactiveChatbots: (total || 0) - (active || 0),
                totalConversations: 1250, // Mock
                avgResponseTime: 0.8, // Mock
                satisfactionRating: 4.5 // Mock
            };
         } catch (e) { return null; }
    };

    return {
        loading,
        getChatbots, createChatbot, updateChatbot, deleteChatbot,
        getConversations, getMessages, getStats,
        // Expose generic fetcher for specific components to use
        getSubResource
    };
};