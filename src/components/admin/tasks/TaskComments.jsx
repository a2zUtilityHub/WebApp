import React, { useEffect, useState } from 'react';
import { useTaskManagement } from '@/hooks/useTaskManagement';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Send, Loader2 } from 'lucide-react';

const TaskComments = ({ taskId }) => {
    const { fetchComments, addComment } = useTaskManagement();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadComments = async () => {
        const data = await fetchComments(taskId);
        setComments(data || []);
    };

    useEffect(() => {
        if(taskId) loadComments();
    }, [taskId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setSubmitting(true);
        await addComment(taskId, newComment);
        setNewComment('');
        await loadComments();
        setSubmitting(false);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-6 mb-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user?.avatar_url} />
                            <AvatarFallback>{comment.user?.first_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                             <div className="flex items-center gap-2 justify-between">
                                <span className="font-semibold text-sm">{comment.user?.first_name} {comment.user?.last_name}</span>
                                <span className="text-muted-foreground text-xs">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                            </div>
                            <div className="text-sm bg-muted/50 p-3 rounded-md">
                                {comment.content}
                            </div>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && <div className="text-center text-muted-foreground py-4">No comments yet.</div>}
            </div>
            
            <form onSubmit={handleSubmit} className="mt-auto flex gap-2">
                <Textarea 
                    value={newComment} 
                    onChange={e => setNewComment(e.target.value)} 
                    placeholder="Write a comment..." 
                    className="min-h-[80px]"
                />
                <Button type="submit" size="icon" disabled={submitting || !newComment.trim()} className="h-[80px] w-12">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
                </Button>
            </form>
        </div>
    );
};

export default TaskComments;