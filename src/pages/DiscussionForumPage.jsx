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
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Helmet>
        <title>Discussion Forum - A2Z Utility Hub</title>
        <meta name="description" content="Join the community discussion, ask questions, give feedback, and connect with other users of A2Z Utility Hub." />
      </Helmet>

      <HeroSection 
        title="Discussion & Community"
        subtitle="Join our community, share ideas, and discuss topics with fellow users"
        ctaButtons={
          <Button asChild size="lg" className="rounded-full bg-white text-brand-primary hover:bg-gray-50 border-0 shadow-lg h-14 md:h-12 text-lg md:text-base transition-all duration-150 hover:-translate-y-1">
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

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search discussions..." 
                className="pl-10 h-12 bg-white border-gray-200 rounded-xl focus:ring-brand-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button asChild className="shrink-0 h-12 px-6 rounded-xl bg-brand-primary hover:bg-brand-primary-dark">
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
                  <Card key={thread.id} className="hover:shadow-md transition-shadow border-gray-200/60 bg-white">
                    <Link to={`/discussion/thread/${thread.slug}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <CardTitle className="text-xl text-gray-900 group-hover:text-brand-primary transition-colors flex items-center gap-2">
                              {thread.is_pinned && <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">Pinned</Badge>}
                              {thread.is_locked && <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-none">Locked</Badge>}
                              {thread.title}
                            </CardTitle>
                            <CardDescription className="mt-2 text-sm text-gray-500">
                              Started by <span className="font-semibold text-gray-700">{thread.author?.first_name || 'Anonymous'}</span> • {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-between items-center py-4 border-t border-gray-50 bg-gray-50/30">
                        <div className="flex flex-wrap gap-2">
                          {thread.tags?.map(t => (
                            <Badge key={t.thread_tags?.slug} variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-none font-medium">
                              {t.thread_tags?.name}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 shrink-0">
                          <MessageSquare className="h-4 w-4" />
                          <span>{thread.comments?.[0]?.count || 0} Replies</span>
                        </div>
                      </CardFooter>
                    </Link>
                  </Card>
                ))}

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-10">
                    <Button 
                      variant="outline" 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="border-gray-200 text-gray-600"
                    >
                      Previous
                    </Button>
                    <span className="text-sm font-medium text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="border-gray-200 text-gray-600"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 border border-gray-200 rounded-2xl bg-white shadow-sm">
                <MessageSquare className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">No discussions found</h2>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  {searchQuery ? "Try adjusting your search terms to find what you're looking for." : "Be the first to start a conversation in our community!"}
                </p>
                {!searchQuery && (
                  <Button asChild className="mt-8 bg-brand-primary hover:bg-brand-primary-dark">
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