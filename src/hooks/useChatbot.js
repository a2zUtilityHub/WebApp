import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { chatbotService } from '@/services/chatbotService';
import { getDefaultChatbotSettings } from '@/utils/chatbotErrorHandler';

export const useChatbot = (chatbotIdProp) => {
    // We pull in user and profile to answer "who am I?" type questions
    const { user, profile } = useAuth();
    const { toast } = useToast();
    
    // UI State
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    
    // Rock-Solid Local Storage Sync
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem('chat-history');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [conversationId, setConversationId] = useState(() => {
         return localStorage.getItem('chat-conversation-id') || null;
    });

    const [settings, setSettings] = useState(null);
    const [intents, setIntents] = useState([]);
    const [chatbotId, setChatbotId] = useState(chatbotIdProp);
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        localStorage.setItem('chat-history', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        if (conversationId) localStorage.setItem('chat-conversation-id', conversationId);
        else localStorage.removeItem('chat-conversation-id');
    }, [conversationId]);

    const initializeChatbot = useCallback(async () => {
        if (hasInitialized) return; 
        
        setIsLoading(true);
        try {
            let targetId = chatbotId;
            if (!targetId) {
                const { data: bots } = await supabase.from('chatbots').select('id').limit(1).maybeSingle();
                if (bots) targetId = bots.id;
            }
            
            if (targetId) {
                setChatbotId(targetId);
                const [fetchedSettings, fetchedIntents] = await Promise.all([
                    chatbotService.fetchChatbotSettings(targetId),
                    chatbotService.fetchIntents(targetId)
                ]);
                
                const safeSettings = fetchedSettings || getDefaultChatbotSettings(targetId);
                setSettings(safeSettings);
                setIntents(fetchedIntents || []);
                
                setMessages(prev => {
                    if (prev && prev.length > 0) return prev; 
                    const welcomeMsg = safeSettings.custom_settings?.greeting_message || safeSettings.greeting_message || "Hello! I can help with your account details, tickets, coupons, or finding apps. How can I assist?";
                    return [{
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: welcomeMsg,
                        timestamp: new Date().toISOString()
                    }];
                });
            }
            setHasInitialized(true);
        } catch (error) {
            console.error("Initialization error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [hasInitialized, chatbotId]);

    const sendMessage = async (content, file = null) => {
        if ((!content.trim() && !file) || isLoading) return;

        // 1. Show User Message Instantly
        const userMsgId = Date.now().toString() + '-user';
        setMessages(prev => [...prev, {
            id: userMsgId,
            role: 'user',
            content: content,
            timestamp: new Date().toISOString()
        }]);
        
        setIsTyping(true);

        try {
            const query = content.toLowerCase();
            let finalResponse = null;

            // 2. EXPANDED INTELLIGENCE (Handles the questions from your screenshots)
            
            // Profile & Identity Queries
            if (query.includes('my name') || query.includes('who am i')) {
                const name = profile?.full_name || user?.user_metadata?.full_name;
                finalResponse = name 
                    ? `Your name is ${name}.` 
                    : "I don't have your name on file. You can update it in your Dashboard settings!";
            } 
            else if (query.includes('my email')) {
                finalResponse = user?.email 
                    ? `Your registered email is ${user.email}.` 
                    : "I can't seem to find your email. Are you sure you are logged in?";
            }
            // App & Cost Queries (Like Barcode generator)
            else if (query.includes('cost') || query.includes('price') || query.includes('app') || query.includes('generator')) {
                finalResponse = "To find the specific cost or details of an app (like a barcode generator), please use the search bar on our 'Apps' or 'Store' pages. I don't have real-time pricing data loaded in this chat window!";
            }
            // Standard Core Tasks
            else if (query.includes('account') || query.includes('setting')) {
                finalResponse = "To view your account details, please head over to your Dashboard. You can find your profile settings and order history there.";
            } 
            else if (query.includes('ticket') || query.includes('status') || query.includes('support') || query.includes('issue')) {
                finalResponse = "You can check your ticket status in the 'Support' section. If you have a ticket ID, you can also contact our Patna, Bihar office directly for immediate assistance.";
            } 
            else if (query.includes('coupon') || query.includes('promo') || query.includes('discount')) {
                finalResponse = "I found some great deals! Check out our 'Coupons' page for the latest offers on Amazon, Flipkart, MakeMyTrip, and more.";
            }

            // 3. DATABASE MATCHING (If not caught by hardcoded logic)
            if (!finalResponse) {
                const matchedIntent = chatbotService.matchIntentFromMessage(content, intents);
                if (matchedIntent) {
                    const responses = await chatbotService.fetchResponses(matchedIntent.id);
                    const rawResponse = chatbotService.selectResponseForIntent(responses);
                    if (rawResponse && chatbotService.applyResponseConditions(rawResponse, { user, profile })) {
                        const formatted = chatbotService.formatResponse(rawResponse, { user, profile });
                        finalResponse = formatted?.text;
                    }
                }
            }

            // 4. FRIENDLIER FALLBACK
            if (!finalResponse) {
                // If it hits this point, the bot truly doesn't know the answer.
                finalResponse = "I'm still learning! I can currently help you check your profile info (name/email), ticket status, find coupons, or guide you to our apps. Could you try asking about one of those?";
            }

            // 5. Update UI
            setTimeout(async () => {
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + '-bot',
                    role: 'assistant',
                    content: finalResponse,
                    timestamp: new Date().toISOString()
                }]);
                setIsTyping(false);

                // 6. Background DB Sync
                try {
                    let currentConvId = conversationId;
                    if (!currentConvId && chatbotId) {
                        const conv = await chatbotService.saveConversation(chatbotId, user?.id);
                        if (conv?.id) {
                            setConversationId(conv.id);
                            currentConvId = conv.id;
                        }
                    }
                    if (currentConvId && !currentConvId.startsWith('temp')) {
                        await chatbotService.saveMessage(currentConvId, user?.id, 'user', content);
                        await chatbotService.saveMessage(currentConvId, null, 'bot', finalResponse);
                    }
                } catch (e) {
                    console.warn("Background DB sync failed", e);
                }
            }, 800);

        } catch (err) {
            console.error("SendMessage error:", err);
            setMessages(prev => [...prev, {
                id: Date.now().toString() + '-bot-err',
                role: 'assistant',
                content: "I encountered a slight network hiccup. Could you try asking me again?",
                timestamp: new Date().toISOString()
            }]);
            setIsTyping(false);
        }
    };

    const clearChat = () => {
        setConversationId(null);
        const welcomeMsg = settings?.custom_settings?.greeting_message || settings?.greeting_message || "Hello! I can help with your account details, tickets, coupons, or finding apps. How can I assist?";
        setMessages([{
            id: Date.now().toString(),
            role: 'assistant',
            content: welcomeMsg,
            timestamp: new Date().toISOString()
        }]);
        toast({ title: "Chat cleared" });
    };

    const toggleChat = () => setIsOpen(prev => !prev);
    const minimizeChat = () => setIsMinimized(prev => !prev);

    return {
        isOpen, isMinimized, messages, isLoading, isTyping, settings: settings || {}, 
        toggleChat, minimizeChat, sendMessage, clearChat, setIsOpen, initializeChatbot
    };
};