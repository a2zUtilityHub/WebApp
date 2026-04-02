
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';
import ErrorBoundaryWithRetry from '@/components/ErrorBoundaryWithRetry';
import AppCard from '@/components/apps/AppCard';
import CouponCard from '@/components/coupons/CouponCard';
import BlogCard from '@/components/blog/BlogCard';
import HeroSection from '@/components/HeroSection';
import { useResilientQuery } from '@/hooks/useResilientQuery';
import { motion } from 'framer-motion';

import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseHorizontal from '@/components/ads/AdSenseHorizontal';
import AdSenseResponsive from '@/components/ads/AdSenseResponsive';
import AdSidebarLayoutWrapper from '@/components/ads/AdSidebarLayoutWrapper';
import { useAdSense } from '@/contexts/AdSenseProvider';

const SectionSkeleton = ({ count = 4, className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" }) => (
  <div className={className}>
    {Array(count).fill(0).map((_, i) => (
      <div key={i} className="flex flex-col space-y-4 glass-card p-6 border-t-2 border-brand-primary/20">
        <Skeleton variant="card" className="h-[200px]" />
        <Skeleton variant="line" lines={2} />
      </div>
    ))}
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const HomePageContent = () => {
  const { shouldShowAds } = useAdSense();
  const { data: apps, loading: appsLoading, error: appsError, refetch: refetchApps } = useResilientQuery('home_apps', () =>
    supabase.from('apps').select('*, categories!apps_categories(id, name, slug)').eq('is_featured', true).in('status', ['published', 'Production']).order('published_at', { ascending: false }).limit(8)
  );

  const { data: coupons, loading: couponsLoading, error: couponsError, refetch: refetchCoupons } = useResilientQuery('home_coupons', () =>
    supabase.from('coupons').select('*, merchant:merchants(*), category:categories(*)').in('status', ['published', 'active']).order('click_count', { ascending: false }).limit(6)
  );

  const { data: blogs, loading: blogsLoading, error: blogsError, refetch: refetchBlogs } = useResilientQuery('home_blogs', () =>
    supabase.from('blog_posts').select('*, author:profiles(first_name, last_name), category:categories(*)').eq('status', 'published').order('published_at', { ascending: false }).limit(3)
  );

  const heroCtaButtons = (
    <>
      <Button asChild size="lg" className="rounded-full bg-white text-brand-primary hover:bg-gray-50 border-0 w-full sm:w-auto shadow-lg h-14 md:h-12 text-lg md:text-base transition-all duration-150 hover:-translate-y-1">
        <Link to="/apps">Explore Applications</Link>
      </Button>
      <Button asChild size="lg" variant="outline" className="rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 w-full sm:w-auto h-14 md:h-12 text-lg md:text-base shadow-lg transition-all duration-150 hover:-translate-y-1">
        <Link to="/coupons">View Best Deals</Link>
      </Button>
    </>
  );

  return (
    <>
      <Helmet>
        <title>A2Z Utility Hub - Premium Tools & Deals</title>
        <meta name="description" content="Discover beautifully designed free utility apps, exclusive deals, and insightful blogs." />
      </Helmet>

      <HeroSection 
        title="Welcome to a2z Utility Hub"
        subtitle="Discover powerful utilities and tools to simplify your daily tasks"
        ctaButtons={heroCtaButtons}
      />

      {shouldShowAds && (
        <AdSenseContainer className="mt-8 mb-4 max-w-7xl">
          <AdSenseHorizontal slot="home_hero_bottom" />
        </AdSenseContainer>
      )}

      {/* Main layout wrapper applied to content sections */}
      <div className="py-8">
        <AdSidebarLayoutWrapper 
          leftAdSlots={['home_left_1', 'home_left_2']} 
          rightAdSlots={['home_right_1', 'home_right_2']}
        >
          {/* Apps Section */}
          <section className="mb-16">
            <div className="mb-8 text-left">
              <h2 className="text-3xl font-bold text-[#1F2937]">Featured Applications</h2>
              <p className="mt-3 text-lg text-[#4B5563]">Powerful, intuitive tools designed to boost your productivity instantly.</p>
            </div>
            {appsLoading ? <SectionSkeleton count={4} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" /> : (
              <ErrorBoundaryWithRetry onRetry={refetchApps}>
                {appsError && !apps?.length ? (() => { throw new Error(appsError); })() : null}
                {apps?.length > 0 ? (
                  <motion.div variants={containerVariants} initial="hidden" animate="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {apps.map((app, index) => (
                      <motion.div key={app.id} variants={itemVariants} className="hover-scale glass-card overflow-hidden border-t-2 border-t-brand-primary">
                        <AppCard app={app} index={index} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : <p className="text-[#4B5563] bg-gray-50 rounded-xl py-12 px-6 border border-gray-200">No featured applications available right now.</p>}
              </ErrorBoundaryWithRetry>
            )}
            <div className="mt-8 text-left">
              <Button asChild size="lg" variant="outline" className="rounded-full font-semibold bg-white text-brand-primary border-brand-primary/30 hover:bg-brand-primary/5 hover:border-brand-primary transition-all duration-150" icon={ArrowRight}>
                <Link to="/apps">Browse All Apps</Link>
              </Button>
            </div>
          </section>

          {shouldShowAds && (
            <AdSenseContainer className="my-10">
              <AdSenseResponsive slot="home_mid_1" />
            </AdSenseContainer>
          )}

          {/* Offers Section */}
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6">
              <div className="text-left">
                <h2 className="text-3xl font-bold text-[#1F2937]">Exclusive Offers</h2>
                <p className="mt-3 text-lg text-[#4B5563]">Save big with our handpicked, verified deals from top merchants.</p>
              </div>
              <Button asChild variant="outline" className="hidden sm:inline-flex rounded-full bg-white text-brand-secondary border-brand-secondary/30 hover:bg-brand-secondary/5 hover:border-brand-secondary transition-all duration-150">
                <Link to="/coupons">View All Offers <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            
            {couponsLoading ? <SectionSkeleton count={3} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" /> : (
              <ErrorBoundaryWithRetry onRetry={refetchCoupons}>
                {couponsError && !coupons?.length ? (() => { throw new Error(couponsError); })() : null}
                {coupons?.length > 0 ? (
                  <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {coupons.map((coupon, i) => (
                      <motion.div key={coupon.id} variants={itemVariants} className="hover-scale glass-card overflow-hidden border-t-2 border-t-brand-secondary">
                        <CouponCard coupon={coupon} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : <p className="text-[#4B5563] bg-gray-50 rounded-xl py-12 px-6 border border-gray-200">No coupons available currently.</p>}
              </ErrorBoundaryWithRetry>
            )}
            
            <div className="mt-6 sm:hidden text-left">
               <Button asChild variant="outline" className="w-full rounded-full min-h-[48px] bg-white text-brand-secondary border-brand-secondary/30 hover:bg-brand-secondary/5 hover:border-brand-secondary">
                <Link to="/coupons">View All Offers</Link>
              </Button>
            </div>
          </section>

          {shouldShowAds && (
            <AdSenseContainer className="my-10">
              <AdSenseResponsive slot="home_mid_2" />
            </AdSenseContainer>
          )}
          
          {/* Blog Section */}
          <section className="mb-8">
            <div className="mb-8 text-left">
              <h2 className="text-3xl font-bold text-[#1F2937]">Insights & Updates</h2>
              <p className="mt-3 text-lg text-[#4B5563]">Discover tips, guides, and the latest news from our expert team.</p>
            </div>
            {blogsLoading ? <SectionSkeleton count={3} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" /> : (
              <ErrorBoundaryWithRetry onRetry={refetchBlogs}>
                {blogsError && !blogs?.length ? (() => { throw new Error(blogsError); })() : null}
                {blogs?.length > 0 ? (
                  <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {blogs.map((post, i) => (
                      <motion.div key={post.id} variants={itemVariants} className="hover-scale glass-card overflow-hidden border-t-2 border-t-brand-accent">
                        <BlogCard post={post} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : <p className="text-[#4B5563] bg-white rounded-xl py-12 px-6 border border-gray-200 shadow-sm">No recent blog posts to show.</p>}
              </ErrorBoundaryWithRetry>
            )}
          </section>

        </AdSidebarLayoutWrapper>
      </div>

      {shouldShowAds && (
        <AdSenseContainer className="mt-8 mb-12 max-w-7xl">
          <AdSenseHorizontal slot="home_footer" />
        </AdSenseContainer>
      )}
    </>
  );
};

const HomePage = () => (
  <GlobalErrorBoundary>
    <HomePageContent />
  </GlobalErrorBoundary>
);

export default HomePage;
