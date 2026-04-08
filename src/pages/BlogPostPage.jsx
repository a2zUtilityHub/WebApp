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
      <div className="container mx-auto px-4">
        <article className="py-12 max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{post.title}</h1>
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
            className="prose dark:prose-invert max-w-none text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        <div className="py-12 border-t max-w-4xl mx-auto">
          <CommentsSection pageId={`blog/${slug}`} />
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;