import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';

import { useCouponCategory } from '@/hooks/useCouponCategory';
import Breadcrumbs from '@/components/Breadcrumbs';
import CategoryBadge from '@/components/coupons/CategoryBadge';
import HeroSection from '@/components/HeroSection';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { 
  ArrowLeft, Copy, ExternalLink, Flame, Clock, 
  Ticket, AlertCircle, RefreshCw, FilterX, Scissors
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const CouponCardSkeleton = () => (
  <Card className="overflow-hidden h-full flex flex-col">
    <CardHeader className="p-5 pb-0">
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-3/4 mb-2" />
      <Skeleton className="h-6 w-1/3" />
    </CardHeader>
    <CardContent className="p-5 flex-grow">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
    <CardFooter className="p-5 pt-0 mt-auto">
      <Skeleton className="h-12 w-full rounded-xl" />
    </CardFooter>
  </Card>
);

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-red-100 max-w-2xl mx-auto my-12 p-8">
    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
    <h3 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h3>
    <p className="text-gray-500 mb-6">{error.message}</p>
    <Button onClick={resetErrorBoundary} className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700">
      <RefreshCw className="mr-2 h-4 w-4" /> Try Again
    </Button>
  </div>
);

const CouponCategoryPageContent = () => {
  const { category } = useParams();
  const { 
    filteredCoupons, loading, error, filters, setFilters, 
    sortBy, setSortBy, handleCopyCode, categoryInfo, refetch, clearFilters 
  } = useCouponCategory(category);

  const displayName = categoryInfo?.name || category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Category';

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Helmet>
        <title>{displayName} Coupons & Deals | a2z Utility Hub</title>
        <meta name="description" content={`Find the best active coupons, promo codes, and deals for ${displayName}.`} />
      </Helmet>

      <HeroSection 
        title={`${displayName} Coupons`}
        subtitle={`Discover ${filteredCoupons.length} amazing deals and save on your next purchase`}
      />

      <div className="container py-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Breadcrumbs 
            items={[
              { title: "Home", to: "/" },
              { title: "Coupons", to: "/coupons" },
              { title: displayName, to: `/coupons/${category}` }
            ]} 
          />
          <Button variant="outline" asChild size="sm" className="w-fit bg-white shadow-sm hover:bg-gray-50">
            <Link to="/coupons"><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Coupons</Link>
          </Button>
        </div>

        {error && (
            <Alert variant="destructive" className="mb-8 bg-red-50 border-red-200 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Notice</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button variant="outline" size="sm" onClick={refetch} className="h-8">Retry</Button>
                </AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm border-gray-200/60 sticky top-24">
              <CardHeader className="pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8 text-gray-500 hover:text-gray-900 px-2">
                    <FilterX className="h-3 w-3 mr-1" /> Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                
                {/* Sort */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="discount">Highest Discount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Discount Range */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">Discount %</label>
                    <span className="text-xs text-brand-primary font-medium">{filters.minDiscount}% - {filters.maxDiscount}%</span>
                  </div>
                  <Slider 
                    defaultValue={[0, 100]} 
                    value={[filters.minDiscount, filters.maxDiscount]}
                    max={100} 
                    step={5} 
                    onValueChange={(vals) => setFilters(p => ({...p, minDiscount: vals[0], maxDiscount: vals[1]}))}
                  />
                </div>

                {/* Expiration */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Expiration</label>
                  <Select value={filters.maxExpiryDays} onValueChange={(val) => setFilters(p => ({...p, maxExpiryDays: val}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any time</SelectItem>
                      <SelectItem value="7">Next 7 Days</SelectItem>
                      <SelectItem value="30">Next 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <CouponCardSkeleton key={i} />)}
              </div>
            ) : filteredCoupons.length > 0 ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredCoupons.map((coupon, index) => {
                    const isTop = index < 5 && sortBy === 'popularity';
                    return (
                      <motion.div key={coupon.id} variants={itemVariants} layout className="h-full">
                        <Card className={`h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200/60 group bg-white hover:-translate-y-1 relative ${isTop ? 'border-brand-primary/20 shadow-md bg-gradient-to-br from-white to-brand-primary/5' : ''}`}>
                          
                          {isTop && (
                            <div className="absolute top-0 right-0 bg-brand-primary text-white font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10 text-xs flex items-center">
                              <Flame className="h-3 w-3 mr-1" /> Top Deal
                            </div>
                          )}

                          <CardHeader className="p-5 pb-0">
                            <div className="flex justify-between items-start mb-3">
                              <CategoryBadge category={categoryInfo || coupon.category || coupon.merchant} />
                              
                              {coupon.click_count > 0 && (
                                <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-none font-semibold">
                                  {coupon.click_count} uses
                                </Badge>
                              )}
                            </div>
                            
                            <CardTitle className="text-xl leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                              {coupon.title}
                            </CardTitle>
                            
                            {coupon.discount_value && (
                              <div className="text-2xl font-black text-green-600 mt-2">
                                {coupon.discount_value}
                              </div>
                            )}
                          </CardHeader>

                          <CardContent className="p-5 flex-grow">
                            <CardDescription className="line-clamp-3 text-sm text-gray-600">
                              {coupon.description}
                            </CardDescription>
                            
                            {coupon.expires_at && (
                              <div className="mt-4 flex items-center text-xs text-red-500 font-medium bg-red-50 px-2 py-1.5 rounded-md w-fit">
                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                Expires {formatDistanceToNow(new Date(coupon.expires_at), { addSuffix: true })}
                              </div>
                            )}
                          </CardContent>

                          <CardFooter className="p-5 pt-0 mt-auto border-t border-gray-50/50 bg-gray-50/30">
                            {coupon.code ? (
                               <div className="w-full relative group/code">
                                 <div className="absolute inset-0 bg-gray-200 border border-dashed border-gray-300 rounded-xl flex items-center justify-center font-mono font-bold text-gray-400 tracking-widest uppercase">
                                   {coupon.code}
                                 </div>
                                 <Button 
                                  onClick={() => handleCopyCode(coupon)} 
                                  className="w-full relative z-10 opacity-100 group-hover/code:opacity-0 transition-opacity bg-gray-900 text-white hover:bg-gray-800 rounded-xl h-12"
                                 >
                                  <Scissors className="mr-2 h-4 w-4" /> Show Code
                                 </Button>
                                 <Button 
                                  onClick={() => handleCopyCode(coupon)} 
                                  className="w-full absolute inset-0 z-20 opacity-0 group-hover/code:opacity-100 transition-opacity bg-brand-primary hover:bg-brand-primary-dark text-white rounded-xl h-12"
                                 >
                                  <Copy className="mr-2 h-4 w-4" /> Copy Code
                                 </Button>
                               </div>
                            ) : (
                               <Button 
                                onClick={() => handleCopyCode(coupon)} 
                                className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white rounded-xl h-12 font-semibold shadow-sm"
                               >
                                <ExternalLink className="mr-2 h-4 w-4" /> Get Deal
                               </Button>
                            )}
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Ticket className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Coupons Found</h3>
                <p className="text-gray-500 mb-8 max-w-md">We couldn't find any active offers matching your criteria for {displayName}.</p>
                <div className="flex gap-4">
                  <Button onClick={clearFilters} variant="outline" className="border-gray-300">
                    Clear Filters
                  </Button>
                  <Button asChild className="bg-brand-primary">
                    <Link to="/coupons">Browse All Deals</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CouponCategoryPage = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CouponCategoryPageContent />
    </ErrorBoundary>
  );
};

export default CouponCategoryPage;