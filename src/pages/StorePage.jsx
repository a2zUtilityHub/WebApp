import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, WifiOff, RefreshCw, AlertCircle, PackageX, Activity, RotateCcw } from 'lucide-react';
import ErrorBoundaryWithRetry from '@/components/ErrorBoundaryWithRetry';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';
import ProductsList from '@/components/ProductsList';
import HeroSection from '@/components/HeroSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProducts } from '@/api/EcommerceApi';
import { useResilientQuery } from '@/hooks/useResilientQuery';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { logDiagnostics } from '@/utils/supabaseConnectionDiagnostics';
import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseHorizontal from '@/components/ads/AdSenseHorizontal';
import AdSidebarLayoutWrapper from '@/components/ads/AdSidebarLayoutWrapper';

const StorePageContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [diagnosticResults, setDiagnosticResults] = useState(null);

  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (isDev) {
      logDiagnostics().then(setDiagnosticResults);
    }
  }, [isDev]);

  const { data: productsData, loading, error, refetch, isOffline, retryCount } = useResilientQuery(
    'ecommerce_products', 
    async () => await getProducts(), 
    { ttlMinutes: 10, maxRetries: 3 }
  );
  
  const products = productsData?.products || [];
  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      ))}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-gray-50/50 flex-grow w-full flex flex-col items-center">
      <Helmet>
        <title>Store | a2z Utility Hub</title>
        <meta name="description" content="Browse our exclusive collection of high-quality products. Shop now for the best deals!" />
      </Helmet>
      
      {isDev && diagnosticResults && (
        <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-gray-700 max-w-sm text-xs">
          <div className="flex items-center gap-2 font-bold mb-2 text-brand-primary">
            <Activity className="h-4 w-4" /> Diagnostic Panel (DEV)
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
             <div>Client Init: {diagnosticResults.clientInitialized ? '✅' : '❌'}</div>
             <div>DB Conn: {diagnosticResults.databaseConnection ? '✅' : '❌'}</div>
             <div>Auth Conn: {diagnosticResults.authConnection ? '✅' : '❌'}</div>
             <div>Store Query: {retryCount > 0 ? `Retried ${retryCount}x` : 'OK ✅'}</div>
          </div>
          {error && <div className="text-red-400 mt-2">Error: {error}</div>}
        </div>
      )}

      <HeroSection 
        title="Welcome to Our Store"
        subtitle="Shop premium products and exclusive deals"
      />

      <AdSenseContainer className="w-full px-4">
        <AdSenseHorizontal slot="store_top" />
      </AdSenseContainer>

      <div className="py-8 w-full px-4">
        <AdSidebarLayoutWrapper 
          leftAdSlots={['store_left_1', 'store_left_2']} 
          rightAdSlots={['store_right_1', 'store_right_2']}
        >
          <div className="flex-1 w-full min-w-0">
            <div className="section-header text-left">
              <h2 className="section-title">Latest Products</h2>
              <p className="section-subtitle">Discover our handpicked selection of top-rated items.</p>
            </div>

            {isOffline && (
              <Alert variant="destructive" className="mb-6 border-orange-500 bg-orange-50 text-orange-800">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>You are offline</AlertTitle>
                <AlertDescription>
                  Please check your internet connection. Some features may be unavailable.
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-white p-4 md:p-5 rounded-3xl border border-gray-200 shadow-sm mb-8 w-full">
              <div className="flex items-center gap-3 w-full">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-11 pr-10 bg-gray-50/50 border-gray-200 text-gray-900 focus-visible:ring-brand-primary h-11 w-full rounded-2xl transition-all" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary z-10"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="hidden md:flex bg-brand-primary/10 p-2.5 rounded-xl items-center justify-center border border-brand-primary/20 shrink-0">
                  <ShoppingBag className="h-5 w-5 text-brand-primary" />
                </div>
              </div>
            </div>

            <ErrorBoundaryWithRetry onRetry={refetch}>
              {loading ? (
                renderSkeletons()
              ) : error && !products.length ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-200 shadow-sm w-full">
                  <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load products</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">{error}</p>
                  <Button onClick={refetch} className="gap-2">
                    <RefreshCw className="h-4 w-4" /> Try Again
                  </Button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-200 shadow-sm w-full">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <PackageX className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    {searchTerm ? `We couldn't find any products matching "${searchTerm}".` : "There are currently no products available in the store."}
                  </p>
                  {searchTerm && <Button variant="outline" onClick={() => setSearchTerm('')}>Clear Search</Button>}
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }} 
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    <ProductsList products={filteredProducts.slice(0, 6)} />
                    
                    {filteredProducts.length > 6 && (
                      <AdSenseContainer className="w-full">
                        <AdSenseHorizontal slot="store_mid" />
                      </AdSenseContainer>
                    )}

                    {filteredProducts.length > 6 && (
                      <div className="mt-8 w-full">
                         <ProductsList products={filteredProducts.slice(6)} />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </ErrorBoundaryWithRetry>
          </div>
        </AdSidebarLayoutWrapper>
      </div>
    </motion.div>
  );
};

const StorePage = () => (
  <GlobalErrorBoundary>
    <StorePageContent />
  </GlobalErrorBoundary>
);

export default StorePage;