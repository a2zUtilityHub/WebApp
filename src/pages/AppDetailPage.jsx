import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, BookOpen, AppWindow, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommentsSection from '@/components/comments/CommentsSection';
import { useAdSense } from '@/contexts/AdSenseProvider';

// Ads
import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseResponsive from '@/components/ads/AdSenseResponsive';
import AdSenseHorizontal from '@/components/ads/AdSenseHorizontal';

// App imports mapped to dynamic slugs
import QrCodeGeneratorPage from '@/pages/apps/QrCodeGeneratorPage';
import UrlShortenerPage from '@/pages/apps/UrlShortenerPage';
import TaskManagerPage from '@/pages/apps/TaskManagerPage';
import VideoEditorPage from '@/pages/apps/VideoEditorPage';
import ProfitCalculatorPage from '@/pages/apps/ProfitCalculatorPage';
import BarcodePage from '@/pages/apps/BarcodePage';
import FileConverterPage from '@/pages/apps/FileConverterPage';
import PasswordGeneratorPage from '@/pages/apps/PasswordGeneratorPage';
import JsonFormatterPage from '@/pages/apps/JsonFormatterPage';

const AppDetailPage = () => {
  const { slug } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { shouldShowAds } = useAdSense();

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchApp = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching app:', error);
        toast({ 
          title: "Error Loading App", 
          description: "Failed to load app details. Please try again.", 
          variant: "destructive" 
        });
        navigate('/apps');
      } else if (!data) {
        toast({ 
          title: "App Not Found", 
          description: `The app "${slug}" could not be found. It may have been moved or removed.`, 
          variant: "destructive" 
        });
        navigate('/apps');
      } else {
        setApp(data);
      }
      setLoading(false);
    };

    fetchApp();
  }, [slug, toast, navigate]);

  const appComponentMap = {
    'qr-code-generator': QrCodeGeneratorPage,
    'url-shortener': UrlShortenerPage,
    'task-manager': TaskManagerPage,
    'video-editor': VideoEditorPage,
    'product-profit-calculator': ProfitCalculatorPage,
    'barcode-generator-and-scanner': BarcodePage,
    'online-file-converter': FileConverterPage,
    'password-generator': PasswordGeneratorPage,
    'json-formatter': JsonFormatterPage,
  };

  const AppToolComponent = app ? appComponentMap[app.slug] : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 animate-spin text-brand-primary mx-auto" />
          <p className="text-muted-foreground">Loading app details...</p>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-center py-20 flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-b from-muted/30 to-background">
        <div className="p-6 bg-destructive/10 backdrop-blur-xl border border-destructive/20 rounded-full mb-8 shadow-sm relative">
          <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full"></div>
          <Wrench className="h-16 w-16 text-destructive relative z-10" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">App Not Found</h1>
        <p className="text-muted-foreground mt-4 max-w-md text-lg">
          We couldn't find the app you're looking for. It may have been removed or the URL is incorrect.
        </p>
        <Link to="/apps" className="mt-6 inline-block">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Apps
          </Button>
        </Link>
      </div>
    );
  }

  const isProduction = app.status === 'Production' || app.status === 'published' || app.status === 'active';

  return (
    <>
      <Helmet>
        <title>{app.meta_title || app.name} - A2Z Utility Hub</title>
        <meta name="description" content={app.meta_description || app.description} />
        <meta property="og:title" content={app.og_title || app.meta_title || app.name} />
        <meta property="og:description" content={app.og_description || app.meta_description || app.description} />
        {app.og_image_url && <meta property="og:image" content={app.og_image_url} />}
        {app.twitter_card && <meta name="twitter:card" content={app.twitter_card} />}
        {app.canonical_url && <link rel="canonical" href={app.canonical_url} />}
      </Helmet>
      
      {/* 1. App Tool Component */}
      {isProduction && AppToolComponent ? (
        <div className="w-full bg-background border-b border-border/50">
          <AppToolComponent />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-20 border-b border-border/50 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="text-center max-w-3xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">{app.name}</h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">{app.description}</p>
          </div>
          {!isProduction && (
            <Alert className="max-w-2xl mx-auto mt-8 border-amber-200 bg-amber-50">
              <Wrench className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Under Development</AlertTitle>
              <AlertDescription className="text-amber-700">
                This app is currently in development and will be released soon! Stay tuned for updates.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Information Sections Container */}
      <div className="bg-background py-20 relative">
        <div className="container mx-auto px-4 max-w-5xl space-y-16 relative z-10">
          
          {shouldShowAds && (
            <AdSenseContainer>
               <AdSenseHorizontal slot="app_detail_top" />
            </AdSenseContainer>
          )}

          {/* 2. About This App Section */}
          <section id="about-app" className="scroll-mt-24">
            <div className="flex items-center mb-8">
              <div className="p-3.5 bg-primary/10 rounded-2xl mr-4 border border-primary/20 shadow-sm">
                <AppWindow className="h-7 w-7 text-primary"/>
              </div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">About This App</h2>
            </div>
            <Card className="border border-border/50 bg-background/60 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden group">
              <div className="h-1.5 w-full bg-gradient-to-r from-primary/40 to-primary group-hover:from-primary group-hover:to-primary/40 transition-all duration-500"></div>
              <CardContent className="p-8 md:p-10">
                <div className="prose max-w-none text-foreground/80 text-lg leading-relaxed whitespace-pre-wrap dark:prose-invert">
                  {app.long_description || app.description || 'Detailed description coming soon.'}
                </div>
              </CardContent>
            </Card>
          </section>

          {shouldShowAds && (
            <AdSenseContainer>
               <AdSenseResponsive slot="app_detail_mid" />
            </AdSenseContainer>
          )}

          {/* 3. User Manual Section */}
          <section id="user-manual" className="scroll-mt-24">
            <div className="flex items-center mb-8">
              <div className="p-3.5 bg-primary/10 rounded-2xl mr-4 border border-primary/20 shadow-sm">
                <BookOpen className="h-7 w-7 text-primary"/>
              </div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">User Manual</h2>
            </div>
            <Card className="border border-border/50 bg-background/60 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 md:p-10">
                {app.user_manual ? (
                  <div 
                    className="prose prose-lg max-w-none text-foreground/80 dark:prose-invert prose-headings:text-foreground prose-headings:font-bold prose-h3:text-2xl prose-a:text-primary hover:prose-a:text-primary/80 prose-li:marker:text-primary" 
                    dangerouslySetInnerHTML={{ __html: app.user_manual }} 
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-muted/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-border/50">
                       <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No manual available</h3>
                    <p className="text-muted-foreground text-lg">Check back later for detailed instructions!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
          
        </div>
      </div>
      
      {/* 4. Discussion Section (End) */}
      <div className="bg-muted/10 border-t border-border/50 py-20 relative">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Community Discussion</h2>
            <p className="text-muted-foreground mt-3 text-lg">Share your thoughts, ask questions, or provide feedback about this tool.</p>
          </div>
          <Card className="border border-border/50 bg-background/60 backdrop-blur-xl shadow-lg rounded-[2rem] overflow-hidden">
            <CardContent className="p-4 sm:p-8">
              <CommentsSection pageId={`app/${app.slug}`} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AppDetailPage;