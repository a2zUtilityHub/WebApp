
import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useVideoEditorComments } from '@/hooks/useVideoEditorComments';
import { formatDistanceToNow } from 'date-fns';
import { Users, Send, Trash2, Edit2, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

const CommentCard = ({ comment, currentUser, isAdmin, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isOwner = currentUser && currentUser.id === comment.user_id;
  const canDelete = isOwner || isAdmin;
  const initials = comment.user_name ? comment.user_name.substring(0, 2).toUpperCase() : 'U';

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  return (
    <Card className="p-4 bg-white border-gray-100 shadow-sm">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-gray-900">{comment.user_name}</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSave}>Save</Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
          )}

          {!isEditing && (isOwner || canDelete) && (
            <div className="flex gap-3 mt-3">
              {isOwner && (
                <button onClick={() => setIsEditing(true)} className="text-xs text-gray-500 hover:text-primary flex items-center transition-colors">
                  <Edit2 className="w-3 h-3 mr-1" /> Edit
                </button>
              )}
              {canDelete && (
                <button onClick={() => onDelete(comment.id)} className="text-xs text-gray-500 hover:text-destructive flex items-center transition-colors">
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const CommunitySection = () => {
  const { user, isAdmin } = useAuth();
  const { comments, isLoading, addComment, deleteComment, editComment } = useVideoEditorComments();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || newComment.length > 500) return;
    
    setIsSubmitting(true);
    await addComment(newComment);
    setNewComment('');
    setIsSubmitting(false);
  };

  return (
    <div className="info-section-wrapper animate-fade-in">
      <h2 className="info-section-title text-indigo-800">
        <Users className="w-8 h-8 text-indigo-600" />
        Community Discussion
      </h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        {!user ? (
          <div className="text-center p-8 bg-indigo-50 border border-indigo-100 rounded-xl mb-8">
            <MessageSquare className="w-10 h-10 text-indigo-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Join the Conversation</h3>
            <p className="text-indigo-700 text-sm">Please log in to leave a comment, ask for help, or share your tips.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <div className="relative">
              <Textarea 
                placeholder="Share your thoughts, tips, or ask for help..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] resize-none pb-8"
                maxLength={500}
              />
              <span className={`absolute bottom-2 right-3 text-xs ${newComment.length >= 500 ? 'text-destructive' : 'text-gray-400'}`}>
                {newComment.length}/500
              </span>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                {isSubmitting ? 'Posting...' : <><Send className="w-4 h-4 mr-2" /> Post Comment</>}
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            Comments ({comments.length})
          </h3>
          
          {isLoading ? (
            <div className="flex justify-center py-8 text-gray-400">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
              <p className="text-gray-500">No comments yet. Be the first to start the discussion!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <CommentCard 
                  key={comment.id} 
                  comment={comment} 
                  currentUser={user} 
                  isAdmin={isAdmin}
                  onDelete={deleteComment}
                  onEdit={editComment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;
