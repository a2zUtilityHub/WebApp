import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/lib/customSupabaseClient';
import AppCard from '@/components/apps/AppCard';
import HeroSection from '@/components/HeroSection';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import ErrorBoundaryWithRetry from '@/components/ErrorBoundaryWithRetry';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';
import { useResilientQuery } from '@/hooks/useResilientQuery';

import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseResponsive from '@/components/ads/AdSenseResponsive';
import AdSenseHorizontal from '@/components/ads/AdSenseHorizontal';
import AdSidebarLayoutWrapper from '@/components/ads/AdSidebarLayoutWrapper';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const AppsPageContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('is_featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const appsPerPage = 16;

  const { data: appsData, loading: appsLoading, error: appsError, refetch: refetchApps } = useResilientQuery('all_apps', () =>
    supabase.from('apps')
      .select('*, categories!apps_categories(id, name, slug)')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
  );

  const { data: categories, loading: catsLoading } = useResilientQuery('app_categories', () =>
    supabase.from('categories').select('*').eq('type', 'App').order('name')
  );

  const loading = appsLoading || catsLoading;
  const apps = appsData || [];

  const filteredAndSortedApps = useMemo(() => {
    return apps
      .filter(app => {
        const searchTermMatch = app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = selectedCategory === 'all' ||
          app.categories?.some(c => c && c.slug === selectedCategory);
        return searchTermMatch && categoryMatch;
      })
      .sort((a, b) => {
        if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
        if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
        if (sortOption === 'is_featured') return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
        return 0;
      });
  }, [apps, searchTerm, sortOption, selectedCategory]);

  const totalPages = Math.ceil(filteredAndSortedApps.length / appsPerPage) || 1;
  const paginatedApps = useMemo(() => {
    const startIndex = (currentPage - 1) * appsPerPage;
    return filteredAndSortedApps.slice(startIndex, startIndex + appsPerPage);
  }, [filteredAndSortedApps, currentPage]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortOption('is_featured');
    setCurrentPage(1);
  };

  return (
    <motion.div initial="hidden" animate="show" exit={{ opacity: 0 }} variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="w-full flex flex-col items-center flex-grow">
      <Helmet>
        <title>Applications - A2Z Utility Hub</title>
        <meta name="description" content="Discover powerful productivity applications to simplify your digital life." />
      </Helmet>

      <HeroSection
        title="Welcome to Our Apps"
        subtitle="Explore our complete collection of innovative applications designed for you"
      />

      <div className="bg-background py-16 w-full px-4 relative overflow-hidden">
        {/* Soft Glowing Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

        <AdSidebarLayoutWrapper leftAdSlots={['apps_left_1', 'apps_left_2']} rightAdSlots={['apps_right_1', 'apps_right_2']}>
          <div className="w-full min-w-0 relative z-10">
            <div className="section-header text-left mb-10">
              <h2 className="text-4xl font-extrabold tracking-tight text-foreground">Our Toolkit</h2>
              <p className="text-lg text-muted-foreground mt-2">Find and use the perfect tools for your everyday tasks.</p>
            </div>

            <div className="bg-background/60 backdrop-blur-2xl p-5 md:p-6 rounded-[2rem] border border-border/50 shadow-sm mb-10 w-full relative z-10">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full">

                <div className="relative flex-1 min-w-0 group">
                  <LucideIcons.Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                  <Input
                    placeholder="Search premium applications..."
                    className="pl-12 pr-10 bg-background/80 border-input text-foreground focus-visible:ring-4 focus-visible:ring-primary/10 hover:border-primary/50 shadow-sm h-12 w-full rounded-2xl transition-all"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary z-10"
                    >
                      <LucideIcons.X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-row items-center gap-2 md:gap-3 shrink-0">
                  <div className="flex-1 md:flex-none">
                    <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val); setCurrentPage(1); }}>
                      <SelectTrigger className="w-full md:w-[180px] bg-background/80 h-12 border-input text-foreground focus:ring-4 focus:ring-primary/10 hover:border-primary/50 shadow-sm rounded-2xl transition-all">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/50 bg-background/80 backdrop-blur-xl shadow-xl">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories?.map(cat => <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 md:flex-none">
                    <Select value={sortOption} onValueChange={(val) => { setSortOption(val); setCurrentPage(1); }}>
                      <SelectTrigger className="w-full md:w-[160px] bg-background/80 h-12 border-input text-foreground focus:ring-4 focus:ring-primary/10 hover:border-primary/50 shadow-sm rounded-2xl transition-all">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/50 bg-background/80 backdrop-blur-xl shadow-xl">
                        <SelectItem value="is_featured">Featured</SelectItem>
                        <SelectItem value="name-asc">A-Z</SelectItem>
                        <SelectItem value="name-desc">Z-A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearFilters}
                    className="h-11 w-11 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl shrink-0 border border-gray-100 md:border-0"
                    title="Reset Filters"
                  >
                    <LucideIcons.RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

              </div>
            </div>

            <ErrorBoundaryWithRetry onRetry={refetchApps}>
              {appsError && !apps.length ? (() => { throw new Error(appsError); })() : null}

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3 bg-white rounded-xl p-6 border border-gray-200 shadow-sm w-full">
                      <Skeleton className="h-12 w-12 rounded-lg mb-2" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full mt-2" />
                      <Skeleton className="h-10 w-full mt-4" />
                    </div>
                  ))}
                </div>
              ) : paginatedApps.length > 0 ? (
                <>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full"
                  >
                    <AnimatePresence mode="popLayout">
                      {paginatedApps.map((app, index) => (
                        <React.Fragment key={app.id}>
                          <AppCard app={app} index={index} />
                          {index === 5 && (
                            <div className="col-span-full w-full">
                              <AdSenseContainer className="w-full">
                                <AdSenseResponsive slot="apps_mid" />
                              </AdSenseContainer>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </>
              ) : (
                <div className="text-center py-24 px-8 bg-background/60 backdrop-blur-xl rounded-[2.5rem] border border-border/50 shadow-lg w-full relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-16 opacity-5 bg-gradient-to-bl from-primary to-transparent rounded-bl-full z-0 w-48 h-48"></div>
                  <div className="mx-auto w-20 h-20 bg-muted/50 border border-border/50 shadow-sm rounded-full flex items-center justify-center mb-6 relative z-10">
                    <LucideIcons.Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mb-3 text-2xl font-extrabold text-foreground relative z-10">No applications found</h3>
                  <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto relative z-10">We couldn't find any apps matching your search criteria. Try adjusting your filters.</p>
                  <Button variant="outline" className="h-12 px-8 rounded-xl border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm relative z-10" onClick={handleClearFilters}>Clear All Filters</Button>
                </div>
              )}
            </ErrorBoundaryWithRetry>

            {!loading && paginatedApps.length > 0 && totalPages > 1 && (
              <div className="mt-8 flex justify-center w-full">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-brand-primary/10'}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="px-4 py-2 text-sm font-medium text-gray-700">Page {currentPage} of {totalPages}</span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-brand-primary/10'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </AdSidebarLayoutWrapper>
        
        <AdSenseContainer className="mt-12 w-full px-4">
            <AdSenseHorizontal slot="apps_footer" />
        </AdSenseContainer>
      </div>
    </motion.div>
  );
};

const AppsPage = () => (
  <GlobalErrorBoundary>
    <AppsPageContent />
  </GlobalErrorBoundary>
);

export default AppsPage;