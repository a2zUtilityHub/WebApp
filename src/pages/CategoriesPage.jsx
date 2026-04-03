
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
    <div className="min-h-screen bg-gray-50/50 pb-20 w-full">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {[...Array(12)].map((_, i) => (
              <Card key={i} className="border-gray-200 w-full">
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
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full"
          >
            {categories.map(category => (
              <motion.div key={category.id} variants={itemVariants} className="w-full">
                <Link to={`/categories/${category.slug || category.id}`} className="block h-full group w-full">
                  <Card className="h-full flex flex-col hover:shadow-xl hover:border-brand-primary/40 transition-all duration-300 border-gray-200/80 bg-white group-hover:-translate-y-1 w-full">
                    <CardContent className="p-6 flex flex-col items-center text-center flex-grow w-full">
                      <div className="h-16 w-16 rounded-2xl bg-brand-primary/5 text-brand-primary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-sm">
                        {category.icon_url ? (
                          <img src={category.icon_url} alt="" className="h-8 w-8 object-contain" />
                        ) : (
                          <FolderOpen className="h-8 w-8" />
                        )}
                      </div>
                      
                      <CardTitle className="text-lg mb-2 text-gray-800 group-hover:text-brand-primary transition-colors capitalize">
                        {category.name}
                      </CardTitle>
                      
                      <Badge variant="secondary" className="mt-auto bg-gray-100 text-gray-600 font-medium px-3 py-1 border-none shadow-sm">
                        {category.item_count} Item{category.item_count !== 1 && 's'}
                      </Badge>
                    </CardContent>
                    <div className="border-t border-gray-50 p-3 bg-gray-50/50 flex justify-center items-center text-sm font-semibold text-gray-500 group-hover:text-brand-primary group-hover:bg-brand-primary/5 transition-colors w-full">
                       Explore <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-white rounded-xl shadow-sm border border-gray-100 w-full">
            <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500">Check back later for new content.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
