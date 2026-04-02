
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useAppComments = (appId) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('video_editor_comments')
        .select('*')
        .eq('app_id', appId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({ title: 'Error', description: 'Failed to load comments.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [appId, toast]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async (content) => {
    if (!user) {
      toast({ title: 'Authentication required', description: 'Please log in to comment.', variant: 'destructive' });
      return null;
    }

    try {
      const newComment = {
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        user_email: user.email,
        content: content.trim(),
        app_id: appId,
        likes: 0
      };

      const { data, error } = await supabase
        .from('video_editor_comments')
        .insert([newComment])
        .select()
        .single();

      if (error) throw error;

      setComments(prev => [data, ...prev]);
      toast({ title: 'Success', description: 'Comment posted successfully.' });
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({ title: 'Error', description: 'Failed to post comment.', variant: 'destructive' });
      return null;
    }
  };

  const deleteComment = async (id) => {
    try {
      const { error } = await supabase
        .from('video_editor_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setComments(prev => prev.filter(c => c.id !== id));
      toast({ title: 'Deleted', description: 'Comment deleted successfully.' });
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({ title: 'Error', description: 'Failed to delete comment.', variant: 'destructive' });
      return false;
    }
  };

  const editComment = async (id, newContent) => {
    try {
      const { data, error } = await supabase
        .from('video_editor_comments')
        .update({ content: newContent.trim(), updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setComments(prev => prev.map(c => c.id === id ? data : c));
      toast({ title: 'Updated', description: 'Comment updated successfully.' });
      return data;
    } catch (error) {
      console.error('Error editing comment:', error);
      toast({ title: 'Error', description: 'Failed to update comment.', variant: 'destructive' });
      return null;
    }
  };

  return { comments, isLoading, addComment, deleteComment, editComment, refresh: fetchComments };
};
