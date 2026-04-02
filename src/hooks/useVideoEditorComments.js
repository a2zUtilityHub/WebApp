
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useVideoEditorComments = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('video_editor_comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({ title: 'Error loading comments', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchComments();

    const channel = supabase.channel('public:video_editor_comments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'video_editor_comments' }, payload => {
        if (payload.eventType === 'INSERT') {
          setComments(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setComments(prev => prev.filter(c => c.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setComments(prev => prev.map(c => c.id === payload.new.id ? payload.new : c));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchComments]);

  const addComment = async (content) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('video_editor_comments')
        .insert([{
          user_id: user.id,
          user_name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : user.email.split('@')[0],
          user_email: user.email,
          content
        }])
        .select()
        .single();

      if (error) throw error;
      toast({ title: 'Comment posted successfully' });
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({ title: 'Failed to post comment', description: error.message, variant: 'destructive' });
      return null;
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const { error } = await supabase
        .from('video_editor_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      toast({ title: 'Comment deleted' });
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({ title: 'Failed to delete comment', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  const editComment = async (commentId, newContent) => {
    try {
      const { data, error } = await supabase
        .from('video_editor_comments')
        .update({ content: newContent, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .select()
        .single();

      if (error) throw error;
      toast({ title: 'Comment updated' });
      return data;
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({ title: 'Failed to update comment', description: error.message, variant: 'destructive' });
      return null;
    }
  };

  return {
    comments,
    isLoading,
    fetchComments,
    addComment,
    deleteComment,
    editComment
  };
};
