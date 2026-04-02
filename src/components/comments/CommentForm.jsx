import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

const CommentForm = ({ pageId, parentId = null, onCommentPosted, onCancel, recipientId = null }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({ title: 'Comment cannot be empty', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);

    const { data, error } = await supabase.from('comments').insert({
      user_id: user.id,
      page_id: pageId,
      parent_id: parentId,
      content: content.trim(),
    }).select().single();

    if (error) {
      toast({ title: 'Error posting comment', description: error.message, variant: 'destructive' });
    } else {
      if (parentId && recipientId && recipientId !== user.id) {
        await supabase.from('notifications').insert({
          user_id: recipientId,
          type: 'new_comment_reply',
          data: {
            message: `${user.user_metadata?.first_name || 'Someone'} replied to your comment.`,
            pageId: pageId,
            commentId: data.id,
          },
        });
      }
      setContent('');
      toast({ title: 'Comment posted!' });
      trackEvent('comment_posted', { pageId, parentId: parentId || null });
      onCommentPosted();
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        disabled={isSubmitting}
      />
      <div className="flex justify-end gap-2">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>}
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {parentId ? 'Post Reply' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;