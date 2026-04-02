import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, X, MinusCircle, RefreshCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ChatbotHeader = ({ settings, onMinimize, onClose, onClear }) => {
    const botName = settings?.bot_name || 'a2zUtilityHub Assistant';
    const description = settings?.bot_description || 'Online';
    const avatarUrl = settings?.icon_url;

    return (
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-brand-primary/10 to-transparent backdrop-blur-md rounded-t-2xl">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-brand-primary flex items-center justify-center shadow-lg overflow-hidden">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Bot" className="h-full w-full object-cover" />
                        ) : (
                            <Bot className="h-6 w-6 text-white" />
                        )}
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-brand-success border-2 border-white rounded-full"></span>
                </div>
                <div>
                    <h3 className="font-bold text-sm text-foreground">{botName}</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 cursor-help">
                                    <span className="w-1.5 h-1.5 bg-brand-success rounded-full animate-pulse"></span>
                                    Online
                                </p>
                            </TooltipTrigger>
                            <TooltipContent>{description}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            
            <div className="flex items-center gap-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-brand-primary rounded-full" onClick={onClear}>
                                <RefreshCcw className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reset Chat</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full" onClick={onMinimize}>
                    <MinusCircle className="h-4 w-4" />
                </Button>
                
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default ChatbotHeader;