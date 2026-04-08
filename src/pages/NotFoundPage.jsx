import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, FileQuestion } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Helmet>
        <title>404 - Page Not Found | a2z Utility Hub</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg mx-auto"
      >
        <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <FileQuestion className="h-32 w-32 text-primary relative z-10" />
        </div>

        <h1 className="text-7xl font-extrabold tracking-tight mb-4 text-primary">404</h1>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Oops! The page you are looking for seems to have wandered off. It might have been removed, renamed, or currently unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Button variant="outline" size="lg" onClick={() => navigate(-1)} className="h-14 px-8 rounded-2xl gap-2 font-bold border-border/50 bg-background/60 backdrop-blur-sm hover:bg-muted/50 transition-all">
            <ArrowLeft className="h-5 w-5" /> Go Back
          </Button>
          <Button size="lg" asChild className="h-14 px-8 rounded-2xl gap-2 font-bold bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Link to="/">
              <Home className="h-5 w-5" /> Return Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;