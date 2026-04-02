import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useDiscussion } from '@/hooks/useDiscussion';
import { Loader2, ArrowLeft, User, Calendar, ThumbsUp, AlertCircle, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import CommentsSection from '@/components/comments/CommentsSection';

const DiscussionThreadPage = () => {
  const { slug } = useParams();
  const [thread, setThread] = useState(null);
  const { fetchDiscussionThread, loading, error } = useDiscussion();

  useEffect(() => {
    const loadThread = async () => {
      const data = await fetchDiscussionThread(slug);
      if (data) {
        setThread(data);
      }
    };
    if (slug) {
      loadThread();
    }
  }, [slug, fetchDiscussionThread]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="full-width-container py-12 max-w-3xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Link to="/discussion" className="mt-6 inline-block">
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Discussions</Button>
        </Link>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="text-center py-20 full-width-container">
        <h1 className="text-3xl font-bold mb-4">Discussion Not Found</h1>
        <p className="text-muted-foreground mb-8">The thread you are looking for does not exist or has been removed.</p>
        <Link to="/discussion">
          <Button><ArrowLeft className="mr-2 h-4 w-4"/> Back to Discussions</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{thread.title} - Discussion Forum</title>
        <meta name="description" content={`Read and join the discussion about: ${thread.title}`} />
      </Helmet>
      
      <div className="full-width-container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <Link to="/discussion" className="text-sm text-primary hover:underline flex items-center mb-6 w-fit">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to all discussions
          </Link>
          
          <header className="mb-8 p-6 md:p-8 bg-card border rounded-xl shadow-sm relative overflow-hidden">
            {thread.is_locked && (
              <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground px-3 py-1 rounded-bl-lg text-xs font-semibold flex items-center">
                <Lock className="w-3 h-3 mr-1" /> Locked
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
                {thread.tags?.map(t => (
                  <Badge key={t.thread_tags?.slug} variant="secondary">
                    {t.thread_tags?.name}
                  </Badge>
                ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
              {thread.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm border-t pt-4">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {thread.author?.first_name?.[0] || <User className="h-3 w-3" />}
                </div>
                <span className="font-medium text-foreground">{thread.author?.first_name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={thread.created_at}>{format(new Date(thread.created_at), 'MMMM d, yyyy')}</time>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{thread.upvote_count || 0} Upvotes</span>
              </div>
            </div>
          </header>

          <div className="bg-card border rounded-xl shadow-sm p-6 md:p-8 mb-12">
            <div
              className="prose dark:prose-invert max-w-none text-base md:text-lg"
              dangerouslySetInnerHTML={{ __html: thread.body }}
            />
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              Join the Conversation
            </h2>
            {thread.is_locked ? (
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertTitle>Thread Locked</AlertTitle>
                <AlertDescription>
                  This discussion has been locked by an administrator. No further replies can be added.
                </AlertDescription>
              </Alert>
            ) : (
              <CommentsSection pageId={`discussion/${thread.id}`} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscussionThreadPage;