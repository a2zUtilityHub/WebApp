import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const BlogCard = ({ post }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="flex flex-col h-full border border-border/50 bg-background/60 backdrop-blur-sm shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden group">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary to-accent group-hover:h-2.5 transition-all duration-300"></div>
        <CardHeader className="pt-6">
          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
            <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
          </CardTitle>
          <CardDescription>
            {format(new Date(post.published_at), 'MMMM d, yyyy')} by {post.author?.first_name || 'A2Z Team'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3">{post.meta_description}</p>
        </CardContent>
        <CardFooter>
          <Link to={`/blogs/${post.slug}`} className="font-semibold text-primary hover:underline flex items-center">
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BlogCard;