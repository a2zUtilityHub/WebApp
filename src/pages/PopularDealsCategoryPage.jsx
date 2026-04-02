import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePopularDeals } from '@/hooks/usePopularDeals';
import { trackDealClick } from '@/utils/dealClickTracker';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink, Flame, Tag, Clock, ShoppingCart, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
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

const PopularDealsCategoryPage = () => {
  const { category } = useParams();
  const { deals, categoryInfo, loading, error, refetch } = usePopularDeals(category);
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

  const displayName = categoryInfo?.name 
     ? categoryInfo.name 
     : category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Category';

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Helmet>
        <title>Top Deals in {displayName} | a2z Utility Hub</title>
        <meta name="description" content={`Discover our top most clicked and used deals in ${displayName}.`} />
      </Helmet>

      <HeroSection 
        title={`Trending in ${displayName}`}
        subtitle={`The top most popular offers for ${displayName}`}
      />

      <div className="container py-8 md:py-12 max-w-6xl mx-auto">
        <Breadcrumbs 
          items={[
            { title: "Home", to: "/" },
            { title: "Popular Deals", to: "/popular-deals" },
            { title: displayName, to: `/popular-deals/${category}` }
          ]} 
          className="mb-8" 
        />

        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 hover:bg-gray-100">
            <Link to="/popular-deals"><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Popular Deals</Link>
          </Button>
        </div>

        {error && (
            <Alert variant="destructive" className="mb-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Notice</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                  <span>{error}</span>
                  <Button variant="outline" size="sm" onClick={refetch}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Retry
                  </Button>
                </AlertDescription>
            </Alert>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
                <motion.div key={deal.id} variants={itemVariants} layout>
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200/60 group relative bg-white">
                    
                    <div className="absolute top-0 left-0 bg-gray-900 text-white font-bold px-3 py-1 rounded-br-xl shadow-sm z-10 text-sm">
                      #{index + 1}
                    </div>

                    <div className="relative h-40 bg-gradient-to-br from-brand-primary/5 to-gray-50 flex flex-col items-center justify-center p-6 text-center border-b border-gray-100">
                      {deal.merchant?.logo_url ? (
                        <img src={deal.merchant.logo_url} alt={deal.merchant?.name} className="h-16 w-auto object-contain mb-3 bg-white p-2 rounded-lg shadow-sm" />
                      ) : (
                        <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                          <Tag className="h-6 w-6 text-brand-primary" />
                        </div>
                      )}
                      
                      {deal.discount_value && (
                        <Badge className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 text-white font-bold border-none shadow-md">
                          {deal.discount_value}
                        </Badge>
                      )}
                    </div>
                    
                    <CardHeader className="pb-3 flex-grow">
                      <div className="flex items-center justify-end mb-2">
                        {deal.click_count > 0 && (
                          <div className="flex items-center text-orange-600 text-xs font-semibold bg-orange-50 px-2 py-1 rounded">
                            <Flame className="h-3 w-3 mr-1" /> {deal.click_count} uses
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                        {deal.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2 text-sm">
                        {deal.description}
                      </CardDescription>
                    </CardHeader>

                    <CardFooter className="pt-4 flex flex-col gap-3 border-t border-gray-50 bg-gray-50/30">
                      {deal.expires_at && (
                        <div className="w-full flex items-center text-xs text-red-500 font-medium">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          Expires: {new Date(deal.expires_at).toLocaleDateString()}
                        </div>
                      )}
                      <Button 
                        className="w-full bg-brand-primary hover:bg-brand-primary-dark shadow-sm transition-all"
                        onClick={() => handleUseDeal(deal)}
                      >
                        {deal.deal_link ? (
                          <><ExternalLink className="mr-2 h-4 w-4" /> Get Deal</>
                        ) : (
                          <><ShoppingCart className="mr-2 h-4 w-4" /> Show Code</>
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
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Tag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Deals Found in {displayName}</h3>
            <p className="text-gray-500 mb-6">We don't have any active popular deals for this category right now.</p>
            <Button asChild variant="outline">
               <Link to="/popular-deals">View All Popular Deals</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularDealsCategoryPage;