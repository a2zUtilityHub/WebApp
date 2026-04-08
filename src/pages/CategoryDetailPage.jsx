import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertCircle, RefreshCw, FolderSearch, BugPlay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/Breadcrumbs';
import { fetchCategoryBySlug, diagnosticListAllCategories } from '@/utils/categoryQueryHandler';
import { useCategoryItems } from '@/hooks/useCategoryItems';

import CategoryHeroSection from '@/components/categories/CategoryHeroSection';
import CategoryDataSection from '@/components/categories/CategoryDataSection';

// Error Fallback for the entire page or specific sections
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-10 text-center bg-background/60 backdrop-blur-xl border border-border/50 shadow-lg rounded-[2.5rem] m-4 md:m-8 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-16 opacity-5 bg-gradient-to-bl from-destructive to-transparent rounded-bl-full z-0 w-48 h-48"></div>
    <AlertCircle className="w-16 h-16 text-destructive mb-6 relative z-10" />
    <h2 className="text-3xl font-extrabold text-foreground mb-3 relative z-10">Something went wrong</h2>
    <p className="text-muted-foreground text-lg mb-8 max-w-md relative z-10">{error.message}</p>
    <Button onClick={resetErrorBoundary} size="lg" className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-bold relative z-10">
      <RefreshCw className="mr-3 h-5 w-5" /> Try Again
    </Button>
  </div>
);

const CategoryDetailPageContent = () => {
  const { category: categorySlug } = useParams();
  const initializedDiagnostics = useRef(false);
  
  // Dump all DB categories once on mount
  useEffect(() => {
    if (!initializedDiagnostics.current) {
      initializedDiagnostics.current = true;
      diagnosticListAllCategories();
    }
  }, []);

  console.log(`\n======== FLOW START: /categories/${categorySlug} ========`);
  console.log('[FLOW] 1. Slug from URL:', categorySlug);

  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  // Fetch Category Info
  useEffect(() => {
    const loadCategory = async () => {
      console.log(`[FLOW] 2. Initializing loadCategory for slug: ${categorySlug}`);
      setLoadingCategory(true);
      setCategoryError(null);
      try {
        const { data, error: fetchErr } = await fetchCategoryBySlug(categorySlug);
        
        if (fetchErr) {
          console.error(`[FLOW] 3. Category fetch error:`, fetchErr);
          throw fetchErr;
        }
        
        if (!data) {
          console.error(`[FLOW] 3. Category not found for slug: ${categorySlug}`);
          throw new Error("CATEGORY_NOT_FOUND");
        }
        
        console.log(`[FLOW] 3. Category fetched successfully. ID=${data.id}, Name=${data.name}`);
        setCategoryInfo(data);
      } catch (err) {
        console.error(`[FLOW] 3. Error in loadCategory try/catch:`, err);
        setCategoryError(err.message === "CATEGORY_NOT_FOUND" ? "CATEGORY_NOT_FOUND" : err.message);
      } finally {
        setLoadingCategory(false);
      }
    };
    
    if (categorySlug) {
      loadCategory();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [categorySlug]);

  // Pass categoryInfo?.id to hooks (they will wait until it's truthy, or return loading)
  const categoryId = categoryInfo?.id;
  
  if (categoryInfo && !loadingCategory) {
    console.log(`[FLOW] 4. Passing Category ID to hooks:`, categoryId);
  }

  const apps = useCategoryItems(categoryId, 'apps');
  const deals = useCategoryItems(categoryId, 'deals');
  const coupons = useCategoryItems(categoryId, 'coupons');
  const blogs = useCategoryItems(categoryId, 'blogs');

  // Final diagnostic log
  useEffect(() => {
    if (!apps.loading && !deals.loading && !coupons.loading && !blogs.loading && categoryId) {
      console.log(`\n[FLOW] --- FINAL HOOK DATA LOADED FOR: ${categoryInfo?.name} ---`);
      console.log('[FLOW] Apps:', apps.data?.length, 'items', apps.error ? `(Error: ${apps.error})` : '');
      console.log('[FLOW] Deals:', deals.data?.length, 'items', deals.error ? `(Error: ${deals.error})` : '');
      console.log('[FLOW] Coupons:', coupons.data?.length, 'items', coupons.error ? `(Error: ${coupons.error})` : '');
      console.log('[FLOW] Blogs:', blogs.data?.length, 'items', blogs.error ? `(Error: ${blogs.error})` : '');
      
      const totalItems = apps.count + deals.count + coupons.count + blogs.count;
      console.log(`[FLOW] TOTAL ITEMS DISPLAYED: ${totalItems}`);
      console.log('======== FLOW END ========\n');
    }
  }, [apps.loading, deals.loading, coupons.loading, blogs.loading, categoryId, apps.count, deals.count, coupons.count, blogs.count, categoryInfo, apps.data, deals.data, coupons.data, blogs.data, apps.error, deals.error, coupons.error, blogs.error]);

  // Handle 404
  if (categoryError === "CATEGORY_NOT_FOUND") {
    return <Navigate to="/categories" replace />;
  }

  if (categoryError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <BugPlay className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Failed to load category</h2>
        <p className="text-gray-500 mb-6 max-w-md">{categoryError}</p>
        <Button asChild><Link to="/categories">Browse Categories</Link></Button>
      </div>
    );
  }

  const displayName = categoryInfo?.name || 'Loading Category...';

  // Check if everything is completely loaded and completely empty
  const allSectionsLoaded = !loadingCategory && categoryId && !apps.loading && !deals.loading && !coupons.loading && !blogs.loading;
  const allSectionsEmpty = apps.count === 0 && deals.count === 0 && coupons.count === 0 && blogs.count === 0;

  // Additional check if there are explicit hook errors to show them
  const hasHookErrors = apps.error || deals.error || coupons.error || blogs.error;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Helmet>
        <title>{displayName} Top Tools, Blogs & Deals | a2z Utility Hub</title>
        <meta name="description" content={`Discover the best apps, articles, deals and coupons related to ${displayName}. Curated for optimal productivity and savings.`} />
      </Helmet>

      <CategoryHeroSection categoryInfo={categoryInfo} loading={loadingCategory} />

      <div className="container max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        <Breadcrumbs 
          className="mb-8"
          items={[
            { title: 'Categories', to: '/categories' },
            { title: displayName, to: '#' }
          ]} 
        />

        {allSectionsLoaded && allSectionsEmpty && !hasHookErrors ? (
          <div className="py-28 flex flex-col items-center justify-center text-center px-8 bg-background/60 backdrop-blur-xl rounded-[2.5rem] border border-border/50 shadow-sm mt-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-16 opacity-5 bg-gradient-to-bl from-primary to-transparent rounded-bl-full z-0 w-48 h-48"></div>
            <div className="mx-auto w-24 h-24 bg-muted/50 border border-border/50 shadow-sm rounded-full flex items-center justify-center mb-6 relative z-10">
              <FolderSearch className="h-12 w-12 text-muted-foreground/60" />
            </div>
            <h3 className="text-3xl font-extrabold mb-3 text-foreground relative z-10">No Content Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg relative z-10">
              We haven't added any apps, deals, coupons, or articles to the <strong className="text-foreground">{displayName}</strong> category yet. Check back soon!
            </p>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-border/50 bg-background/60 backdrop-blur-sm hover:bg-muted shadow-sm font-bold relative z-10">
              <Link to="/categories">Explore Other Categories</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <CategoryDataSection 
                type="apps" 
                title="Apps & Tools" 
                items={apps.data}
                loading={loadingCategory || apps.loading}
                error={apps.error}
                viewAllLink="/apps"
              />
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <CategoryDataSection 
                type="deals" 
                title="Top Deals" 
                items={deals.data}
                loading={loadingCategory || deals.loading}
                error={deals.error}
                viewAllLink="/popular-deals"
              />
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <CategoryDataSection 
                type="coupons" 
                title="Active Coupons" 
                items={coupons.data}
                loading={loadingCategory || coupons.loading}
                error={coupons.error}
                viewAllLink="/coupons"
              />
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <CategoryDataSection 
                type="blogs" 
                title="Latest Articles" 
                items={blogs.data}
                loading={loadingCategory || blogs.loading}
                error={blogs.error}
                viewAllLink="/blogs"
              />
            </ErrorBoundary>
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryDetailPage = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CategoryDetailPageContent />
    </ErrorBoundary>
  );
};

export default CategoryDetailPage;