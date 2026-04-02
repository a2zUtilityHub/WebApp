import { chatbotSettingsService } from './chatbotSettingsService';
import { handleChatbotError } from '@/utils/chatbotErrorHandler';

/**
 * Service specifically dedicated to initializing chatbot configurations.
 * useful for app startup or when entering admin areas.
 */
export const initializeChatbotSettings = async (chatbotId) => {
    if (!chatbotId) return null;
    
    try {
        console.log(`Checking initialization for chatbot ${chatbotId}...`);
        // Leverages the safe check-then-create logic in settings service
        const settings = await chatbotSettingsService.initializeDefaultSettings(chatbotId);
        return settings;
    } catch (error) {
        return handleChatbotError(error, 'initializeChatbotSettings');
    }
};

/**
 * Batch initialization for multiple chatbots if needed
 */
export const initializeAllChatbots = async (chatbotIds) => {
    if (!chatbotIds || !Array.isArray(chatbotIds)) return;
    
    console.log(`Initializing ${chatbotIds.length} chatbots...`);
    const results = await Promise.allSettled(
        chatbotIds.map(id => initializeChatbotSettings(id))
    );
    
    return results;
};