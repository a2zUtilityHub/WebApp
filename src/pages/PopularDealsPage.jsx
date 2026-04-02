import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePopularDeals } from '@/hooks/usePopularDeals';
import { trackDealClick } from '@/utils/dealClickTracker';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink, Flame, Tag, Clock, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import Breadcrumbs from '@/components/Breadcrumbs';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const PopularDealsPage = () => {
  const { deals, loading, error, refetch } = usePopularDeals();
  const { toast } = useToast();

  const handleUseDeal = async (deal) => {
    await trackDealClick(deal.id);
    
    if (deal.deal_link) {
      window.open(deal.deal_link, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "Code Copied!",
        description: `Use code ${deal.code} at checkout.`,
      });
      if (deal.code) navigator.clipboard.writeText(deal.code);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Helmet>
        <title>Top 5 Popular Deals | a2z Utility Hub</title>
        <meta name="description" content="Discover our top 5 most clicked and used deals right now." />
      </Helmet>

      <HeroSection 
        title="Trending Deals"
        subtitle="The top 5 most popular deals chosen by our community"
      />

      <div className="container py-8 md:py-12 max-w-6xl mx-auto">
        <Breadcrumbs 
          items={[
            { title: "Home", to: "/" },
            { title: "Popular Deals", to: "/popular-deals" }
          ]} 
          className="mb-8" 
        />

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            <TrendingUp className="text-brand-primary h-6 w-6" />
            Top 5 Deals Overall
          </h2>
          <Button variant="outline" asChild>
            <Link to="/categories">Browse Categories</Link>
          </Button>
        </div>

        {error && (
            <Alert variant="destructive" className="mb-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Notice</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full rounded-none" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : deals.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {deals.map((deal, index) => (
                <motion.div key={deal.id} variants={itemVariants} layout className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}>
                  <Card className={`h-full flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300 border-gray-200/60 group relative hover:-translate-y-1 ${index === 0 ? 'bg-gradient-to-br from-white to-brand-primary/5 border-brand-primary/20' : 'bg-white'}`}>
                    
                    <div className="absolute top-0 left-0 bg-brand-primary text-white font-black px-4 py-1 rounded-br-xl shadow-sm z-10">
                      #{index + 1}
                    </div>

                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 flex flex-col items-center justify-center p-6 text-center border-b border-gray-100">
                      {deal.merchant?.logo_url ? (
                        <img src={deal.merchant.logo_url} alt={deal.merchant?.name} className="h-20 w-auto object-contain mb-3 bg-white p-2 rounded-xl shadow-sm" />
                      ) : (
                        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                          <Tag className="h-8 w-8 text-brand-primary" />
                        </div>
                      )}
                      
                      {deal.discount_value && (
                        <Badge className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 text-white font-bold border-none shadow-md px-3 py-1 text-sm">
                          {deal.discount_value}
                        </Badge>
                      )}
                    </div>
                    
                    <CardHeader className="pb-3 flex-grow">
                      <div className="flex items-center justify-between mb-3">
                        <Link 
                          to={deal.category?.slug ? `/popular-deals/${deal.category.slug}` : '#'} 
                          className="inline-flex items-center"
                          onClick={(e) => !deal.category?.slug && e.preventDefault()}
                        >
                          <Badge variant="outline" className="text-brand-primary border-brand-primary/30 hover:bg-brand-primary hover:text-white transition-colors cursor-pointer capitalize">
                            {deal.category?.name || deal.category?.slug || 'Deal'}
                          </Badge>
                        </Link>
                        {deal.click_count > 0 && (
                          <div className="flex items-center text-orange-600 text-sm font-semibold bg-orange-50 px-2 py-1 rounded-md">
                            <Flame className="h-4 w-4 mr-1" /> {deal.click_count} uses
                          </div>
                        )}
                      </div>
                      <CardTitle className={`leading-tight group-hover:text-brand-primary transition-colors ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                        {deal.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-3 text-gray-600">
                        {deal.description}
                      </CardDescription>
                    </CardHeader>

                    <CardFooter className="pt-4 flex flex-col gap-3 border-t border-gray-50 bg-gray-50/50">
                      {deal.expires_at && (
                        <div className="w-full flex items-center text-xs text-red-500 font-medium bg-red-50 p-2 rounded-md">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          Expires: {new Date(deal.expires_at).toLocaleDateString()}
                        </div>
                      )}
                      <Button 
                        className="w-full bg-brand-primary hover:bg-brand-primary-dark shadow-md hover:shadow-lg transition-all h-12 text-base font-semibold"
                        onClick={() => handleUseDeal(deal)}
                      >
                        {deal.deal_link ? (
                          <><ExternalLink className="mr-2 h-5 w-5" /> Get Deal Now</>
                        ) : (
                          <><ShoppingCart className="mr-2 h-5 w-5" /> Show Promo Code</>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <Tag className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Deals Found</h3>
            <p className="text-gray-500 mb-6">Check back later for trending offers across all our categories.</p>
            <Button asChild onClick={refetch} variant="outline" className="mr-2">
               <span>Refresh Data</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularDealsPage;