import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MessageSquare } from 'lucide-react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { Button } from '@/components/ui/button';

const CommentsSection = ({ pageId, isDiscussion = false }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*, author:profiles!user_id(id, first_name, avatar_url)')
      .eq('page_id', pageId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      toast({ title: 'Error fetching comments', description: error.message, variant: 'destructive' });
      setComments([]);
    } else {
      const commentsById = data.reduce((acc, comment) => {
        acc[comment.id] = { ...comment, replies: [] };
        return acc;
      }, {});

      const rootComments = [];
      Object.values(commentsById).forEach(comment => {
        if (comment.parent_id && commentsById[comment.parent_id]) {
          commentsById[comment.parent_id].replies.push(comment);
        } else {
          rootComments.push(comment);
        }
      });

      setComments(rootComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    }
    setLoading(false);
  }, [pageId, toast]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentPosted = () => {
    fetchComments();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Discussion</h2>
        {isDiscussion && (
          <Button asChild>
            <Link to="/discussion/new">
              <MessageSquare className="mr-2 h-4 w-4" /> Start a Discussion
            </Link>
          </Button>
        )}
      </div>
      {user ? (
        <CommentForm pageId={pageId} onCommentPosted={handleCommentPosted} />
      ) : (
        <p className="text-muted-foreground text-center py-4 border rounded-md">
          Please <Link to="/auth/login" className="text-primary hover:underline font-semibold">log in</Link> to join the discussion.
        </p>
      )}
      <div className="mt-8 space-y-6">
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} pageId={pageId} onReplyPosted={handleCommentPosted} />
        ))}
        {comments.length === 0 && !loading && (
          <p className="text-center text-muted-foreground py-8">Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;