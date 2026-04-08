import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCategories } from '@/hooks/useCategories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Layers, FolderOpen, ArrowRight, AlertCircle } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import Breadcrumbs from '@/components/Breadcrumbs';

const CategoriesPage = () => {
  const { categories, loading, error, fetchCategoriesWithCounts } = useCategories();

  useEffect(() => {
    fetchCategoriesWithCounts();
  }, [fetchCategoriesWithCounts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-background pb-20 w-full relative overflow-hidden">
      {/* Background Glowing Orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <Helmet>
        <title>All Categories | Apps, Blogs & Deals - a2z Utility Hub</title>
        <meta name="description" content="Browse our complete directory of utility apps, informative blogs, and exclusive discount coupons across all categories." />
      </Helmet>

      <HeroSection 
        title="Content Directory"
        subtitle="Explore all our apps, articles, and deals neatly organized by category"
      />

      <div className="w-full px-4 py-8 md:py-12">
        <Breadcrumbs items={[{ title: "Home", to: "/" }, { title: "Categories", to: "/categories" }]} className="mb-8" />

        <div className="section-header text-center mb-10 w-full">
          <h2 className="section-title flex items-center justify-center gap-3">
            <Layers className="text-brand-primary h-8 w-8" />
            Browse By Category
          </h2>
          <p className="section-subtitle">
            Find exactly what you're looking for. Select a category below to see top apps, informative articles, and the best deals.
          </p>
        </div>

        {error && (
            <Alert variant="destructive" className="mb-8 w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Notice</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full relative z-10">
            {[...Array(12)].map((_, i) => (
              <Card key={i} className="border border-border/50 bg-background/60 backdrop-blur-md rounded-3xl w-full">
                <CardContent className="p-6 flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full relative z-10"
          >
            {categories.map(category => (
              <motion.div key={category.id} variants={itemVariants} className="w-full">
                <Link to={`/categories/${category.slug || category.id}`} className="block h-full group w-full">
                  <Card className="h-full flex flex-col hover:shadow-xl hover:border-primary/40 transition-all duration-500 border border-border/50 bg-background/60 backdrop-blur-xl group-hover:-translate-y-2 w-full rounded-[2rem] overflow-hidden">
                    <CardContent className="p-8 flex flex-col items-center text-center flex-grow w-full relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="h-20 w-20 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm border border-primary/20 z-10">
                        {category.icon_url ? (
                          <img src={category.icon_url} alt="" className="h-10 w-10 object-contain" />
                        ) : (
                          <FolderOpen className="h-10 w-10" />
                        )}
                      </div>
                      
                      <CardTitle className="text-xl font-extrabold mb-3 text-foreground group-hover:text-primary transition-colors capitalize z-10">
                        {category.name}
                      </CardTitle>
                      
                      <Badge variant="secondary" className="mt-auto bg-muted text-muted-foreground font-semibold px-4 py-1.5 border-0 shadow-sm z-10">
                        {category.item_count} Item{category.item_count !== 1 && 's'}
                      </Badge>
                    </CardContent>
                    <div className="border-t border-border/50 p-4 bg-muted/10 flex justify-center items-center text-[15px] font-bold text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-colors w-full z-10 relative">
                       Explore Category <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-28 bg-background/60 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-border/50 w-full relative z-10">
            <div className="bg-muted/50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-border/50 shadow-sm">
                <FolderOpen className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">No categories found</h3>
            <p className="text-muted-foreground text-lg">Check back later for new content and updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;