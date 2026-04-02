import { useState, useCallback } from 'react';
import { chatbotAdminService } from '@/services/chatbotAdminService';
import { chatbotSettingsService } from '@/services/chatbotSettingsService';
import { getDefaultChatbotSettings } from '@/utils/chatbotErrorHandler';
import { useToast } from '@/components/ui/use-toast';

export const useChatbotAdmin = (chatbotId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleAsync = useCallback(async (asyncFn, successMessage) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      if (successMessage) {
        toast({ title: 'Success', description: successMessage });
      }
      return result;
    } catch (err) {
      console.error(err);
      setError(err);
      toast({ title: 'Error', description: err.message || 'Operation failed', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Intents
  const fetchIntents = useCallback((params) => handleAsync(() => chatbotAdminService.getIntents({ ...params, chatbotId })), [chatbotId, handleAsync]);
  const createIntent = useCallback((data) => handleAsync(() => chatbotAdminService.createIntent({ ...data, chatbot_id: chatbotId }), 'Intent created'), [chatbotId, handleAsync]);
  const updateIntent = useCallback((id, data) => handleAsync(() => chatbotAdminService.updateIntent(id, data), 'Intent updated'), [handleAsync]);
  const deleteIntent = useCallback((id) => handleAsync(() => chatbotAdminService.deleteIntent(id), 'Intent deleted'), [handleAsync]);

  // Responses
  const fetchResponses = useCallback((params) => handleAsync(() => chatbotAdminService.getResponses({ ...params, chatbotId })), [chatbotId, handleAsync]);
  const createResponse = useCallback((data) => handleAsync(() => chatbotAdminService.createResponse({ ...data, chatbot_id: chatbotId }), 'Response created'), [chatbotId, handleAsync]);
  const updateResponse = useCallback((id, data) => handleAsync(() => chatbotAdminService.updateResponse(id, data), 'Response updated'), [handleAsync]);
  const deleteResponse = useCallback((id) => handleAsync(() => chatbotAdminService.deleteResponse(id), 'Response deleted'), [handleAsync]);

  // Conversations
  const fetchConversations = useCallback((params) => handleAsync(() => chatbotAdminService.getConversations({ ...params, chatbotId })), [chatbotId, handleAsync]);
  const deleteConversation = useCallback((id) => handleAsync(() => chatbotAdminService.deleteConversation(id), 'Conversation deleted'), [handleAsync]);
  const archiveConversation = useCallback((id) => handleAsync(() => chatbotAdminService.archiveConversation(id), 'Conversation archived'), [handleAsync]);

  // Settings with robust handling
  const fetchSettings = useCallback(async () => {
    if (!chatbotId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      // Wrapper for try-catch is inside chatbotSettingsService.getSettings too,
      // but we add another layer here for UI state management.
      const data = await chatbotSettingsService.getSettings(chatbotId);
      
      // Data should never be null due to service handling, but double check
      if (!data) {
          console.warn('Received null settings from service, using defaults.');
          return getDefaultChatbotSettings(chatbotId);
      }
      
      return data;
    } catch (err) {
      console.error("Critical error in fetchSettings hook:", err);
      setError(err);
      toast({ title: 'Warning', description: 'Using default settings due to load error.', variant: 'default' });
      return getDefaultChatbotSettings(chatbotId);
    } finally {
      setLoading(false);
    }
  }, [chatbotId, toast]);

  const updateSettings = useCallback(async (data) => {
      setLoading(true);
      setError(null);
      try {
          const result = await chatbotSettingsService.updateSettings(chatbotId, data);
          toast({ title: 'Success', description: 'Settings saved successfully' });
          return result;
      } catch (err) {
          console.error(err);
          setError(err);
          toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
          return null;
      } finally {
          setLoading(false);
      }
  }, [chatbotId, toast]);

  // Analytics
  const fetchAnalytics = useCallback((dateRange) => handleAsync(() => chatbotAdminService.getAnalytics(chatbotId, dateRange)), [chatbotId, handleAsync]);

  return {
    loading,
    error,
    fetchIntents,
    createIntent,
    updateIntent,
    deleteIntent,
    fetchResponses,
    createResponse,
    updateResponse,
    deleteResponse,
    fetchConversations,
    deleteConversation,
    archiveConversation,
    fetchSettings,
    updateSettings,
    fetchAnalytics
  };
};