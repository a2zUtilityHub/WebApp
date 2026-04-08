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
      <div className="text-center py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="p-4 bg-destructive/10 rounded-full mb-6">
          <Wrench className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold">App Not Found</h1>
        <p className="text-muted-foreground mt-4 max-w-md">
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
        <div className="w-full bg-gray-50 border-b">
          <AppToolComponent />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-16 border-b bg-gray-50">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{app.name}</h1>
            <p className="mt-4 text-lg text-gray-600">{app.description}</p>
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
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-5xl space-y-12">
          
          {shouldShowAds && (
            <AdSenseContainer>
               <AdSenseHorizontal slot="app_detail_top" />
            </AdSenseContainer>
          )}

          {/* 2. About This App Section */}
          <section id="about-app" className="scroll-mt-24">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-primary/10 rounded-xl mr-4">
                <AppWindow className="h-6 w-6 text-primary"/>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">About This App</h2>
            </div>
            <Card className="border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="prose max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
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
            <div className="flex items-center mb-6">
              <div className="p-3 bg-primary/10 rounded-xl mr-4">
                <BookOpen className="h-6 w-6 text-primary"/>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">User Manual</h2>
            </div>
            <Card className="border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                {app.user_manual ? (
                  <div 
                    className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-headings:font-bold prose-h3:text-xl prose-a:text-primary hover:prose-a:text-primary/80 prose-li:marker:text-primary" 
                    dangerouslySetInnerHTML={{ __html: app.user_manual }} 
                  />
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No user manual is available for this application yet. Check back later!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
          
        </div>
      </div>
      
      {/* 4. Discussion Section (End) */}
      <div className="bg-gray-50 border-t py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Discussion</h2>
            <p className="text-gray-600 mt-2">Share your thoughts, ask questions, or provide feedback about this tool.</p>
          </div>
          <Card className="border-gray-200 shadow-md">
            <CardContent className="p-0 sm:p-6">
              <CommentsSection pageId={`app/${app.slug}`} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AppDetailPage;