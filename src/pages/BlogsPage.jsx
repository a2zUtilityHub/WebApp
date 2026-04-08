import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import BlogCard from '@/components/blog/BlogCard';
import HeroSection from '@/components/HeroSection';
import { motion } from 'framer-motion';
import { fetchAllCategories, logDebug } from '@/utils/categoryQueryHandler';
import { supabase } from '@/lib/customSupabaseClient';

const POSTS_PER_PAGE = 12;

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const BlogsPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('published_at-desc');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        logDebug('BlogsPage', 'Fetching all published blogs and categories');
        
        // Use application-level fetching rather than complex joins
        const [postsRes, catsRes] = await Promise.all([
           supabase.from('blog_posts').select('*, author:profiles(first_name, last_name)').eq('status', 'published'),
           fetchAllCategories()
        ]);

        if (postsRes.error) throw postsRes.error;
        if (catsRes.error) throw catsRes.error;

        setPosts(postsRes.data || []);
        
        // Filter categories to only those that are type='Blog' or have associated blogs
        const validCats = catsRes.data.filter(c => c.type === 'Blog' || (postsRes.data || []).some(p => p.category_id === c.id));
        setCategories(validCats);

      } catch (error) {
        logDebug('BlogsPage', 'Error fetching data', null, error);
        toast({ title: "Error fetching data", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);
  
  const filteredAndSortedPosts = useMemo(() => {
    return posts
      .filter(post => {
        const searchTermMatch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = selectedCategoryId === 'all' || String(post.category_id) === String(selectedCategoryId);
        return searchTermMatch && categoryMatch;
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
  }, [posts, searchTerm, selectedCategoryId, sortOption]);

  const paginatedPosts = useMemo(() => {
    return filteredAndSortedPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  }, [filteredAndSortedPosts, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet>
        <title>Blogs - A2Z Utility Hub</title>
        <meta name="description" content="Latest news, updates, and articles from the A2Z Utility Hub team." />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CJMK1M1R4H"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CJMK1M1R4H');
          `}
        </script>
      </Helmet>
      
      <HeroSection 
        title="Welcome to Our Blogs"
        subtitle="Read insightful articles and stay updated with latest trends"
      />

      <div className="full-width-section bg-background py-16 relative overflow-hidden">
        {/* Soft Glowing Background Orbs */}
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="content-container relative z-10">
          <div className="flex flex-col md:flex-row gap-4 mb-12 bg-background/60 backdrop-blur-xl p-4 md:p-5 rounded-[2rem] border border-border/50 shadow-sm">
            <div className="relative flex-grow group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              <Input 
                placeholder="Search articles..." 
                className="pl-12 h-12 bg-background/80 border-input text-foreground focus-visible:ring-4 focus-visible:ring-primary/10 hover:border-primary/50 shadow-sm rounded-2xl transition-all"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select value={selectedCategoryId} onValueChange={(v) => { setSelectedCategoryId(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full md:w-[220px] h-12 bg-background/80 border-input text-foreground focus:ring-4 focus:ring-primary/10 hover:border-primary/50 shadow-sm rounded-2xl transition-all">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/50 bg-background/80 backdrop-blur-xl shadow-xl">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full md:w-[180px] h-11 focus:ring-brand-primary focus:border-brand-primary">
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
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
            </div>
          ) : paginatedPosts.length > 0 ? (
            <>
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {paginatedPosts.map((post) => (
                  <motion.div key={post.id} variants={itemVariants} className="hover-scale glass-card overflow-hidden border-t-2 border-t-brand-primary">
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
              {totalPages > 1 && (
                <Pagination className="mt-12 justify-start">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} disabled={currentPage === 1} className="text-brand-primary hover:bg-brand-primary/10 cursor-pointer" />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }} isActive={currentPage === i + 1} className={currentPage === i + 1 ? "bg-brand-primary text-white" : "cursor-pointer"}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} disabled={currentPage === totalPages} className="text-brand-primary hover:bg-brand-primary/10 cursor-pointer" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
             <div className="text-center py-20 bg-background/60 backdrop-blur-xl rounded-[2.5rem] px-8 border border-border/50 shadow-sm">
               <div className="mx-auto w-16 h-16 bg-muted/50 border border-border/50 rounded-full flex items-center justify-center mb-6">
                 <Search className="h-8 w-8 text-muted-foreground" />
               </div>
               <h2 className="text-2xl font-extrabold text-foreground tracking-tight">No posts found</h2>
               <p className="text-muted-foreground text-lg mt-3 max-w-md mx-auto">There are no blog posts available for your criteria. Please try a different search or check back later.</p>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogsPage;