import { supabase } from '@/lib/customSupabaseClient';
import { initializeChatbotSettings } from '@/services/chatbotInitializationService';

/**
 * Checks for chatbots that do not have associated settings records and creates defaults for them.
 * This is intended to be run during app initialization or via admin manual trigger.
 */
export async function seedChatbotSettings() {
  console.log('Starting chatbot settings seed check...');
  
  try {
    // 1. Get all chatbots
    const { data: chatbots, error: botError } = await supabase
      .from('chatbots')
      .select('id, name');

    if (botError) throw botError;

    if (!chatbots || chatbots.length === 0) {
      console.log('No chatbots found to seed.');
      return;
    }

    // 2. We can simply call initialize for all of them.
    // The initialize function has internal checks to prevent duplicates.
    console.log(`Checking configuration for ${chatbots.length} chatbots...`);

    const results = await Promise.allSettled(
      chatbots.map(bot => initializeChatbotSettings(bot.id))
    );

    // 3. Log results
    const successful = results.filter(r => r.status === 'fulfilled' && r.value !== null);
    
    console.log(`Initialization complete. Verified/Updated: ${successful.length}`);

  } catch (error) {
    console.error('Critical error in seedChatbotSettings:', error);
  }
}