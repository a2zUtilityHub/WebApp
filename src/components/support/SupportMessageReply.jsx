import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Paperclip, Send, Loader2, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SupportMessageReply = ({ onSend, loading }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) {
      toast({ title: "Cannot send empty message", variant: "destructive" });
      return;
    }

    await onSend({ message, file });
    setMessage('');
    setFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card border rounded-xl p-4 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="reply-message" className="sr-only">Reply Message</Label>
        <Textarea
          id="reply-message"
          placeholder="Type your reply here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px] resize-y bg-background"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
           <input
            type="file"
            id="file-attachment"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-attachment').click()}
            className="text-muted-foreground hover:text-foreground"
          >
            <Paperclip className="h-4 w-4 mr-2" />
            {file ? 'Change File' : 'Attach File'}
          </Button>
          {file && (
             <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md">
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button type="button" onClick={() => setFile(null)} className="text-muted-foreground hover:text-destructive">
                   <X className="h-3 w-3" />
                </button>
             </div>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Send Reply
        </Button>
      </div>
    </form>
  );
};

export default SupportMessageReply;