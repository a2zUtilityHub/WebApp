import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Lock, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const AdminNotes = ({ ticketId }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [ticketId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_notes')
        .select(`
          *,
          profiles:author_id(first_name, last_name, avatar_url)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching admin notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('admin_notes')
        .insert({
          ticket_id: ticketId,
          author_id: user.id,
          note: newNote.trim()
        });

      if (error) throw error;
      
      setNewNote('');
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-amber-50/50 dark:bg-amber-950/10 border-amber-200/50 dark:border-amber-900/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-900 dark:text-amber-500">
           <Lock className="h-3.5 w-3.5" />
           Internal Admin Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Notes List */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
           {loading ? (
             <div className="text-xs text-muted-foreground text-center py-2">Loading notes...</div>
           ) : notes.length === 0 ? (
             <div className="text-xs text-muted-foreground text-center py-2 italic">No internal notes yet.</div>
           ) : (
             notes.map((note) => (
                <div key={note.id} className="flex gap-3 text-sm group">
                   <Avatar className="h-6 w-6 mt-0.5">
                      <AvatarImage src={note.profiles?.avatar_url} />
                      <AvatarFallback className="text-[10px]">{note.profiles?.first_name?.[0]}</AvatarFallback>
                   </Avatar>
                   <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                         <span className="font-semibold text-xs text-foreground">
                            {note.profiles?.first_name} {note.profiles?.last_name}
                         </span>
                         <span className="text-[10px] text-muted-foreground">
                            {format(new Date(note.created_at), 'MMM d, h:mm a')}
                         </span>
                      </div>
                      <p className="text-muted-foreground bg-background/50 p-2 rounded-md border border-amber-100 dark:border-amber-900/30">
                         {note.note}
                      </p>
                   </div>
                </div>
             ))
           )}
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="flex flex-col gap-2">
           <Textarea 
             placeholder="Add an internal note (visible only to admins)..." 
             className="min-h-[80px] bg-background text-sm resize-none focus-visible:ring-amber-500/20"
             value={newNote}
             onChange={(e) => setNewNote(e.target.value)}
           />
           <Button 
             type="submit" 
             size="sm" 
             variant="outline" 
             className="self-end border-amber-200 hover:bg-amber-100 hover:text-amber-900 dark:border-amber-900 dark:hover:bg-amber-900/50 dark:hover:text-amber-100"
             disabled={submitting || !newNote.trim()}
           >
              {submitting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Send className="h-3 w-3 mr-1" />}
              Add Note
           </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminNotes;