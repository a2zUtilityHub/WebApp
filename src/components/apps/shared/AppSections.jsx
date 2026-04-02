
import React, { useState } from 'react';
import { Info, BookOpen, HelpCircle, Users, CheckCircle, Lightbulb, ListOrdered, Shield, MessageSquare, Send, Trash2, Edit2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { useAppComments } from '@/hooks/useAppComments';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const AboutSection = ({ title, description, features, benefits }) => (
  <div className="app-section-wrapper animate-fade-in">
    <h2 className="app-section-title">
      <Info className="w-8 h-8 text-primary" />
      About {title}
    </h2>
    
    <div className="app-glass-panel p-6 md:p-8 mb-8">
      <p className="text-lg text-muted-foreground leading-relaxed mb-8">{description}</p>

      <h3 className="text-xl font-bold text-foreground mb-6">Key Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {features.map((feat, idx) => (
          <div key={idx} className="app-info-card group">
            <div className="app-feature-icon">{feat.icon}</div>
            <h4 className="font-semibold text-foreground mb-2">{feat.title}</h4>
            <p className="text-muted-foreground text-sm">{feat.desc}</p>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold text-foreground mb-6">Why Use {title}?</h3>
      <ul className="space-y-3">
        {benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export const ManualSection = ({ title, steps, tips }) => (
  <div className="app-section-wrapper animate-fade-in animation-delay-200">
    <h2 className="app-section-title">
      <BookOpen className="w-8 h-8 text-primary" />
      User Manual
    </h2>
    
    <div className="space-y-8">
      <div className="app-glass-panel p-6 md:p-8">
        <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <ListOrdered className="w-6 h-6 text-primary" />
          Getting Started
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-border">
              <div className="app-step-circle">{idx + 1}</div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 rounded-2xl shadow-sm border border-primary/20 p-6 md:p-8">
        <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-primary" />
          Tips & Best Practices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-background/60 p-4 rounded-xl backdrop-blur-sm">
              <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-foreground text-sm">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const FAQSection = ({ faqs }) => (
  <div className="app-section-wrapper animate-fade-in animation-delay-400">
    <h2 className="app-section-title">
      <HelpCircle className="w-8 h-8 text-primary" />
      Frequently Asked Questions
    </h2>
    
    <div className="app-glass-panel p-6 md:p-8">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`} className="border-border">
            <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-4">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
);

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
    <Card className="p-4 bg-card border-border shadow-sm">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-foreground">{comment.user_name}</span>
            <span className="text-xs text-muted-foreground">
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
            <p className="text-muted-foreground text-sm whitespace-pre-wrap">{comment.content}</p>
          )}

          {!isEditing && (isOwner || canDelete) && (
            <div className="flex gap-3 mt-3">
              {isOwner && (
                <button onClick={() => setIsEditing(true)} className="text-xs text-muted-foreground hover:text-primary flex items-center transition-colors">
                  <Edit2 className="w-3 h-3 mr-1" /> Edit
                </button>
              )}
              {canDelete && (
                <button onClick={() => onDelete(comment.id)} className="text-xs text-muted-foreground hover:text-destructive flex items-center transition-colors">
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

export const CommunitySection = ({ appId }) => {
  const { user, isAdmin } = useAuth();
  const { comments, isLoading, addComment, deleteComment, editComment } = useAppComments(appId);
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
    <div className="app-section-wrapper animate-fade-in">
      <h2 className="app-section-title">
        <Users className="w-8 h-8 text-primary" />
        Community Discussion
      </h2>
      
      <div className="app-glass-panel p-6 md:p-8">
        {!user ? (
          <div className="text-center p-8 bg-secondary/50 border border-border rounded-xl mb-8">
            <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Join the Conversation</h3>
            <p className="text-muted-foreground text-sm">Please log in to leave a comment, ask for help, or share your tips.</p>
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
              <span className={`absolute bottom-2 right-3 text-xs ${newComment.length >= 500 ? 'text-destructive' : 'text-muted-foreground'}`}>
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
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            Comments ({comments.length})
          </h3>
          
          {isLoading ? (
            <div className="flex justify-center py-8 text-muted-foreground">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 bg-secondary/30 rounded-xl border border-border border-dashed">
              <p className="text-muted-foreground">No comments yet. Be the first to start the discussion!</p>
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
