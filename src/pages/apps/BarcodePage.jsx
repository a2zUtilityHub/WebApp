import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BarcodeGenerator from '@/components/apps/barcode/BarcodeGenerator';
import BarcodeScanner from '@/components/apps/barcode/BarcodeScanner';
import { PenSquare, ScanLine, Loader2, Maximize, Smartphone, Shield } from 'lucide-react';

import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppLoginModal } from '@/components/apps/shared/AppLoginModal';
import { AboutSection, ManualSection, FAQSection, CommunitySection } from '@/components/apps/shared/AppSections';
import { AppTabsLayout } from '@/components/apps/shared/AppTabsLayout';

const barcodeData = {
  about: {
    title: "Barcode Tools",
    description: "Generate and scan various barcode formats directly from your browser. A comprehensive tool for retail, inventory, and everyday use.",
    features: [
      { icon: <Maximize className="w-6 h-6" />, title: "Multiple Formats", desc: "Supports EAN, UPC, Code128, QR, and many more." },
      { icon: <Smartphone className="w-6 h-6" />, title: "Live Scanning", desc: "Use your device camera to scan barcodes instantly." },
      { icon: <Shield className="w-6 h-6" />, title: "Privacy First", desc: "Processing runs in-browser ensuring data remains private." },
    ],
    benefits: [
      "Create high-quality barcodes for retail products.",
      "Quickly scan items to check inventory or prices.",
      "Download generated barcodes for easy printing.",
      "Works perfectly on both desktop and mobile devices."
    ]
  },
  manual: {
    title: "Barcode Generator & Scanner",
    steps: [
      { title: "Choose Tool", desc: "Switch between Generator and Scanner using the top tabs." },
      { title: "Generate", desc: "Select a format, enter your data, and click download." },
      { title: "Scan", desc: "Grant camera permission, point it at a barcode, and see the result." },
      { title: "Action", desc: "Copy the scanned result or use the generated image." }
    ],
    tips: [
      "Ensure good lighting when scanning barcodes.",
      "For retail products, EAN-13 or UPC-A are standard formats.",
      "Keep your phone steady while scanning for faster results."
    ]
  },
  faq: [
    { q: "Which barcode format should I use?", a: "EAN-13 is standard in Europe/Global, while UPC-A is standard in North America." },
    { q: "Why isn't the scanner working?", a: "Ensure your browser has permission to access the camera and that lighting is adequate." },
    { q: "Is the generator free?", a: "Yes, you can generate and download as many barcodes as you need completely free." }
  ]
};

const BarcodePage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState('login');

  const tabsConfig = [
    { id: 'about', label: 'About', content: <AboutSection {...barcodeData.about} /> },
    { id: 'manual', label: 'Manual', content: <ManualSection {...barcodeData.manual} /> },
    { id: 'faq', label: 'FAQ', content: <FAQSection faqs={barcodeData.faq} /> },
    { id: 'community', label: 'Community', content: <CommunitySection appId="barcode" /> }
  ];

  return (
    <>
      <Helmet>
        <title>Barcode Generator & Scanner - A2Z Utility Hub</title>
        <meta name="description" content="Generate and scan various barcode formats including QR codes, UPC, EAN, and more. Fast, free, and easy to use." />
      </Helmet>
      <div className="full-width-container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">Barcode Generator & Scanner</h1>
          <p className="mt-2 text-lg text-muted-foreground">Your all-in-one solution for creating and reading barcodes.</p>
        </div>
        
        {authLoading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : !isAuthenticated ? (
          <div className="min-h-[40vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-primary/10 bg-card text-center">
              <CardHeader className="pb-6 pt-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5">
                  <ScanLine className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-3xl font-extrabold tracking-tight">Barcode Tools</CardTitle>
                <CardDescription className="text-base mt-3 text-muted-foreground">
                  Please log in to access the Barcode Generator and Scanner tools.
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
          <div className="mb-16">
            <Tabs defaultValue="generator" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generator"><PenSquare className="mr-2 h-4 w-4" />Generator</TabsTrigger>
                <TabsTrigger value="scanner"><ScanLine className="mr-2 h-4 w-4" />Scanner</TabsTrigger>
              </TabsList>
              <TabsContent value="generator" className="mt-6">
                <BarcodeGenerator />
              </TabsContent>
              <TabsContent value="scanner" className="mt-6">
                <BarcodeScanner />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        <AppTabsLayout tabsConfig={tabsConfig} />

      </div>
      <AppLoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultView={authView} />
    </>
  );
};

export default BarcodePage;