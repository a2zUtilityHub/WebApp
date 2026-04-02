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
      <Card className="flex flex-col h-full shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary hover:text-primary transition-colors">
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