import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link as LinkIcon, BarChart2, Key, ShieldCheck, Zap, Lock, Clock, BarChart3, QrCode, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CreateLinkForm from '@/components/apps/url-shortener/CreateLinkForm';
import LinkList from '@/components/apps/url-shortener/LinkList';
import AnalyticsTab from '@/components/apps/url-shortener/AnalyticsTab';
import ApiTab from '@/components/apps/url-shortener/ApiTab';
import ErrorBoundary from '@/components/ErrorBoundary';
import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseResponsive from '@/components/ads/AdSenseResponsive';
import { useAdSense } from '@/contexts/AdSenseProvider';

import { AboutSection, ManualSection, FAQSection, CommunitySection } from '@/components/apps/shared/AppSections';
import { AppLoginModal } from '@/components/apps/shared/AppLoginModal';
import { AppTabsLayout } from '@/components/apps/shared/AppTabsLayout';

const urlShortenerData = {
  about: {
    title: "URL Shortener",
    description: "The A2Z Utility Hub URL Shortener is a powerful, privacy-focused tool designed to simplify long, complex web addresses into manageable, trackable links. Whether you are a marketer running global campaigns or a casual user sharing links with friends, our platform provides the essential tools to optimize your online sharing experience.",
    features: [
      { icon: <Zap className="w-6 h-6" />, title: "Instant Redirection", desc: "Lightning-fast redirects ensuring your users reach their destination without delay." },
      { icon: <LinkIcon className="w-6 h-6" />, title: "Custom Aliases", desc: "Create memorable, branded links instead of random character strings." },
      { icon: <Lock className="w-6 h-6" />, title: "Password Protection", desc: "Secure sensitive links with robust password authentication." },
      { icon: <Clock className="w-6 h-6" />, title: "Link Expiration", desc: "Set automatic expiration dates for time-sensitive campaigns or promotions." },
      { icon: <BarChart3 className="w-6 h-6" />, title: "Advanced Analytics", desc: "Track clicks, geographic locations, and device types in real-time." },
      { icon: <QrCode className="w-6 h-6" />, title: "QR Code Generation", desc: "Instantly generate scannable QR codes for offline marketing." },
    ],
    benefits: [
      "Clean up messy, unwieldy URLs for social media posts.",
      "Track engagement and measure the success of your marketing campaigns.",
      "Enhance link security and control access to private documents.",
      "Improve brand consistency by using readable, customized aliases.",
      "Bridge the gap between offline and online audiences with QR codes."
    ]
  },
  manual: {
    title: "URL Shortener",
    steps: [
      { title: "Copy Your Target URL", desc: "Find the long webpage address you want to shorten and copy it to your clipboard." },
      { title: "Paste into Generator", desc: "Paste the URL into the main input field at the top of this page." },
      { title: "Customize (Optional)", desc: "Click 'Advanced Options' to add a custom alias that reflects your brand or content." },
      { title: "Set Security (Optional)", desc: "Add a password or set an expiration date for sensitive or time-bound links." },
      { title: "Generate Link", desc: "Click the 'Shorten URL' button to process your request immediately." },
      { title: "Share and Track", desc: "Copy your new short link or download the QR code. View real-time stats in the Analytics tab." },
    ],
    tips: [
      "Keep custom aliases short and descriptive (e.g., 'summer-sale-2026').",
      "Always use password protection for links pointing to internal company documents.",
      "Check your analytics weekly to understand which platforms drive the most traffic.",
      "Test your shortened links in an incognito window before sharing them publicly.",
      "Download QR codes in high resolution for printed marketing materials."
    ]
  },
  faq: [
    { q: "Are my shortened links permanent?", a: "Yes, your links will remain active indefinitely unless you explicitly set an expiration date or delete them from your dashboard." },
    { q: "Can I change the destination URL later?", a: "Currently, destination URLs cannot be modified once created to prevent link manipulation. You will need to create a new short link for a different destination." },
    { q: "How accurate is the click tracking?", a: "Our analytics track clicks in real-time, capturing unique visits, geographic locations, and referrer data with high accuracy." },
    { q: "Is there a limit to how many links I can create?", a: "Registered users have a generous allocation for link creation. Check your account settings for specific quota details based on your current plan." },
    { q: "Are the passwords secure?", a: "Yes, passwords applied to links are securely hashed and stored. Users must enter the exact password to be redirected to the destination." }
  ]
};

