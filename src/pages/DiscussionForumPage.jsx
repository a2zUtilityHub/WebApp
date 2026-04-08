import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useDiscussion } from '@/hooks/useDiscussion';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MessageSquare, PlusCircle, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';
import { useDebounce } from '@/hooks/useDebounce';
import HeroSection from '@/components/HeroSection';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseResponsive from '@/components/ads/AdSenseResponsive';
import AdSenseVertical from '@/components/ads/AdSenseVertical';
import { useAdSense } from '@/contexts/AdSenseProvider';

const ITEMS_PER_PAGE = 10;

const DiscussionForumPage = () => {
  const [threads, setThreads] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { shouldShowAds } = useAdSense();
  
  const { fetchDiscussionThreads, loading, error } = useDiscussion();
  const { toast } = useToast();

  useEffect(() => {
    const loadThreads = async () => {
      const { data, count } = await fetchDiscussionThreads({ 
        page, 
        limit: ITEMS_PER_PAGE, 
        searchQuery: debouncedSearch 
      });
      if (data) {
        setThreads(data);
        setTotalCount(count);
      }
    };
    loadThreads();
  }, [page, debouncedSearch, fetchDiscussionThreads]);

  useEffect(() => {
    setPage(1); // Reset page on new search
  }, [debouncedSearch]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden">
      {/* Background Glowing Orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
      
      <Helmet>
        <title>Discussion Forum - A2Z Utility Hub</title>
        <meta name="description" content="Join the community discussion, ask questions, give feedback, and connect with other users of A2Z Utility Hub." />
      </Helmet>

      <HeroSection 
        title="Discussion & Community"
        subtitle="Join our community, share ideas, and discuss topics with fellow users"
        ctaButtons={
          <Button asChild size="lg" className="rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary border-0 shadow-lg hover:shadow-xl h-14 text-lg transition-all duration-300 hover:-translate-y-1 font-bold px-8">
            <Link to="/discussion/new">Start a Discussion</Link>
          </Button>
        }
      />

      <div className="container mx-auto max-w-7xl py-8 px-4 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <Breadcrumbs 
            items={[
              { title: "Home", to: "/" },
              { title: "Discussion", to: "/discussion" }
            ]} 
            className="mb-8"
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 relative z-10">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search discussions..." 
                className="pl-12 h-14 bg-background/60 backdrop-blur-xl border-border/50 rounded-2xl focus-visible:ring-4 focus-visible:ring-primary/10 shadow-sm hover:border-primary/50 transition-all text-[15px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button asChild className="shrink-0 h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-bold">
              <Link to="/discussion/new">
                <PlusCircle className="mr-2 h-5 w-5" /> New Discussion
              </Link>
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {shouldShowAds && (
            <AdSenseContainer className="mb-8">
              <AdSenseResponsive slot="forum_top" />
            </AdSenseContainer>
          )}

          <div className="space-y-4">
            {loading && threads.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
              </div>
            ) : threads.length > 0 ? (
              <>
                {threads.map(thread => (
                  <Card key={thread.id} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border/50 bg-background/60 backdrop-blur-xl rounded-[1.5rem] overflow-hidden group relative z-10">
                    <Link to={`/discussion/thread/${thread.slug}`} className="block">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors flex items-center gap-3">
                              {thread.is_pinned && <Badge variant="default" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-none rounded-full px-3">Pinned</Badge>}
                              {thread.is_locked && <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-none rounded-full px-3">Locked</Badge>}
                              <span className="leading-tight">{thread.title}</span>
                            </CardTitle>
                            <CardDescription className="mt-3 text-[14px] text-muted-foreground flex items-center gap-2">
                              <span>Started by <span className="font-semibold text-foreground/80">{thread.author?.first_name || 'Anonymous'}</span></span>
                              <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                              <span>{formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}</span>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-between items-center py-4 border-t border-border/50 bg-muted/10">
                        <div className="flex flex-wrap gap-2">
                          {thread.tags?.map(t => (
                            <Badge key={t.thread_tags?.slug} variant="secondary" className="bg-background/80 backdrop-blur-sm text-muted-foreground border border-border/50 font-medium rounded-lg">
                              {t.thread_tags?.name}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-[14px] font-bold text-muted-foreground group-hover:text-primary transition-colors shrink-0 bg-background/50 px-3 py-1.5 rounded-full border border-border/50 shadow-sm">
                          <MessageSquare className="h-4 w-4" />
                          <span>{thread.comments?.[0]?.count || 0} Replies</span>
                        </div>
                      </CardFooter>
                    </Link>
                  </Card>
                ))}

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12 relative z-10">
                    <Button 
                      variant="outline" 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="border-border/50 rounded-xl h-11 px-6 shadow-sm bg-background/60 backdrop-blur-sm"
                    >
                      Previous
                    </Button>
                    <span className="text-[15px] font-semibold text-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/50">
                      Page {page} of {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="border-border/50 rounded-xl h-11 px-6 shadow-sm bg-background/60 backdrop-blur-sm"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 border border-border/50 rounded-[2.5rem] bg-background/60 backdrop-blur-xl shadow-lg relative overflow-hidden z-10">
                <div className="absolute top-0 right-0 p-16 opacity-5 bg-gradient-to-bl from-primary to-transparent rounded-bl-full z-0 w-48 h-48"></div>
                <div className="mx-auto w-24 h-24 bg-muted/50 border border-border/50 shadow-sm rounded-full flex items-center justify-center mb-6 relative z-10">
                   <MessageSquare className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-3xl font-extrabold text-foreground relative z-10">No discussions found</h2>
                <p className="text-muted-foreground text-lg mt-3 max-w-md mx-auto relative z-10">
                  {searchQuery ? "Try adjusting your search terms to find what you're looking for." : "Be the first to start a conversation in our community!"}
                </p>
                {!searchQuery && (
                  <Button asChild className="mt-8 h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-bold relative z-10">
                    <Link to="/discussion/new">Start a Discussion</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {shouldShowAds && (
          <div className="hidden lg:block w-[300px] shrink-0 pt-8">
             <AdSenseContainer className="sticky top-24">
                <AdSenseVertical slot="forum_sidebar" />
             </AdSenseContainer>
          </div>
        )}

      </div>
    </div>
  );
};

export default DiscussionForumPage;