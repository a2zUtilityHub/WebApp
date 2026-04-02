import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Inbox } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const SectionSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex flex-col space-y-3 p-4 border rounded-xl bg-white/50">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    ))}
  </div>
);

const Section = ({ 
  title, 
  count = 0, 
  viewAllLink, 
  isLoading, 
  isEmpty, 
  children,
  emptyMessage = "No items found in this section.",
  error = null,
  onRetry
}) => {
  return (
    <section className="py-8 border-b border-gray-100 dark:border-gray-800 last:border-0 relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h2>
            {!isLoading && count > 0 && (
              <span className="bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 rounded-full text-sm font-semibold">
                {count}
              </span>
            )}
          </div>
          <div className="h-1 w-12 bg-brand-primary rounded-full mt-2"></div>
        </div>
        
        {viewAllLink && !isEmpty && !isLoading && (
          <Button variant="ghost" asChild className="hidden sm:flex text-gray-600 hover:text-brand-primary hover:bg-brand-primary/5">
            <Link to={viewAllLink}>
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        )}
      </div>

      {error ? (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          {onRetry && (
             <Button onClick={onRetry} variant="outline" className="border-red-200 text-red-600 hover:bg-red-100">
               Try Again
             </Button>
          )}
        </div>
      ) : isLoading ? (
        <SectionSkeleton />
      ) : isEmpty ? (
        <div className="py-12 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-4">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
        >
          <AnimatePresence mode="popLayout">
            {children}
          </AnimatePresence>
        </motion.div>
      )}
      
      {viewAllLink && !isEmpty && !isLoading && (
        <Button variant="outline" asChild className="w-full mt-6 sm:hidden border-gray-200">
          <Link to={viewAllLink}>
            View All {title} <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      )}
    </section>
  );
};

export default Section;