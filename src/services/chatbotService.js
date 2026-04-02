import { supabase } from '@/lib/customSupabaseClient';
import { IntentMatcher } from '@/utils/IntentMatcher';
import { ResponseFormatter } from '@/utils/ResponseFormatter';
import { getDefaultChatbotSettings, handleChatbotError } from '@/utils/chatbotErrorHandler';

export const chatbotService = {
  // 1. Fetch Settings
  async fetchChatbotSettings(chatbotId) {
    if (!chatbotId) return null;
    try {
      const { data, error } = await supabase
        .from('chatbot_settings')
        .select('*')
        .eq('chatbot_id', chatbotId)
        .maybeSingle(); 

      if (error) throw error;
      
      return data || getDefaultChatbotSettings(chatbotId);
    } catch (error) {
      handleChatbotError(error, 'fetchChatbotSettings');
      return getDefaultChatbotSettings(chatbotId);
    }
  },

  // 2. Fetch Intents
  async fetchIntents(chatbotId) {
    if (!chatbotId) return [];
    try {
      const { data, error } = await supabase
        .from('chatbot_intents')
        .select('*')
        .eq('chatbot_id', chatbotId)
        .eq('status', 'active');

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleChatbotError(error, 'fetchIntents');
      return [];
    }
  },

  // 3. Fetch Responses
  async fetchResponses(intentId) {
    if (!intentId) return [];
    try {
      const { data, error } = await supabase
        .from('chatbot_responses')
        .select('*')
        .eq('intent_id', intentId)
        .eq('status', 'active')
        .order('priority', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleChatbotError(error, 'fetchResponses');
      return [];
    }
  },

  // 4. Match Intent
  matchIntentFromMessage(message, intents) {
    return IntentMatcher.combinedMatcher(message, intents);
  },

  // 5. Select Response
  selectResponseForIntent(responses) {
    if (!responses || responses.length === 0) return null;
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    if (randomResponse.variations && randomResponse.variations.length > 0) {
      const allOptions = [randomResponse.text, ...randomResponse.variations];
      const selectedText = allOptions[Math.floor(Math.random() * allOptions.length)];
      return { ...randomResponse, text: selectedText };
    }

    return randomResponse;
  },

  // 6. Apply Conditions
  applyResponseConditions(response, context) {
    if (!response.conditions || Object.keys(response.conditions).length === 0 || response.conditions.length === 0) return true;
    return true;
  },

  // 7. Apply Actions
  applyResponseActions(response, context) {
    if (!response.actions) return;
    return response.actions;
  },

  // 8. Format Response
  formatResponse(response, context) {
    if (!response) return null;
    const formattedText = ResponseFormatter.formatResponse(response.text, context);
    return { ...response, text: formattedText };
  },

  // 9. Save Conversation
  async saveConversation(chatbotId, userId, status = 'active') {
    if (!chatbotId) return null;

    try {
      const payload = {
          chatbot_id: chatbotId,
          user_id: userId || null, 
          status: status,
          created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('chatbot_conversations')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleChatbotError(error, 'saveConversation');
      // Return a temporary ID so the UI doesn't break completely
      return { id: 'temp-' + Date.now(), is_temporary: true }; 
    }
  },

  // 10. Save Message
  async saveMessage(conversationId, senderId, senderType, content, messageType = 'text') {
    if (!conversationId) return null;
    
    try {
      const { data, error } = await supabase
        .from('chatbot_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          sender_type: senderType,
          content: content,
          message_type: messageType,
          status: 'sent',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleChatbotError(error, 'saveMessage');
      return null;
    }
  },

  // 11. Load History
  async loadConversationHistory(conversationId) {
    if (!conversationId) return [];
    try {
      const { data, error } = await supabase
        .from('chatbot_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleChatbotError(error, 'loadConversationHistory');
      return [];
    }
  },

  // 12. Update Metadata
  async updateConversationMetadata(conversationId, updates) {
    if (!conversationId) return;
    try {
      const { error } = await supabase
        .from('chatbot_conversations')
        .update(updates)
        .eq('id', conversationId);

      if (error) throw error;
    } catch (error) {
      handleChatbotError(error, 'updateConversationMetadata');
    }
  },

  // 13. Track Analytics
  async trackAnalytics(chatbotId, eventType, eventData) {
    // Placeholder for analytics implementation
  },
  
  // 14. Fallback
  async fetchFallbackResponse(chatbotId) {
     if (!chatbotId) return { text: "I'm sorry, I'm having trouble responding right now." };
     
     try {
       const { data, error } = await supabase
          .from('chatbot_responses')
          .select('*')
          .eq('chatbot_id', chatbotId)
          .is('intent_id', null)
          .limit(1)
          .maybeSingle();
          
       if (error) throw error;
       if (data) return data;
       
       // Fallback to settings
       const settings = await this.fetchChatbotSettings(chatbotId);
       return { 
         text: settings?.error_handling?.fallback_message || 
               settings?.fallback_message || 
               "I'm not sure I understand. Could you rephrase that?" 
       };
     } catch (error) {
       handleChatbotError(error, 'fetchFallbackResponse');
       return { text: "I'm having technical difficulties. Please try again later." };
     }
  }
};