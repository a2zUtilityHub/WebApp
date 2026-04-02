import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotBubble = ({ isOpen, onClick, unreadCount, settings }) => {
    return (
        <motion.button
            onClick={onClick}
            className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[45] flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <AnimatePresence mode="wait">
                {isOpen ? (
                    <motion.div
                        key="close"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                    >
                        <X className="h-6 w-6" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="open"
                        initial={{ opacity: 0, rotate: 90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -90 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                    >
                        <MessageSquare className="h-6 w-6" />
                        {unreadCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                {unreadCount}
                            </span>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default ChatbotBubble;