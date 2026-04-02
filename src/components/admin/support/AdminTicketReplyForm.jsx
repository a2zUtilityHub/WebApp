import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Paperclip, X } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AdminTicketReplyForm = ({ ticketId, userId, onReplySent }) => {
  const [isSending, setIsSending] = useState(false);
  const [file, setFile] = useState(null);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose dark:prose-invert max-w-none',
      },
    },
  });

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if (!editor || editor.isEmpty) return;

    try {
      setIsSending(true);
      let fileUrl = null;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${ticketId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `support-attachments/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('public_uploads').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('public_uploads').getPublicUrl(filePath);
        fileUrl = publicUrl;
      }

      const messageContent = editor.getHTML();

      const { error } = await supabase.from('support_messages').insert({
        ticket_id: ticketId,
        user_id: userId,
        message: messageContent,
        file_url: fileUrl
      });

      if (error) throw error;

      await supabase.from('support_tickets').update({ status: 'Replied' }).eq('id', ticketId);

      toast({ title: 'Reply sent successfully' });
      editor.commands.setContent('');
      setFile(null);
      if (onReplySent) onReplySent();

    } catch (error) {
      console.error('Error sending reply:', error);
      toast({ title: 'Failed to send reply', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4 border rounded-xl p-4 bg-card shadow-sm">
       <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold">Reply to User</h4>
       </div>
       
       <EditorContent editor={editor} />
       
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <input
               type="file"
               id="admin-reply-file"
               className="hidden"
               onChange={handleFileChange}
             />
             <Button
               type="button"
               variant="outline"
               size="sm"
               onClick={() => document.getElementById('admin-reply-file').click()}
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

          <Button onClick={handleSend} disabled={isSending || editor?.isEmpty}>
             {isSending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
             Send Reply
          </Button>
       </div>
    </div>
  );
};

export default AdminTicketReplyForm;