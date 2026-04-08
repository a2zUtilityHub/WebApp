import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import CommentsSection from '@/components/comments/CommentsSection';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, author:profiles(first_name, last_name, avatar_url)')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      
      if (error) {
        toast({ title: "Error fetching post", description: "This post could not be found or is not available.", variant: "destructive" });
        console.error("Blog post fetch error:", error);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <p className="text-muted-foreground mt-4">The post you are looking for does not exist.</p>
        <Link to="/blogs" className="mt-6 inline-block"><Button>Back to Blogs</Button></Link>
      </div>
    );
  }
  
  const authorName = post.author ? `${post.author.first_name || ''} ${post.author.last_name || ''}`.trim() : 'A2Z Team';

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title}</title>
        <meta name="description" content={post.meta_description} />
        <meta property="og:title" content={post.og_title || post.meta_title || post.title} />
        <meta property="og:description" content={post.og_description || post.meta_description} />
        {post.og_image_url && <meta property="og:image" content={post.og_image_url} />}
        {post.twitter_card && <meta name="twitter:card" content={post.twitter_card} />}
        {post.canonical_url && <link rel="canonical" href={post.canonical_url} />}
      </Helmet>
      <div className="bg-background min-h-screen relative overflow-hidden">
        {/* Soft Glowing Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <article className="max-w-4xl mx-auto bg-background/60 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] shadow-xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/40 to-primary"></div>
            <header className="mb-10 text-center border-b border-border/50 pb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground leading-tight">{post.title}</h1>
            <div className="flex justify-center items-center space-x-4 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.published_at}>{format(new Date(post.published_at), 'MMMM d, yyyy')}</time>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{authorName}</span>
              </div>
            </div>
          </header>
          
          {post.og_image_url && <img src={post.og_image_url} alt={post.title} className="w-full h-auto rounded-lg mb-8 object-cover aspect-video" />}

          <div
            className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-foreground/80 prose-headings:text-foreground prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        <div className="py-16 max-w-4xl mx-auto mt-8">
          <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-[2rem] shadow-lg p-6 md:p-10">
             <h2 className="text-3xl font-extrabold text-foreground mb-6">Discussion</h2>
             <CommentsSection pageId={`blog/${slug}`} />
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default BlogPostPage;