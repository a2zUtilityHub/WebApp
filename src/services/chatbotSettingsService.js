import { supabase } from '@/lib/customSupabaseClient';
import { getDefaultChatbotSettings, handleChatbotError } from '@/utils/chatbotErrorHandler';

/**
 * Service specifically for managing chatbot settings CRUD operations.
 * Implements defensive programming with maybeSingle() and manual check-then-write logic.
 */
export const chatbotSettingsService = {
  
  /**
   * Fetches settings for a chatbot. Returns default object if not found.
   */
  getSettings: async (chatbotId) => {
    if (!chatbotId) return null;

    try {
      const { data, error } = await supabase
        .from('chatbot_settings')
        .select('*')
        .eq('chatbot_id', chatbotId)
        .maybeSingle(); // Changed from .single() to .maybeSingle()

      if (error) {
        handleChatbotError(error, 'getSettings');
        return getDefaultChatbotSettings(chatbotId);
      }

      // If no data returned (but no error), return defaults
      if (!data) {
        return getDefaultChatbotSettings(chatbotId);
      }

      return data;
    } catch (err) {
      handleChatbotError(err, 'getSettings Exception');
      return getDefaultChatbotSettings(chatbotId);
    }
  },

  /**
   * Helper function to create default record if missing.
   * Checks existence first to prevent duplicates.
   */
  initializeDefaultSettings: async (chatbotId) => {
    if (!chatbotId) return null;

    try {
      // 1. Check if exists
      const { data: existing, error: checkError } = await supabase
        .from('chatbot_settings')
        .select('id')
        .eq('chatbot_id', chatbotId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        return chatbotSettingsService.getSettings(chatbotId);
      }

      // 2. Insert if not exists
      const defaultSettings = getDefaultChatbotSettings(chatbotId);
      const { data: newSettings, error: insertError } = await supabase
        .from('chatbot_settings')
        .insert(defaultSettings)
        .select()
        .single();

      if (insertError) throw insertError;

      return newSettings;
    } catch (err) {
      handleChatbotError(err, 'initializeDefaultSettings');
      return getDefaultChatbotSettings(chatbotId);
    }
  },

  /**
   * Updates settings. Checks existence first to decide between INSERT or UPDATE.
   * Replaces previous upsert logic to be more explicit and safe.
   */
  updateSettings: async (chatbotId, updates) => {
    if (!chatbotId) return null;

    try {
      // 1. Check existence
      const { data: existing, error: checkError } = await supabase
        .from('chatbot_settings')
        .select('id')
        .eq('chatbot_id', chatbotId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        // 2. Update existing
        const { data, error } = await supabase
          .from('chatbot_settings')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('chatbot_id', chatbotId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // 3. Insert new
        const defaultSettings = getDefaultChatbotSettings(chatbotId);
        // Merge defaults with updates
        const newSettings = {
            ...defaultSettings,
            ...updates,
            chatbot_id: chatbotId
        };

        const { data, error } = await supabase
          .from('chatbot_settings')
          .insert(newSettings)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      handleChatbotError(error, 'updateSettings');
      throw error; // Re-throw for UI to handle
    }
  },

  /**
   * Deletes settings for a chatbot.
   */
  deleteSettings: async (chatbotId) => {
    if (!chatbotId) return;

    try {
       const { error } = await supabase
         .from('chatbot_settings')
         .delete()
         .eq('chatbot_id', chatbotId);
         
       if (error) throw error;
    } catch (error) {
        handleChatbotError(error, 'deleteSettings');
    }
  }
};