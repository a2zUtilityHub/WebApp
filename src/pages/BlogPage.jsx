
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import BlogCard from '@/components/blog/BlogCard';
import { logDebug } from '@/utils/categoryQueryHandler';
import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseHorizontal from '@/components/ads/AdSenseHorizontal';
import AdSidebarLayoutWrapper from '@/components/ads/AdSidebarLayoutWrapper';

const POSTS_PER_PAGE = 9;

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('published_at-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        logDebug('BlogPage', 'Fetching all published blog posts');
        let query = supabase
          .from('blog_posts')
          .select(`*,profiles!blog_posts_author_id_fkey (first_name,last_name)`)
          .eq('status', 'published')
          .eq('language', i18n.language || 'en');

        const { data, error } = await query;
        
        if (error) throw error;
        
        setPosts(data || []);
      } catch (error) {
        logDebug('BlogPage', 'Error fetching blog posts', null, error);
        toast({ title: "Error fetching blog posts", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [toast, i18n.language]);

  const filteredAndSortedPosts = useMemo(() => {
    return posts
      .filter(post => {
        if (!searchTerm) return true;
        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => {
        const [sortCol, sortDir] = sortOption.split('-');
        if (sortCol === 'title') {
          return sortDir === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        }
        return sortDir === 'asc' 
          ? new Date(a[sortCol] || 0) - new Date(b[sortCol] || 0) 
          : new Date(b[sortCol] || 0) - new Date(a[sortCol] || 0);
      });
  }, [posts, searchTerm, sortOption]);

  const paginatedPosts = useMemo(() => {
    return filteredAndSortedPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  }, [filteredAndSortedPosts, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="flex-grow flex flex-col w-full items-center">
      <Helmet>
        <title>Blog - A2Z Utility Hub</title>
        <meta name="description" content="Latest news, updates, and articles from the A2Z Utility Hub team." />
      </Helmet>
      
      <AdSenseContainer className="w-full px-4 mt-8">
        <AdSenseHorizontal slot="blog_top" />
      </AdSenseContainer>

      <div className="py-12 bg-gray-50/30 w-full px-4">
        <div className="section-header text-center mb-10 w-full">
          <h1 className="section-title">Our Blog</h1>
          <p className="section-subtitle">News, updates, and insights from our team.</p>
        </div>

        <AdSidebarLayoutWrapper leftAdSlots={['blog_left_1', 'blog_left_2']} rightAdSlots={['blog_right_1', 'blog_right_2']}>
          <div className="w-full min-w-0">
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border shadow-sm w-full">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search articles..." 
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published_at-desc">Newest</SelectItem>
                  <SelectItem value="published_at-asc">Oldest</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64 w-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : paginatedPosts.length > 0 ? (
              <>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 w-full">
                  {paginatedPosts.slice(0, 6).map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {paginatedPosts.length > 6 && (
                  <AdSenseContainer className="my-10 w-full">
                    <AdSenseHorizontal slot="blog_mid" />
                  </AdSenseContainer>
                )}

                {paginatedPosts.length > 6 && (
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-8 w-full">
                    {paginatedPosts.slice(6).map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <Pagination className="mt-12 w-full justify-center">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} disabled={currentPage === 1} />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }} isActive={currentPage === i + 1}>
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} disabled={currentPage === totalPages} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
               <div className="text-center py-16 bg-white border rounded-xl shadow-sm w-full">
                 <h2 className="text-2xl font-semibold">No posts found</h2>
                 <p className="text-muted-foreground mt-2">There are no blog posts available for your criteria. Please try a different search or check back later.</p>
               </div>
            )}
          </div>
        </AdSidebarLayoutWrapper>
      </div>
    </div>
  );
};

export default BlogPage;
