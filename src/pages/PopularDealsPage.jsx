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
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <Helmet>
        <title>Top 5 Popular Deals | a2z Utility Hub</title>
        <meta name="description" content="Discover our top 5 most clicked and used deals right now." />
      </Helmet>

      <HeroSection 
        title="Trending Deals"
        subtitle="The top 5 most popular deals chosen by our community"
      />

      <div className="container py-12 md:py-16 max-w-7xl mx-auto relative z-10">
        <Breadcrumbs 
          items={[
            { title: "Home", to: "/" },
            { title: "Popular Deals", to: "/popular-deals" }
          ]} 
          className="mb-10 inline-flex bg-background/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-border/50 shadow-sm" 
        />

        <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-background/60 backdrop-blur-xl p-6 rounded-[2rem] border border-border/50 shadow-sm relative z-10">
          <h2 className="text-3xl font-extrabold flex items-center gap-3 text-foreground tracking-tight">
            <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20"><TrendingUp className="text-primary h-6 w-6" /></div>
            Top 5 Deals Overall
          </h2>
          <Button variant="outline" className="h-12 px-6 rounded-xl border-border/50 bg-background/60 hover:bg-muted shadow-sm font-semibold" asChild>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="overflow-hidden rounded-3xl border border-border/50 bg-background/60 backdrop-blur-md shadow-sm">
                <Skeleton className="h-48 w-full rounded-none bg-muted/50" />
                <CardContent className="p-8">
                  <Skeleton className="h-8 w-3/4 mb-6 bg-muted/50" />
                  <Skeleton className="h-4 w-full mb-3 bg-muted/50" />
                  <Skeleton className="h-4 w-2/3 bg-muted/50" />
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
                  <Card className={`h-full flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-500 border group relative hover:-translate-y-2 rounded-3xl z-10 ${index === 0 ? 'bg-gradient-to-br from-background/80 to-primary/5 border-primary/30 shadow-md backdrop-blur-2xl' : 'bg-background/60 backdrop-blur-xl border-border/50 shadow-sm hover:border-primary/50'}`}>
                    
                    <div className="absolute top-0 left-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-black px-5 py-1.5 rounded-br-2xl shadow-sm z-20 text-lg">
                      #{index + 1}
                    </div>

                    <div className="relative h-56 bg-muted/20 flex flex-col items-center justify-center p-6 text-center border-b border-border/50 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                      {deal.merchant?.logo_url ? (
                        <img src={deal.merchant.logo_url} alt={deal.merchant?.name} className="h-24 w-auto object-contain mb-3 bg-background p-3 rounded-2xl shadow-sm border border-border/50 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="h-20 w-20 bg-background rounded-full flex items-center justify-center shadow-sm border border-border/50 mb-3 relative z-10 group-hover:scale-110 transition-transform duration-500">
                          <Tag className="h-10 w-10 text-primary" />
                        </div>
                      )}
                      
                      {deal.discount_value && (
                        <Badge className="absolute top-5 right-5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold border-none shadow-md px-4 py-1.5 text-[15px] z-10 rounded-full">
                          {deal.discount_value}
                        </Badge>
                      )}
                    </div>
                    
                    <CardHeader className="pb-4 flex-grow relative z-10 bg-gradient-to-b from-transparent to-muted/5">
                      <div className="flex items-center justify-between mb-4">
                        <Link 
                          to={deal.category?.slug ? `/popular-deals/${deal.category.slug}` : '#'} 
                          className="inline-flex items-center"
                          onClick={(e) => !deal.category?.slug && e.preventDefault()}
                        >
                          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer capitalize font-bold px-3 py-1 text-[13px]">
                            {deal.category?.name || deal.category?.slug || 'Deal'}
                          </Badge>
                        </Link>
                        {deal.click_count > 0 && (
                          <div className="flex items-center text-orange-500 text-[13px] font-bold bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full shadow-sm">
                            <Flame className="h-4 w-4 mr-1.5" /> {deal.click_count} uses
                          </div>
                        )}
                      </div>
                      <CardTitle className={`leading-tight text-foreground group-hover:text-primary transition-colors ${index === 0 ? 'text-3xl font-extrabold' : 'text-2xl font-bold'}`}>
                        {deal.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-3 text-muted-foreground/90 text-[15px] leading-relaxed">
                        {deal.description}
                      </CardDescription>
                    </CardHeader>

                    <CardFooter className="pt-5 pb-6 px-6 flex flex-col gap-4 border-t border-border/50 bg-muted/10 relative z-10">
                      {deal.expires_at && (
                        <div className="w-full flex items-center text-[13px] text-destructive font-bold bg-destructive/10 border border-destructive/20 p-2.5 rounded-xl shadow-sm justify-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Expires: {new Date(deal.expires_at).toLocaleDateString()}
                        </div>
                      )}
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all h-14 text-lg font-bold rounded-xl"
                        onClick={() => handleUseDeal(deal)}
                      >
                        {deal.deal_link ? (
                          <><ExternalLink className="mr-2 h-5 w-5" /> Claim Deal Now</>
                        ) : (
                          <><ShoppingCart className="mr-2 h-5 w-5" /> Reveal Promo Code</>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-background/60 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-border/50 flex flex-col items-center relative overflow-hidden z-10">
            <div className="absolute top-0 right-0 p-16 opacity-5 bg-gradient-to-bl from-primary to-transparent rounded-bl-full z-0 w-48 h-48"></div>
            <div className="bg-muted/50 border border-border/50 shadow-sm p-5 rounded-full mb-6 relative z-10">
               <Tag className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-3xl font-extrabold text-foreground mb-3 relative z-10">No Deals Found</h3>
            <p className="text-muted-foreground text-lg mb-8 relative z-10">Check back later for trending offers across all our categories.</p>
            <Button onClick={refetch} variant="outline" className="h-12 px-8 rounded-xl border-border/50 bg-background/60 backdrop-blur-sm hover:bg-muted shadow-sm relative z-10 font-bold">
               Refresh Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularDealsPage;