import React, { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useChatbot } from '@/hooks/useChatbot';
import ChatbotBubble from './ChatbotBubble';
import ChatbotHeader from './ChatbotHeader';
import ChatbotInput from './ChatbotInput';
import ChatbotMessage from './ChatbotMessage';
import { Card } from '@/components/ui/card';

const ChatbotWidget = ({ chatbotId }) => {
    const { 
        isOpen, 
        isMinimized, 
        messages, 
        isLoading, 
        isTyping,
        settings,
        toggleChat, 
        minimizeChat, 
        sendMessage, 
        clearChat,
        setIsOpen,
        initializeChatbot
    } = useChatbot(chatbotId);

    const messagesEndRef = useRef(null);

    // This will now safely run exactly once due to the hook fixes
    useEffect(() => {
        initializeChatbot();
    }, [initializeChatbot]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    return (
        <>
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                        className="fixed bottom-[88px] md:bottom-24 right-4 md:right-8 z-[50] w-[calc(100vw-32px)] max-w-[400px]"
                    >
                        <Card className="flex flex-col h-[60vh] min-h-[400px] max-h-[600px] shadow-2xl border-0 rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md ring-1 ring-gray-200">
                            <ChatbotHeader 
                                settings={settings}
                                onMinimize={minimizeChat} 
                                onClose={() => setIsOpen(false)}
                                onClear={clearChat}
                            />
                            
                            <div className="flex-1 overflow-y-auto p-4 scroll-smooth bg-gray-50/50">
                                {messages.map((msg) => (
                                    <ChatbotMessage 
                                        key={msg.id} 
                                        message={msg} 
                                        settings={settings}
                                        onClose={() => setIsOpen(false)}
                                    />
                                ))}
                                
                                {isTyping && (
                                    <div className="flex gap-3 mb-4">
                                        <div className="h-8 w-8 rounded-full bg-brand-primary/10 animate-pulse shrink-0" />
                                        <div className="space-y-2 max-w-[70%]">
                                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <ChatbotInput 
                                onSend={sendMessage} 
                                isLoading={isLoading || isTyping} 
                                settings={settings}
                            />
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <ChatbotBubble 
                isOpen={isOpen && !isMinimized} 
                onClick={isMinimized ? minimizeChat : toggleChat}
                unreadCount={0}
                settings={settings}
            />
        </>
    );
};

export default ChatbotWidget;