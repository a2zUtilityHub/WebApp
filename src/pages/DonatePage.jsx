import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, CreditCard, Banknote, Landmark, Copy, Check, Loader2 } from 'lucide-react';
import { getCurrencyInfoForCountry } from '@/lib/currency';
import { useLocationContext } from '@/contexts/LocationContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const CopyButton = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    }, () => {
      toast({ title: "Failed to copy", variant: "destructive" });
    });
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7">
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
};

const BankDetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b">
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
    <CopyButton textToCopy={value} />
  </div>
);

const DonatePage = () => {
  const { country, loading: locationLoading } = useLocationContext();
  const [currencyInfo, setCurrencyInfo] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    if (country) {
      const info = getCurrencyInfoForCountry(country.code);
      setCurrencyInfo(info);
      setSelectedAmount(info.baseAmounts.length > 1 ? info.baseAmounts[1] : info.baseAmounts[0]);
    } else if (!locationLoading) {
      const info = getCurrencyInfoForCountry('IN'); // Fallback
      setCurrencyInfo(info);
      setSelectedAmount(info.baseAmounts[1]);
    }
  }, [country, locationLoading]);

  const handlePayment = async (method) => {
    if (!session) {
        toast({ title: 'Authentication Required', description: 'Please log in to make a donation.', variant: 'default' });
        return;
    }

    setIsProcessing(true);
    try {
        const { data, error } = await supabase.functions.invoke('payment-manager', {
            method: 'POST',
            headers: { Authorization: `Bearer ${session.access_token}` },
            body: {
                action: 'donate',
                amount: selectedAmount,
                currency: currencyInfo?.code || 'USD',
                method: method
            }
        });

        if (error) {
             // Try to parse error body if available
             let errorMessage = error.message;
             try {
                const body = JSON.parse(error.message);
                if (body && body.error) errorMessage = body.error;
             } catch(e) { /* ignore */ }
             throw new Error(errorMessage);
        }

        if (data?.checkoutUrl) {
            window.location.href = data.checkoutUrl;
        } else {
            toast({
                title: 'Donation Initiated',
                description: `Thank you! Your ${method} donation process has started.`,
            });
        }
    } catch (error) {
        console.error('Donation error:', error);
        toast({
            title: 'Error',
            description: error.message || 'Failed to initiate donation.',
            variant: 'destructive',
        });
    } finally {
        setIsProcessing(false);
    }
  };

  if (locationLoading || !currencyInfo) {
    return (
      <div className="full-width-container py-16 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Donate - a2z Utility Hub</title>
        <meta name="description" content="Support the development of a2z Utility Hub. Your donation helps us maintain and improve our free tools and services." />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CJMK1M1R4H"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CJMK1M1R4H');
          `}
        </script>
      </Helmet>
      <div className="bg-background relative overflow-hidden min-h-screen">
        {/* Deep Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-sm relative">
               <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
               <Heart className="w-12 h-12 text-red-500 relative z-10" fill="currentColor" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
              Support Our Mission
            </h1>
            <p className="text-xl text-muted-foreground mb-14 leading-relaxed">
              Your generous donation powers a2z Utility Hub, keeping our tools free and accessible for everyone. Every contribution makes a difference.
            </p>
          </motion.div>

          <Card className="max-w-3xl mx-auto border border-border/50 bg-background/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-primary"></div>
            <CardContent className="p-6 md:p-10 pt-10">
              <Tabs defaultValue="upi-bank">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-background/60 backdrop-blur-md shadow-sm border border-border/50 rounded-2xl p-1.5 h-16">
                  <TabsTrigger value="upi-bank" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl font-bold text-[16px]">UPI & Bank Transfer</TabsTrigger>
                  <TabsTrigger value="card" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl font-bold text-[16px]">Donate by Card</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upi-bank" className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">Scan & Pay with UPI</h3>
                      <div className="flex justify-center">
                         <img
                            src="https://horizons-cdn.hostinger.com/322b6f79-9e11-418a-a5d4-caa65e30d384/24c6cff00b4cd463d3446b40de94113f.png"
                            alt="UPI QR Code for donation to a2z Utility Hub"
                            className="w-[250px] h-auto rounded-lg border p-2"
                           />
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <p className="text-sm text-muted-foreground">UPI ID: <span className="font-mono">Q380168185@ybl</span></p>
                        <CopyButton textToCopy="Q380168185@ybl" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Direct Bank Transfer</h3>
                      <div className="space-y-1">
                        <BankDetailRow label="Account Holder" value="Preety Kumari" />
                        <BankDetailRow label="Account No" value="43599855433" />
                        <BankDetailRow label="Bank" value="State Bank of India (SBI)" />
                        <BankDetailRow label="IFSC" value="SBIN0015605" />
                        <BankDetailRow label="Branch" value="Ramkrishna Nagar" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="card" className="pt-6">
                   <CardHeader className="p-0 text-center mb-6">
                    <CardTitle>Make a Donation by Card</CardTitle>
                    <CardDescription>Choose an amount or enter a custom one.</CardDescription>
                  </CardHeader>
                  <div className="max-w-md mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                      {currencyInfo.baseAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={selectedAmount === amount ? 'default' : 'outline'}
                          className={`h-16 text-xl font-black rounded-2xl transition-all shadow-sm ${selectedAmount === amount ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-md scale-105' : 'bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:bg-background/80'}`}
                          onClick={() => setSelectedAmount(amount)}
                        >
                          {currencyInfo.symbol}{amount}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center mb-8 relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-muted-foreground group-focus-within:text-primary transition-colors">{currencyInfo.symbol}</span>
                      <input
                        type="number"
                        value={selectedAmount || ''}
                        onChange={(e) => setSelectedAmount(Number(e.target.value))}
                        className="w-full h-16 pl-12 pr-16 bg-background/60 backdrop-blur-xl border border-input rounded-2xl text-2xl font-black text-center focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all shadow-inner text-foreground placeholder:text-muted-foreground/40"
                        placeholder="Custom Amount"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">{currencyInfo.code}</span>
                    </div>
                    <div className="space-y-4 pt-2 border-t border-border/50">
                      <Button size="lg" className="w-full h-16 rounded-2xl text-xl font-bold bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mt-4" onClick={() => handlePayment('Card')} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <CreditCard className="mr-3 h-6 w-6" />} 
                        Donate Securely
                      </Button>
                      <Button size="lg" variant="outline" className="w-full h-14 rounded-2xl font-bold border-border/50 bg-background/60 backdrop-blur-sm hover:bg-muted/50" onClick={() => handlePayment('Net Banking')} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Landmark className="mr-2 h-5 w-5" />}
                        Pay with Net Banking
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      Secure payments are handled by our trusted partners.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DonatePage;