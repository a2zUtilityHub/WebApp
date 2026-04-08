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
      <div className="bg-muted/20">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Support Our Mission
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              Your generous donation powers a2z Utility Hub, keeping our tools free and accessible for everyone. Every contribution makes a difference.
            </p>
          </motion.div>

          <Card className="max-w-3xl mx-auto shadow-xl">
            <CardContent className="p-2 md:p-6">
              <Tabs defaultValue="upi-bank">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upi-bank">UPI & Bank Transfer</TabsTrigger>
                  <TabsTrigger value="card">Donate by Card</TabsTrigger>
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      {currencyInfo.baseAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={selectedAmount === amount ? 'default' : 'outline'}
                          className="py-6 text-lg font-bold"
                          onClick={() => setSelectedAmount(amount)}
                        >
                          {currencyInfo.symbol}{amount}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center mb-6">
                      <span className="p-2 border rounded-l-md bg-muted text-lg font-bold">{currencyInfo.symbol}</span>
                      <input
                        type="number"
                        value={selectedAmount || ''}
                        onChange={(e) => setSelectedAmount(Number(e.target.value))}
                        className="w-full h-10 p-2 border-t border-b text-lg font-bold text-center focus:ring-primary focus:border-primary focus:outline-none bg-background"
                        placeholder="Custom"
                      />
                      <span className="p-2 border rounded-r-md bg-muted text-lg font-bold">{currencyInfo.code}</span>
                    </div>
                    <div className="space-y-4">
                      <Button size="lg" className="w-full" onClick={() => handlePayment('Card')} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />} 
                        Donate with Card
                      </Button>
                      <Button size="lg" variant="secondary" className="w-full" onClick={() => handlePayment('Net Banking')} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Landmark className="mr-2 h-5 w-5" />}
                        Net Banking
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