const UrlShortenerPageContent = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [links, setLinks] = useState([]);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { shouldShowAds } = useAdSense();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState('login');

  const fetchLinks = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('url_shortener')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLinks(data || []);
    } catch (e) {
      toast({ title: 'Error fetching links', description: e.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from('app_settings').select('*').eq('app_id', 3).maybeSingle();
      if (!error && data) {
        setSettings(data);
      }
    };
    fetchSettings();
    fetchLinks();
  }, [fetchLinks]);

  const handleLinkCreated = (newLink) => {
    setLinks(prev => [newLink, ...prev]);
  };

  const tabsConfig = [
    { id: 'about', label: 'About', content: <AboutSection {...urlShortenerData.about} /> },
    { id: 'manual', label: 'Manual', content: <ManualSection {...urlShortenerData.manual} /> },
    { id: 'faq', label: 'FAQ', content: <FAQSection faqs={urlShortenerData.faq} /> },
    { id: 'community', label: 'Community', content: <CommunitySection appId="url-shortener" /> }
  ];

  return (
    <>
      <Helmet>
        <title>Advanced URL Shortener & Tracker | A2Z Utility Hub</title>
        <meta name="description" content="Create short, memorable links with advanced tracking, password protection, and expiration dates. Free URL shortener." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col pb-20">
        <div className="flex-1 space-y-16">
          
          <section id="tool" className="scroll-mt-24">
            {authLoading ? (
               <div className="flex min-h-[60vh] items-center justify-center">
                 <Loader2 className="w-10 h-10 animate-spin text-primary" />
               </div>
            ) : !isAuthenticated ? (
               <div className="min-h-[60vh] flex items-center justify-center p-4">
                 <Card className="w-full max-w-md shadow-xl border-primary/10 bg-card text-center">
                   <CardHeader className="pb-6 pt-8">
                     <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5">
                       <LinkIcon className="w-10 h-10 text-primary" />
                     </div>
                     <CardTitle className="text-3xl font-extrabold tracking-tight">URL Shortener</CardTitle>
                     <CardDescription className="text-base mt-3 text-muted-foreground">
                       Please log in to access the URL Shortener and manage your links.
                     </CardDescription>
                   </CardHeader>
                   <CardContent className="flex flex-col gap-4 pb-8 px-8">
                     <Button size="lg" className="w-full text-md font-semibold h-12" onClick={() => { setAuthView('login'); setIsAuthModalOpen(true); }}>
                       Login to Continue
                     </Button>
                     <Button variant="outline" size="lg" className="w-full h-12 border-primary/20 hover:bg-primary/5" onClick={() => { setAuthView('signup'); setIsAuthModalOpen(true); }}>
                       Create an Account
                     </Button>
                   </CardContent>
                 </Card>
               </div>
            ) : (
              <>
                <div className="bg-card pt-12 pb-16 relative overflow-hidden rounded-b-3xl shadow-sm border-b border-border">
                  <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,hsl(var(--background)),rgba(255,255,255,0.6))] bg-[length:20px_20px]" />
                  <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                      <ShieldCheck className="w-4 h-4" /> Secure & Reliable
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
                      Shorten, Track, <span className="text-primary">Optimize.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                      Transform long, ugly URLs into short, trackable links. Add custom aliases, set passwords, and monitor clicks in real-time.
                    </p>
                    
                    <div className="mt-10 relative z-20">
                      <CreateLinkForm 
                        settings={settings} 
                        onLinkCreated={handleLinkCreated} 
                        linkCount={links.length} 
                      />
                    </div>
                  </div>
                </div>

                {shouldShowAds && (
                  <AdSenseContainer className="my-8">
                    <AdSenseResponsive slot="url_mid" />
                  </AdSenseContainer>
                )}

                <div className="container mx-auto px-4 mt-8 max-w-6xl">
                  <Tabs defaultValue="links" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8 p-1 bg-secondary/50 backdrop-blur-sm rounded-xl border border-border">
                      <TabsTrigger value="links" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <LinkIcon className="mr-2 h-4 w-4" /> Links
                      </TabsTrigger>
                      <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <BarChart2 className="mr-2 h-4 w-4" /> Analytics
                      </TabsTrigger>
                      <TabsTrigger value="api" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Key className="mr-2 h-4 w-4" /> API
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="links" className="animate-fade-in duration-300">
                      {isLoading ? (
                        <div className="flex justify-center py-20">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                          <LinkList links={links} setLinks={setLinks} />
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="analytics" className="animate-fade-in duration-300">
                      <AnalyticsTab links={links} />
                    </TabsContent>
                    
                    <TabsContent value="api" className="animate-fade-in duration-300">
                      <ApiTab />
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </section>

          <AppTabsLayout tabsConfig={tabsConfig} />

        </div>
      </div>
      
      <AppLoginModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultView={authView} 
      />
    </>
  );
};

const UrlShortenerPage = () => {
  return (
    <ErrorBoundary>
      <UrlShortenerPageContent />
    </ErrorBoundary>
  );
};

export default UrlShortenerPage;