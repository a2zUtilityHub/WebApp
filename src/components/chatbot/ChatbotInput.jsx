import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotInput = ({ onSend, isLoading, settings }) => {
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const { toast } = useToast();
    
    // Feature flags
    const enableFileUploads = settings?.enable_file_uploads !== false;

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast({
                    title: "File too large",
                    description: "Please select a file smaller than 5MB.",
                    variant: "destructive"
                });
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async () => {
        if ((!message.trim() && !file) || isLoading) return;
        
        await onSend(message, file);
        setMessage('');
        setFile(null);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const autoResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.value ? `${Math.min(e.target.scrollHeight, 120)}px` : 'auto';
        setMessage(e.target.value);
    };

    return (
        <div className="p-4 bg-background border-t">
            <AnimatePresence>
                {file && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mb-2 p-2 bg-muted rounded-lg flex items-center justify-between text-xs"
                    >
                        <div className="flex items-center gap-2 truncate max-w-[200px]">
                            {file.type.startsWith('image/') ? <ImageIcon className="h-4 w-4 text-blue-500"/> : <Paperclip className="h-4 w-4 text-orange-500"/>}
                            <span className="truncate">{file.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" onClick={() => setFile(null)}>
                            <X className="h-3 w-3" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="flex items-end gap-2 bg-muted/50 p-1.5 rounded-2xl border focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                {enableFileUploads && (
                    <>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                            accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-full text-muted-foreground hover:text-brand-primary shrink-0 mb-0.5"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                        >
                            <Paperclip className="h-4 w-4" />
                        </Button>
                    </>
                )}
                
                <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={autoResize}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question..."
                    className="min-h-[36px] max-h-[120px] bg-transparent border-0 focus-visible:ring-0 px-2 py-2 resize-none text-sm"
                    disabled={isLoading}
                    rows={1}
                />
                
                <Button 
                    size="icon" 
                    className={`h-9 w-9 rounded-full shrink-0 mb-0.5 transition-all ${
                        message.trim() || file 
                            ? 'bg-brand-primary text-white hover:bg-brand-secondary' 
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                    onClick={handleSubmit}
                    disabled={isLoading || (!message.trim() && !file)}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
};

export default ChatbotInput;