import { supabase } from '@/lib/customSupabaseClient';

export const chatbotAdminService = {
  // Intents
  getIntents: async ({ page = 1, pageSize = 10, search = '', status, category, chatbotId }) => {
    try {
      let query = supabase
        .from('chatbot_intents')
        .select('*', { count: 'exact' });

      if (chatbotId) query = query.eq('chatbot_id', chatbotId);
      if (search) query = query.ilike('name', `%${search}%`);
      if (status) query = query.eq('status', status);
      if (category) query = query.eq('category', category);

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error fetching intents:', error);
      return { data: [], count: 0 };
    }
  },

  createIntent: async (intent) => {
    try {
      const { data, error } = await supabase.from('chatbot_intents').insert(intent).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating intent:', error);
      throw error;
    }
  },

  updateIntent: async (id, updates) => {
    try {
      const { data, error } = await supabase.from('chatbot_intents').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating intent:', error);
      throw error;
    }
  },

  deleteIntent: async (id) => {
    try {
      const { error } = await supabase.from('chatbot_intents').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting intent:', error);
      throw error;
    }
  },

  // Responses
  getResponses: async ({ page = 1, pageSize = 10, search = '', status, priority, chatbotId }) => {
    try {
      let query = supabase
        .from('chatbot_responses')
        .select(`
          *,
          intent:chatbot_intents(name)
        `, { count: 'exact' });

      if (chatbotId) query = query.eq('chatbot_id', chatbotId);
      if (search) query = query.ilike('text', `%${search}%`);
      if (status) query = query.eq('status', status);
      if (priority) query = query.eq('priority', priority);

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error fetching responses:', error);
      return { data: [], count: 0 };
    }
  },

  createResponse: async (response) => {
    try {
      const { data, error } = await supabase.from('chatbot_responses').insert(response).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating response:', error);
      throw error;
    }
  },

  updateResponse: async (id, updates) => {
    try {
      const { data, error } = await supabase.from('chatbot_responses').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating response:', error);
      throw error;
    }
  },

  deleteResponse: async (id) => {
    try {
      const { error } = await supabase.from('chatbot_responses').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting response:', error);
      throw error;
    }
  },

  // Conversations
  getConversations: async ({ page = 1, pageSize = 15, search = '', status, dateRange, chatbotId }) => {
    try {
      let query = supabase
        .from('chatbot_conversations')
        .select(`
          *,
          messages:chatbot_messages(content, created_at, sender_type)
        `, { count: 'exact' });

      if (chatbotId) query = query.eq('chatbot_id', chatbotId);
      if (status) query = query.eq('status', status);
      
      if (dateRange) {
          const now = new Date();
          if (dateRange === '7days') {
              const date = new Date(now.setDate(now.getDate() - 7));
              query = query.gte('created_at', date.toISOString());
          } else if (dateRange === '30days') {
              const date = new Date(now.setDate(now.getDate() - 30));
              query = query.gte('created_at', date.toISOString());
          }
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return { data: [], count: 0 };
    }
  },

  deleteConversation: async (id) => {
    try {
      const { error } = await supabase.from('chatbot_conversations').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  archiveConversation: async (id) => {
    try {
      const { error } = await supabase.from('chatbot_conversations').update({ status: 'archived' }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error archiving conversation:', error);
      throw error;
    }
  },
  
  // Settings
  getSettings: async (chatbotId) => {
    try {
      // Use maybeSingle() to avoid PGRST116 when no settings exist
      const { data, error } = await supabase
        .from('chatbot_settings')
        .select('*')
        .eq('chatbot_id', chatbotId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching settings:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Unexpected error fetching settings:', error);
      return null;
    }
  },

  createSettings: async (settings) => {
    try {
      const { data, error } = await supabase
        .from('chatbot_settings')
        .insert(settings)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating settings:', error);
      throw error;
    }
  },
  
  updateSettings: async (chatbotId, settings) => {
    try {
      // Use upsert to safely handle both update and insert cases
      const { data, error } = await supabase
        .from('chatbot_settings')
        .upsert({ 
          chatbot_id: chatbotId, 
          ...settings,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Analytics
  getAnalytics: async (chatbotId, dateRange) => {
    try {
      // Return a safe default structure
      return {
          totalConversations: 0,
          activeConversations: 0,
          resolvedConversations: 0,
          avgDuration: '00:00',
          avgResponseTime: 0,
          satisfactionRating: 0,
          trends: [],
          topIntents: [],
          satisfactionTrend: []
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }
};