import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, FileText, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const ChatbotMessage = ({ message, settings, onClose }) => {
    const isBot = message.role === 'assistant';
    const navigate = useNavigate();
    const avatarUrl = settings?.icon_url;

    const formattedTime = (ts) => {
        try {
            return format(new Date(ts), 'HH:mm');
        } catch { return ''; }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={cn("flex gap-3 w-full mb-4", isBot ? "justify-start" : "justify-end")}
        >
            {isBot && (
                <Avatar className="h-8 w-8 shrink-0 border border-primary/20 bg-primary/10 shadow-sm">
                     {avatarUrl ? (
                         <AvatarImage src={avatarUrl} />
                     ) : (
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground"><Bot className="h-4 w-4" /></AvatarFallback>
                     )}
                </Avatar>
            )}

            <div className={cn("flex flex-col max-w-[85%]", isBot ? "items-start" : "items-end")}>
                <div 
                    className={cn(
                        "rounded-2xl px-4 py-3 text-[15px] shadow-sm relative",
                        isBot 
                            ? "bg-muted/30 backdrop-blur-md text-foreground rounded-tl-sm border border-border/50" 
                            : "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-sm shadow-md"
                    )}
                >
                    <div className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                    </div>

                    {message.fileUrl && (
                        <a 
                            href={message.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={cn(
                                "flex items-center gap-2 mt-3 p-2 rounded-lg text-xs font-medium transition-colors",
                                isBot 
                                    ? "bg-background hover:bg-background/80 border" 
                                    : "bg-white/10 hover:bg-white/20 border-white/20"
                            )}
                        >
                            <FileText className="h-4 w-4" />
                            <span className="truncate max-w-[150px]">Attachment</span>
                            <Download className="h-3 w-3 ml-auto opacity-70" />
                        </a>
                    )}
                </div>
                
                <span className="text-[10px] text-muted-foreground mt-1 px-1 opacity-70">
                    {formattedTime(message.timestamp)}
                </span>
            </div>

            {!isBot && (
                <Avatar className="h-8 w-8 shrink-0 border border-brand-secondary/20 bg-gray-100">
                    <AvatarFallback className="bg-transparent text-gray-600"><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
            )}
        </motion.div>
    );
};

export default ChatbotMessage;