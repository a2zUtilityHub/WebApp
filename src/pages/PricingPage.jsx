import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import HeroSection from '@/components/HeroSection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AdSidebarLayoutWrapper from '@/components/ads/AdSidebarLayoutWrapper';

const defaultPlans = [
  {
    id: 'free',
    name: 'Basic',
    description: 'Perfect for individuals getting started with essential tools.',
    price_monthly: 0,
    price_yearly: 0,
    features: ['Access to basic tools', 'Community support', 'Standard storage', 'Ads supported']
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For power users needing advanced capabilities and no limits.',
    price_monthly: 19,
    price_yearly: 190,
    features: ['All Basic features', 'Premium utilities', 'Priority support', 'No ads', 'Advanced analytics']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions and maximum performance for teams.',
    price_monthly: 49,
    price_yearly: 490,
    features: ['All Pro features', 'Dedicated account manager', 'Custom integrations', 'API access', 'SLA guarantee']
  }
];

const PricingCard = ({ plan, interval, onChoosePlan, index }) => {
  const price = interval === 'monthly' ? plan.price_monthly : plan.price_yearly;
  const priceId = plan.prices?.find(p => p.interval === interval)?.id || 'price_default';
  const isPro = plan.name?.toLowerCase().includes('pro');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.15, duration: 0.4 }}
      className="flex w-full"
    >
        <Card className={`flex flex-col relative overflow-hidden w-full transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-background/60 backdrop-blur-2xl rounded-3xl ${isPro ? 'border-primary ring-2 ring-primary/20 shadow-[0_0_40px_-15px_rgba(var(--primary),0.3)]' : 'border-border/50 border-t-4 border-t-primary/50 shadow-sm'}`}>
        {isPro && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-[11px] font-extrabold px-4 py-1.5 uppercase tracking-wider rounded-bl-2xl z-10 shadow-sm">
            Most Popular
            </div>
        )}
        <CardHeader className={`pb-8 relative z-10 ${isPro ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent' : 'bg-muted/5'}`}>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">{plan.name}</CardTitle>
            <CardDescription className="text-muted-foreground/90 text-[15px] mt-2">{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow pt-8 relative z-10">
            <div className="mb-8 flex items-baseline">
            <span className="text-6xl font-black tracking-tight text-foreground">${price}</span>
            <span className="text-muted-foreground ml-2 font-medium text-lg">/{interval === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
            <ul className="space-y-4">
            {plan.features?.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className={`h-6 w-6 shrink-0 mt-0.5 ${isPro ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-foreground/90 font-medium text-[15px]">{feature}</span>
                </li>
            ))}
            </ul>
        </CardContent>
        <CardFooter className="pt-8 mt-auto">
            <Button 
            className={`w-full h-12 text-base font-semibold transition-all duration-150 ${isPro ? 'bg-brand-primary text-white hover:bg-brand-primary/90 hover:shadow-md' : 'bg-white text-brand-primary border-2 border-brand-primary/20 hover:border-brand-primary hover:bg-brand-primary/5'}`} 
            onClick={() => onChoosePlan(priceId)}
            >
            {plan.price_monthly === 0 ? 'Get Started' : 'Choose Plan'}
            </Button>
        </CardFooter>
        </Card>
    </motion.div>
  );
};

const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interval, setInterval] = useState('monthly');
  const [paymentProviders, setPaymentProviders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: plansData, error: plansError } = await supabase
          .from('plans')
          .select('*, prices(*)')
          .eq('is_active', true)
          .order('price_monthly', { ascending: true });

        if (plansError || !plansData || plansData.length === 0) {
            setPlans(defaultPlans);
        } else {
            setPlans(plansData);
        }

        if (session) {
            const { data: providersData, error: providersError } = await supabase.functions.invoke('payment-manager', {
                method: 'GET',
                headers: { Authorization: `Bearer ${session.access_token}` }
            });
            
            if (providersError) {
                setPaymentProviders([{ id: 'stripe', name: 'Stripe' }]);
            } else if (Array.isArray(providersData)) {
                setPaymentProviders(providersData);
            } else {
                setPaymentProviders([{ id: 'stripe', name: 'Stripe' }]);
            }
        } else {
            setPaymentProviders([{ id: 'stripe', name: 'Stripe' }]);
        }
      } catch (error) {
        console.error('Error fetching pricing data:', error);
        setPlans(defaultPlans);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session]);
  
  const handleChoosePlan = async (priceId) => {
    if (!session) {
      toast({ title: 'Please log in to subscribe', description: 'You need to be logged in to choose a plan.', variant: 'default'});
      return;
    }
    
    setIsProcessing(true);
    try {
      const provider = paymentProviders.length > 0 ? paymentProviders[0].name : 'Stripe'; 
      
      const { data, error } = await supabase.functions.invoke('payment-manager', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}`},
        body: { priceId, provider, action: 'create_subscription' }
      });

      if (error) {
          let errorMessage = error.message;
          try {
             const body = JSON.parse(error.message);
             if (body && body.error) errorMessage = body.error;
          } catch(e) {}
          throw new Error(errorMessage);
      }
      
      if (data?.checkoutUrl) {
          window.location.href = data.checkoutUrl;
      } else {
          toast({ title: 'Success', description: 'Subscription processed successfully.' });
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({ title: 'Notice', description: 'Payments are not currently configured in the demo environment.', variant: 'default' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white w-full">
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet>
        <title>Pricing Plans - A2Z Utility Hub</title>
        <meta name="description" content="Simple, transparent pricing for all our premium apps and utilities." />
      </Helmet>
      
      <HeroSection 
        title="Simple, Transparent Pricing"
        subtitle="Choose the perfect plan to unlock all features without hidden fees."
      />

      <div className="bg-background py-20 relative overflow-hidden">
        {/* Soft Glowing Background Orbs */}
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

        <AdSidebarLayoutWrapper leftAdSlots={['pricing_left_1']} rightAdSlots={['pricing_right_1']}>
          <div className="w-full min-w-0 relative z-10">
            <div className="flex justify-center items-center gap-4 mb-16 bg-background/60 backdrop-blur-md w-fit mx-auto px-6 py-3 rounded-full border border-border/50 shadow-sm">
              <span className={`font-bold ${interval === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
              <Switch 
                checked={interval === 'yearly'}
                onCheckedChange={(checked) => setInterval(checked ? 'yearly' : 'monthly')}
                aria-label="Toggle between monthly and yearly billing"
              />
              <span className={`flex items-center font-bold ${interval === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Yearly <Badge variant="secondary" className="ml-3 bg-success/10 text-success border border-success/20 hover:bg-success/20 rounded-full px-2.5">Save 20%</Badge>
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={interval}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full"
              >
                {plans.map((plan, i) => (
                  <PricingCard key={plan.id} plan={plan} interval={interval} onChoosePlan={handleChoosePlan} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
            
            <div className="mt-28 max-w-3xl mx-auto">
              <h3 className="text-4xl font-extrabold tracking-tight text-center text-foreground mb-10">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="w-full bg-background/60 backdrop-blur-2xl rounded-[2rem] shadow-xl border border-border/50 p-6 md:p-8">
                <AccordionItem value="item-1" className="border-b border-border/50 pb-2">
                  <AccordionTrigger className="text-left px-2 font-bold text-foreground text-[17px] hover:text-primary transition-colors hover:no-underline">What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent className="px-2 text-muted-foreground text-[15px] leading-relaxed pt-2 pb-4">
                    We accept all major credit cards including Visa, Mastercard, and American Express. We also support PayPal for all our premium plans.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-b border-border/50 pb-2 pt-2">
                  <AccordionTrigger className="text-left px-2 font-bold text-foreground text-[17px] hover:text-primary transition-colors hover:no-underline">Can I change my plan later?</AccordionTrigger>
                  <AccordionContent className="px-2 text-muted-foreground text-[15px] leading-relaxed pt-2 pb-4">
                    Yes, absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated the difference.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-b border-border/50 pb-2 pt-2">
                  <AccordionTrigger className="text-left px-2 font-bold text-foreground text-[17px] hover:text-primary transition-colors hover:no-underline">Do you offer refunds?</AccordionTrigger>
                  <AccordionContent className="px-2 text-muted-foreground text-[15px] leading-relaxed pt-2 pb-4">
                    We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied, simply contact support for a full refund.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="border-0 pt-2">
                  <AccordionTrigger className="text-left px-2 font-bold text-foreground text-[17px] hover:text-primary transition-colors hover:no-underline">What happens when my subscription ends?</AccordionTrigger>
                  <AccordionContent className="px-2 text-muted-foreground text-[15px] leading-relaxed pt-2 pb-2">
                    If you cancel your subscription, you'll continue to have access to your premium features until the end of your current billing period. After that, your account will revert to the Basic (free) plan.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {isProcessing && (
              <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex justify-center items-center z-[100]">
                <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-2xl">
                  <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
                  <p className="text-lg font-medium text-gray-700">Processing your request...</p>
                </div>
              </div>
            )}
          </div>
        </AdSidebarLayoutWrapper>
      </div>
    </motion.div>
  );
};

export default PricingPage;