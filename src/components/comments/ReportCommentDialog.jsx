import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const ReportCommentDialog = ({ isOpen, onClose, commentId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: 'You must be logged in to report a comment.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from('comment_flags').insert({
      comment_id: commentId,
      reporter_id: user.id,
      reason: reason,
    });

    if (error) {
      toast({ title: 'Error submitting report', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Report submitted', description: 'Thank you for helping keep our community safe.' });
      onClose();
      setReason('');
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Comment</DialogTitle>
          <DialogDescription>
            Please provide a reason for reporting this comment. Your report is anonymous.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="reason">Reason (optional)</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., spam, harassment, inappropriate content..."
            disabled={isSubmitting}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportCommentDialog;