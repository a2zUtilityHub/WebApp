/**
 * Utility for handling chatbot-related errors and providing default values.
 * This helps avoid app crashes when settings are missing or API calls fail.
 */

// Default settings object to use when DB records are missing
export const DEFAULT_SETTINGS = {
  language: 'en',
  response_timeout: 30,
  error_handling: {
    fallback_message: "I'm sorry, I didn't understand that. Could you please rephrase?",
    max_retries: 3
  },
  logging_enabled: true,
  security_settings: {
    profanity_filter: true,
    max_message_length: 500
  },
  custom_settings: {
    bot_name: 'AI Assistant',
    greeting_message: 'Hello! How can I help you today?',
    enable_typing_indicator: true,
    enable_read_receipts: false,
    theme_color: '#3b82f6'
  }
};

/**
 * Returns a safe default settings object for a given chatbot ID.
 * @param {string} chatbotId - The ID of the chatbot
 * @returns {object} Default settings object
 */
export const getDefaultChatbotSettings = (chatbotId) => {
  return {
    chatbot_id: chatbotId,
    ...DEFAULT_SETTINGS,
    // Ensure nested objects are cloned to avoid reference issues
    error_handling: { ...DEFAULT_SETTINGS.error_handling },
    security_settings: { ...DEFAULT_SETTINGS.security_settings },
    custom_settings: { ...DEFAULT_SETTINGS.custom_settings }
  };
};

/**
 * Checks if an error is a "Rows not found" error (PGRST116).
 * @param {object} error - The error object from Supabase
 * @returns {boolean} True if error is PGRST116
 */
export const isChatbotSettingsMissing = (error) => {
  return error && (error.code === 'PGRST116' || error.details?.includes('0 rows'));
};

/**
 * Checks if an error is a database constraint violation (e.g., duplicate key).
 * @param {object} error - The error object
 * @returns {boolean} True if error is a constraint violation
 */
export const isConstraintError = (error) => {
  return error && (error.code === '23505' || error.code === '42P10');
};

/**
 * Centralized error handler for chatbot operations.
 * Logs errors appropriately and returns null instead of throwing, 
 * allowing the UI to degrade gracefully.
 * @param {object} error - The error object
 * @param {string} context - Description of where the error occurred
 * @returns {null} Always returns null
 */
export const handleChatbotError = (error, context = 'Chatbot Operation') => {
  if (!error) return null;

  // Don't log "missing settings" as an error, just a warning or info
  if (isChatbotSettingsMissing(error)) {
    console.debug(`${context}: Settings not found (PGRST116). Using defaults.`);
    return null;
  }

  console.error(`${context} Failed:`, error.message || error);
  return null;
};