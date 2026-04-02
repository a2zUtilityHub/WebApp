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

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
          <Button size="lg" asChild className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" /> Go Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;