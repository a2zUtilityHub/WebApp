import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import FileConverter from '@/components/apps/file-converter/FileConverter';
import { FileDown, RefreshCw, Shield, Zap, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppPageNavigation } from '@/components/apps/shared/AppPageNavigation';
import { AboutSection, ManualSection, FAQSection, CommunitySection } from '@/components/apps/shared/AppSections';
import { AppTabsLayout } from '@/components/apps/shared/AppTabsLayout';
import { AppLoginModal } from '@/components/apps/shared/AppLoginModal';

const converterData = {
  about: {
    title: "File Converter",
    description: "A fast, secure, and versatile tool to convert documents, images, audio, and video files between various formats directly in your browser without uploading to external servers.",
    features: [
      { icon: <RefreshCw className="w-6 h-6" />, title: "Universal Support", desc: "Convert between hundreds of common file formats seamlessly." },
      { icon: <Zap className="w-6 h-6" />, title: "High Speed", desc: "Optimized processing ensures rapid conversion of your files." },
      { icon: <Shield className="w-6 h-6" />, title: "Secure & Private", desc: "Many conversions happen locally, keeping your sensitive data safe." },
    ],
    benefits: [
      "No need to install multiple software programs for different file types.",
      "Preserve original quality during the conversion process.",
      "Access the tool from any device with a modern web browser.",
      "Completely free to use with no hidden fees."
    ]
  },
  manual: {
    title: "File Converter",
    steps: [
      { title: "Upload File", desc: "Drag and drop your file into the designated area or click to browse." },
      { title: "Select Output Format", desc: "Choose the desired format from the dropdown menu." },
      { title: "Start Conversion", desc: "Click the 'Convert' button to begin processing." },
      { title: "Download", desc: "Once finished, click download to save the converted file to your device." }
    ],
    tips: [
      "For large video files, ensure you have a stable internet connection.",
      "Check the 'Keep Quality' option if available for image conversions.",
      "You can convert multiple images simultaneously to save time."
    ]
  },
  faq: [
    { q: "Is there a file size limit?", a: "Yes, currently we support files up to 100MB for optimal performance." },
    { q: "Are my files secure?", a: "Absolutely. We do not store your files on our servers post-conversion. They are automatically deleted." },
    { q: "Which formats are supported?", a: "We support major formats like PDF, DOCX, JPG, PNG, MP4, MP3, and many more." }
  ]
};

const FileConverterPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState('login');

  const tabsConfig = [
    { id: 'about', label: 'About', content: <AboutSection {...converterData.about} /> },
    { id: 'manual', label: 'Manual', content: <ManualSection {...converterData.manual} /> },
    { id: 'faq', label: 'FAQ', content: <FAQSection faqs={converterData.faq} /> },
    { id: 'community', label: 'Community', content: <CommunitySection appId="file-converter" /> }
  ];

  return (
    <>
      <Helmet>
        <title>Online File Converter - A2Z Utility Hub</title>
        <meta name="description" content="Convert documents, images, audio, and video files between various formats. Fast, secure, and free to use." />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col pb-20">
        <AppPageNavigation />
        
        <div className="flex-1 space-y-16">
          
          <section id="tool" className="scroll-mt-24 py-12 px-4 max-w-7xl mx-auto animate-fade-in w-full">
            {authLoading ? (
              <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : !isAuthenticated ? (
              <div className="min-h-[60vh] flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-primary/10 bg-card text-center">
                  <CardHeader className="pb-6 pt-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5">
                      <FileDown className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-extrabold tracking-tight">File Converter</CardTitle>
                    <CardDescription className="text-base mt-3 text-muted-foreground">
                      Please log in to access the File Converter and seamlessly transform your files.
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
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-3">
                    <FileDown className="w-10 h-10 text-primary" /> Online File Converter
                  </h1>
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Convert documents, images, and media files securely and instantly.</p>
                </div>
                <div className="bg-card shadow-sm border border-border rounded-2xl overflow-hidden p-6 mb-16">
                  <FileConverter />
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

export default FileConverterPage;