import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Flag } from 'lucide-react';
import CommentForm from './CommentForm';
import ReportCommentDialog from './ReportCommentDialog';

const Comment = ({ comment, pageId, onReplyPosted }) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const author = comment.author;

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onReplyPosted();
  };

  return (
    <div className="flex gap-4">

    <Avatar className="h-8 w-8">
      {/* <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.first_name} /> */}
      <AvatarFallback>{user.user_metadata?.first_name?.[0] || user.email[0].toUpperCase()}</AvatarFallback>
    </Avatar>

{/*       <Avatar>
        <AvatarImage src={author?.avatar_url} alt={author?.first_name} />
        <AvatarFallback>{author?.first_name?.[0] || 'U'}</AvatarFallback>
      </Avatar> */}

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{author?.first_name || 'Anonymous'}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className="mt-1 text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
        <div className="mt-2 flex items-center gap-4">
          {user && (
            <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(!showReplyForm)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Reply
            </Button>
          )}
          {user && user.id !== comment.user_id && (
            <Button variant="ghost" size="sm" onClick={() => setIsReportDialogOpen(true)}>
              <Flag className="h-4 w-4 mr-2" />
              Report
            </Button>
          )}
        </div>
        {showReplyForm && (
          <div className="mt-4">
            <CommentForm
              pageId={pageId}
              parentId={comment.id}
              onCommentPosted={handleReplySuccess}
              onCancel={() => setShowReplyForm(false)}
              recipientId={comment.user_id}
            />
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-6 space-y-6 pl-8 border-l">
            {comment.replies.map(reply => (
              <Comment key={reply.id} comment={reply} pageId={pageId} onReplyPosted={onReplyPosted} />
            ))}
          </div>
        )}
      </div>
      <ReportCommentDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        commentId={comment.id}
      />
    </div>
  );
};

export default Comment;