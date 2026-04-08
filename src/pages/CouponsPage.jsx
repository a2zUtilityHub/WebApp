import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Search, AlertCircle, RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import CouponCodeDisplay from '@/components/coupons/CouponCodeDisplay';
import DealDisplay from '@/components/coupons/DealDisplay';
import HeroSection from '@/components/HeroSection';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { motion } from 'framer-motion';
import AdSidebarLayoutWrapper from '@/components/ads/AdSidebarLayoutWrapper';

const ITEMS_PER_PAGE = 12;

const POPULAR_BRANDS = [
  { name: 'Amazon', slug: 'amazon', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  { name: 'Flipkart', slug: 'flipkart', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
  { name: 'MakeMyTrip', slug: 'makemytrip', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  { name: 'Dominos', slug: 'dominos', color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' },
  { name: 'BigBasket', slug: 'bigbasket', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

const CouponSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[300px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'all',
    merchant: 'all',
    sort: 'latest',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [categoriesRes, merchantsRes, couponsRes] = await Promise.all([
        supabase.from('categories').select('*').eq('type', 'Coupon').order('name'),
        supabase.from('merchants').select('*').order('name'),
        supabase
          .from('coupons')
          .select('*, merchant:merchants(*), category:categories(*)')
          .in('status', ['published', 'active'])
          .eq('is_active', true)
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      setCategories(categoriesRes.data || []);

      if (merchantsRes.error) throw merchantsRes.error;
      setMerchants(merchantsRes.data || []);
      
      if (couponsRes.error) throw couponsRes.error;
      setCoupons(couponsRes.data || []);

    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError(err.message || 'Failed to load coupons');
      toast({ 
        title: "Error fetching data", 
        description: err.message || 'Failed to load coupons', 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const filteredAndSortedCoupons = useMemo(() => {
    let filtered = coupons;

    if (activeTab === 'coupons') {
      filtered = filtered.filter(c => c.type?.toLowerCase() === 'coupon');
    } else if (activeTab === 'deals') {
      filtered = filtered.filter(c => c.type?.toLowerCase() === 'deal' || c.type?.toLowerCase() === 'deals');
    }

    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.title?.toLowerCase().includes(search) || 
        c.description?.toLowerCase().includes(search)
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(c => c.category?.slug === filters.category);
    }

    if (filters.merchant !== 'all') {
      filtered = filtered.filter(c => c.merchant_id?.toString() === filters.merchant);
    }

    return filtered.sort((a, b) => {
      if (filters.sort === 'latest') return new Date(b.created_at) - new Date(a.created_at);
      if (filters.sort === 'trending') return (b.click_count || 0) - (a.click_count || 0);
      if (filters.sort === 'expiring' && a.expires_at && b.expires_at) return new Date(a.expires_at) - new Date(b.expires_at);
      return 0;
    });
  }, [coupons, filters, activeTab]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedCoupons.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedCoupons, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedCoupons.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filters]);

  const couponCount = useMemo(() => coupons.filter(c => c.type?.toLowerCase() === 'coupon').length, [coupons]);
  const dealCount = useMemo(() => coupons.filter(c => c.type?.toLowerCase() === 'deal' || c.type?.toLowerCase() === 'deals').length, [coupons]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-20 bg-background w-full flex flex-col flex-grow relative overflow-hidden">
      {/* Soft Glowing Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <Helmet>
        <title>Coupons & Deals - a2z Utility Hub</title>
        <meta name="description" content="Find the latest and greatest coupons, deals, and promo codes from your favorite brands. Save money on every purchase." />
      </Helmet>
      
      <HeroSection 
        title="Welcome to Our Coupons"
        subtitle="Find amazing deals and save on your favorite products"
      />

      <div className="py-8 w-full px-4">
        <AdSidebarLayoutWrapper leftAdSlots={['coupons_left_1', 'coupons_left_2']} rightAdSlots={['coupons_right_1', 'coupons_right_2']}>
          <div className="w-full min-w-0 relative z-10">
            <div className="section-header text-left mb-10">
              <h2 className="text-4xl font-extrabold tracking-tight text-foreground">Daily Deals & Coupons</h2>
              <p className="text-lg text-muted-foreground mt-2">Browse through our extensive list of savings and discounts.</p>
            </div>

            <div className="bg-background/60 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-border/50 mb-10 w-full hover:shadow-md transition-shadow">
              <h2 className="text-xl font-extrabold text-foreground mb-5 flex items-center">
                <div className="bg-primary/10 p-2 rounded-xl mr-3"><ShoppingBag className="h-5 w-5 text-primary" /></div>
                Top Brands & Categories
              </h2>
              <div className="flex flex-wrap gap-3">
                {POPULAR_BRANDS.map((brand) => (
                  <Link 
                    key={brand.slug} 
                    to={`/coupons/${brand.slug}`}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center ${brand.color}`}
                  >
                    {brand.name}
                    <ArrowRight className="h-4 w-4 ml-2 opacity-50" />
                  </Link>
                ))}
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10 w-full relative z-10">
              <TabsList className="grid w-full max-w-md grid-cols-3 mb-8 bg-background/60 backdrop-blur-md shadow-sm border border-border/50 rounded-2xl p-1 h-14">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl font-semibold text-[15px]">All ({coupons.length})</TabsTrigger>
                <TabsTrigger value="coupons" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl font-semibold text-[15px]">Coupons ({couponCount})</TabsTrigger>
                <TabsTrigger value="deals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl font-semibold text-[15px]">Deals ({dealCount})</TabsTrigger>
              </TabsList>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 p-5 bg-background/60 backdrop-blur-xl rounded-[2rem] shadow-sm border border-border/50 w-full">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Search coupons..."
                    className="pl-12 bg-background/80 h-12 border-input text-foreground focus-visible:ring-4 focus-visible:ring-primary/10 hover:border-primary/50 shadow-sm rounded-2xl transition-all"
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  />
                </div>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger className="bg-background/80 h-12 border-input text-foreground focus:ring-4 focus:ring-primary/10 hover:border-primary/50 shadow-sm rounded-2xl transition-all"><SelectValue placeholder="All Categories" /></SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50 bg-background/80 backdrop-blur-xl shadow-xl">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => <SelectItem key={cat.id} value={cat.slug} className="rounded-xl">{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filters.merchant} onValueChange={(value) => handleFilterChange('merchant', value)}>
                  <SelectTrigger className="bg-background/80 h-12 border-input text-foreground focus:ring-4 focus:ring-primary/10 hover:border-primary/50 shadow-sm rounded-2xl transition-all"><SelectValue placeholder="All Merchants" /></SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50 bg-background/80 backdrop-blur-xl shadow-xl">
                    <SelectItem value="all">All Merchants</SelectItem>
                    {merchants.map(mer => <SelectItem key={mer.id} value={String(mer.id)} className="rounded-xl">{mer.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filters.sort} onValueChange={(value) => handleFilterChange('sort', value)}>
                  <SelectTrigger className="bg-background/80 h-12 border-input text-foreground focus:ring-4 focus:ring-primary/10 hover:border-primary/50 shadow-sm rounded-2xl transition-all"><SelectValue placeholder="Sort By" /></SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50 bg-background/80 backdrop-blur-xl shadow-xl">
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="expiring">Expiring Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-8">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription className="flex items-center justify-between">
                    <span>{error}</span>
                    <Button variant="outline" size="sm" onClick={fetchData} className="bg-white text-destructive border-destructive/20 hover:bg-destructive hover:text-white">
                      <RefreshCw className="h-4 w-4 mr-2" /> Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <TabsContent value="all" className="mt-0 w-full">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(8)].map((_, i) => <CouponSkeleton key={i} />)}
                  </div>
                ) : paginatedCoupons.length > 0 ? (
                  <>
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                      {paginatedCoupons.map(coupon => {
                        const type = coupon.type?.toLowerCase();
                        return (
                          <motion.div key={coupon.id} variants={itemVariants} className="h-full">
                            {type === 'coupon' ? <CouponCodeDisplay coupon={coupon} /> : <DealDisplay coupon={coupon} />}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                    {totalPages > 1 && (
                      <Pagination className="mt-12 w-full justify-center">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              href="#" 
                              onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} 
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'text-brand-primary hover:bg-brand-primary/10'}
                            />
                          </PaginationItem>
                          {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            const page = i + 1;
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink 
                                  href="#" 
                                  onClick={(e) => { e.preventDefault(); handlePageChange(page); }} 
                                  isActive={currentPage === page}
                                  className={currentPage === page ? "bg-brand-primary text-white" : "hover:text-brand-primary"}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                          <PaginationItem>
                            <PaginationNext 
                              href="#" 
                              onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} 
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'text-brand-primary hover:bg-brand-primary/10'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </>
                ) : (
                  <div className="text-center py-24 bg-background/60 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-border/50 w-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 opacity-5 bg-gradient-to-bl from-primary to-transparent rounded-bl-full z-0 w-48 h-48"></div>
                    <div className="mx-auto w-20 h-20 bg-muted/50 border border-border/50 shadow-sm rounded-full flex items-center justify-center mb-6 relative z-10">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-foreground relative z-10">No coupons or deals found</h2>
                    <p className="text-muted-foreground text-lg mt-3 relative z-10">Try adjusting your filters or check back later for new offers.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="coupons" className="mt-0">
                {/* Coupon Tab Contents... */}
              </TabsContent>

              <TabsContent value="deals" className="mt-0">
                {/* Deal Tab Contents... */}
              </TabsContent>
            </Tabs>
          </div>
        </AdSidebarLayoutWrapper>
      </div>
    </motion.div>
  );
};

export default CouponsPage;