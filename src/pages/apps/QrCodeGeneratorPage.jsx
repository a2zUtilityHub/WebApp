import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Info, BookOpen, HelpCircle, MessageCircle, CheckCircle2, 
  Zap, Palette, LayoutTemplate, Download, Smartphone, Shield, QrCode, Loader2 
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import QRControls from '@/components/apps/qr-code/QRControls';
import QRPreview from '@/components/apps/qr-code/QRPreview';
import QRExportBar from '@/components/apps/qr-code/QRExportBar';
import QRStyleControls from '@/components/apps/qr-code/QRStyleControls';
import QRLogoUpload from '@/components/apps/qr-code/QRLogoUpload';
import LogoCustomizationPanel from '@/components/apps/qr-code/LogoCustomizationPanel';
import QRRecent from '@/components/apps/qr-code/QRRecent';
import CommentsSection from '@/components/comments/CommentsSection';

import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseResponsive from '@/components/ads/AdSenseResponsive';
import AdSenseHorizontal from '@/components/ads/AdSenseHorizontal';
import { useAdSense } from '@/contexts/AdSenseProvider';

import { useAuth } from '@/contexts/SupabaseAuthContext';
import { AppLoginModal } from '@/components/apps/shared/AppLoginModal';

const AboutAppSection = () => {
  const features = [
    { icon: <Zap className="w-6 h-6" />, title: "Instant Generation", desc: "Create QR codes instantly in real-time as you type or adjust settings." },
    { icon: <Palette className="w-6 h-6" />, title: "Custom Colors & Design", desc: "Match your brand with customizable foreground, background colors, and styling." },
    { icon: <LayoutTemplate className="w-6 h-6" />, title: "Logo Embedding", desc: "Easily upload and position your own logo directly in the center of the QR code." },
    { icon: <Download className="w-6 h-6" />, title: "Multiple Formats", desc: "Download in PNG, SVG, or PDF formats for digital or high-quality print use." },
    { icon: <Smartphone className="w-6 h-6" />, title: "Highly Versatile", desc: "Supports URLs, vCards, WiFi credentials, emails, SMS, social media, and more." },
    { icon: <Shield className="w-6 h-6" />, title: "Private & Secure", desc: "No data is stored on our servers. Your QR codes are generated entirely in your browser." },
  ];

  const benefits = [
    "Completely free to use with no registration required or hidden fees.",
    "Bridge the gap between offline materials and online digital content.",
    "Easily share complex WiFi passwords, contact details, or payment links.",
    "Create high-resolution, vector-based codes perfect for professional printing.",
    "Improve brand recognition by seamlessly integrating your logo and color scheme."
  ];

  return (
    <div id="about" className="info-section-wrapper animate-fade-in scroll-mt-24">
      <h2 className="info-section-title text-teal-800">
        <Info className="w-8 h-8 text-teal-600" />
        About QR Code Generator
      </h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          The A2Z Utility Hub QR Code Generator is a professional, privacy-focused tool designed to create highly customizable and reliable QR codes. Whether you need a simple link for a marketing flyer, a digital business card, or a secure WiFi login code for your cafe, our platform provides all the features you need to generate pixel-perfect codes instantly.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mb-6">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {features.map((feat, idx) => (
            <div key={idx} className="info-card group">
              <div className="feature-icon-wrapper group-hover:scale-110 transition-transform duration-300">
                {feat.icon}
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{feat.title}</h4>
              <p className="text-gray-600 text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-6">Why Use Our QR Generator?</h3>
        <ul className="space-y-3">
          {benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const UserManualSection = () => {
  const manualItems = [
    { title: "1. Getting Started", content: "To generate a QR code, begin by selecting the type of data you want to encode from the tabs in the 'Content & Type' section. Options include URL, Text, WiFi, vCard, Email, SMS, Social Media, and Payments." },
    { title: "2. Entering Your Data", content: "Depending on your selection, fill out the required fields. For a URL, simply paste the web address. For WiFi, enter the Network Name (SSID) and password. The QR preview on the right will update automatically." },
    { title: "3. Customization Options", content: "Use the 'Customize Style' section to change the appearance. You can select custom foreground and background colors. Ensure there is high contrast between the two colors to guarantee the code remains scannable." },
    { title: "4. Adding a Logo", content: "Click 'Upload Logo' to insert an image into the center of your QR code. You can adjust the logo's size, opacity, and positioning. Keep the logo size under 30% to prevent it from covering critical data modules." },
    { title: "5. Adjusting Error Correction", content: "Error correction allows a QR code to be scanned even if part of it is obscured (like by a logo). You can adjust this level (L, M, Q, H). 'H' (High) is recommended if you are embedding a large logo." },
    { title: "6. Download Formats", content: "Once satisfied, use the 'Export Options' panel. Choose PNG for web use, SVG for infinitely scalable vector graphics (best for graphic design and large prints), or PDF for easy document sharing." },
    { title: "7. Testing & Scanning", content: "Always test your QR code before printing or publishing. Use the default camera app on an iOS or Android device to scan the preview directly from your screen to ensure it directs to the correct destination." },
    { title: "8. Troubleshooting", content: "If your QR code isn't scanning, check if the colors are inverted (light code on dark background), which some scanners struggle with. Also, ensure the logo isn't too large and the contrast is sufficient." },
  ];

  return (
    <div id="manual" className="info-section-wrapper animate-fade-in animation-delay-200 scroll-mt-24">
      <h2 className="info-section-title text-teal-800">
        <BookOpen className="w-8 h-8 text-teal-600" />
        How to Use QR Code Generator
      </h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <Accordion type="single" collapsible className="w-full">
          {manualItems.map((item, index) => (
            <AccordionItem key={index} value={`manual-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-teal-700">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    { q: "What is a QR Code?", a: "QR (Quick Response) codes are two-dimensional barcodes that store information. Unlike standard barcodes, they can hold a large amount of data such as URLs, contact details, or text, and can be quickly read by smartphone cameras." },
    { q: "How do I generate a QR code?", a: "Select your desired data type (like URL or WiFi), enter your information into the fields, customize the design and colors, and then click one of the download buttons to save your generated code." },
    { q: "Can I customize the appearance?", a: "Yes! You can completely customize the foreground and background colors, adjust the size, change the error correction level, and even embed a custom logo in the center." },
    { q: "What download formats are available?", a: "We offer PNG (best for web and general use), SVG (best for scalable vector graphics in design software like Illustrator), and PDF (great for printing and sharing as a document)." },
    { q: "How do I share a QR code?", a: "After downloading the image file, you can print it on marketing materials, business cards, menus, or embed it digitally in emails, websites, and social media posts." },
    { q: "Are QR codes secure?", a: "The QR code itself is just a graphical representation of data and is inherently secure. However, users should always ensure the destination URL or data being encoded points to a safe and trusted source." },
    { q: "Can I use QR codes for my business?", a: "Absolutely. QR codes are excellent for business. You can use them on product packaging, restaurant menus, event banners, business cards, or storefronts to quickly connect offline customers to your online presence." },
    { q: "What devices can scan QR codes?", a: "Most modern smartphones (iOS and Android) have built-in QR code scanners directly in their default camera apps. There are also numerous free third-party scanning apps available in app stores." },
    { q: "How long do QR codes last?", a: "The QR codes generated here are static and do not expire. They will last forever. However, if you encode a URL, the code will only be useful as long as that destination webpage remains active." },
    { q: "Can I track QR code scans?", a: "Static QR codes (like the ones generated here) do not have native tracking. If you want to track scans, you should use our URL Shortener tool to create a trackable short link, and then generate a QR code for that short link." },
  ];

  return (
    <div id="faq" className="info-section-wrapper animate-fade-in animation-delay-400 scroll-mt-24">
      <h2 className="info-section-title text-teal-800">
        <HelpCircle className="w-8 h-8 text-teal-600" />
        Frequently Asked Questions
      </h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-teal-700">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

const QrCodeGeneratorPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState('login');
  
  const { shouldShowAds } = useAdSense();
  const [qrType, setQrType] = useState('url');
  const [qrData, setQrData] = useState({
    url: '',
    text: '',
    ssid: '',
    password: '',
    fullName: '',
    organization: '',
    title: '',
    phone: '',
    email: '',
    website: '',
    subject: '',
    body: '',
    platform: 'instagram',
    handle: '',
    paymentId: '',
  });
  
  // Style State
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(250);
  const [qrStyle, setQrStyle] = useState('square');
  const [level, setLevel] = useState('H');
  
  // Logo State
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoShape, setLogoShape] = useState('square');
  const [logoSize, setLogoSize] = useState(25); // Percentage
  const [logoOpacity, setLogoOpacity] = useState(100);
  const [logoPosition, setLogoPosition] = useState('center');

  const generateQRValue = () => {
    switch (qrType) {
      case 'wifi':
        if (!qrData.ssid) return '';
        return `WIFI:T:WPA;S:${qrData.ssid};P:${qrData.password || ''};;`;
      
      case 'vcard':
        if (!qrData.fullName && !qrData.phone && !qrData.email) return '';
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${qrData.fullName || ''}\nORG:${qrData.organization || ''}\nTITLE:${qrData.title || ''}\nTEL:${qrData.phone || ''}\nEMAIL:${qrData.email || ''}\nURL:${qrData.website || ''}\nEND:VCARD`;
      
      case 'email':
        if (!qrData.email) return '';
        const emailParams = new URLSearchParams();
        if (qrData.subject) emailParams.append('subject', qrData.subject);
        if (qrData.body) emailParams.append('body', qrData.body);
        return `mailto:${qrData.email}${emailParams.toString() ? '?' + emailParams.toString() : ''}`;
      
      case 'sms':
        if (!qrData.phone) return '';
        return `sms:${qrData.phone}${qrData.body ? '?body=' + encodeURIComponent(qrData.body) : ''}`;
      
      case 'social':
        if (!qrData.handle) return '';
        const platformUrls = {
          instagram: `https://instagram.com/${qrData.handle}`,
          youtube: `https://youtube.com/@${qrData.handle}`,
          whatsapp: `https://wa.me/${qrData.handle}`,
        };
        return platformUrls[qrData.platform] || '';
      
      case 'payment':
        if (!qrData.paymentId) return '';
        const paymentUrls = {
          upi: `upi://pay?pa=${qrData.paymentId}`,
          paypal: `https://paypal.me/${qrData.paymentId}`,
          stripe: qrData.paymentId,
        };
        return paymentUrls[qrData.platform] || '';
      
      case 'text':
        return qrData.text || '';
      
      default: // url
        return qrData.url || '';
    }
  };

  const qrValue = generateQRValue();

  const handleGenerate = async () => {
    if (!qrValue) {
      return false;
    }
    return true;
  };

  const handleClearLogo = () => {
    setLogoUrl(null);
  };

  return (
    <>
      <Helmet>
        <title>QR Code Generator - A2Z Utility Hub</title>
        <meta name="description" content="Create custom QR codes for URLs, WiFi, vCards, emails, SMS, and more. Free, fast, and feature-rich QR code generator." />
      </Helmet>
      
      <div className="w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Advanced QR Code Generator
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Create stunning, customizable QR codes for any purpose. Fast, free, and feature-packed.
            </p>
          </div>

          {/* Section Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <a href="#about" className="px-5 py-2 bg-white rounded-full shadow-sm border border-gray-200 text-gray-700 hover:text-teal-600 hover:border-teal-300 transition-colors text-sm font-medium">About</a>
            <a href="#manual" className="px-5 py-2 bg-white rounded-full shadow-sm border border-gray-200 text-gray-700 hover:text-teal-600 hover:border-teal-300 transition-colors text-sm font-medium">Manual</a>
            <a href="#faq" className="px-5 py-2 bg-white rounded-full shadow-sm border border-gray-200 text-gray-700 hover:text-teal-600 hover:border-teal-300 transition-colors text-sm font-medium">FAQ</a>
            <a href="#community" className="px-5 py-2 bg-white rounded-full shadow-sm border border-gray-200 text-gray-700 hover:text-teal-600 hover:border-teal-300 transition-colors text-sm font-medium">Community</a>
          </div>

          {shouldShowAds && (
            <AdSenseContainer className="mb-8 max-w-7xl mx-auto">
              <AdSenseHorizontal slot="qr_top" />
            </AdSenseContainer>
          )}

          {authLoading ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : !isAuthenticated ? (
            <div className="min-h-[40vh] flex items-center justify-center p-4 mb-16">
              <Card className="w-full max-w-md shadow-xl border-primary/10 bg-card text-center">
                <CardHeader className="pb-6 pt-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5">
                    <QrCode className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-extrabold tracking-tight">QR Code Generator</CardTitle>
                  <CardDescription className="text-base mt-3 text-muted-foreground">
                    Please log in to access the QR Code Generator and start creating.
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
                {/* Left Column - Controls */}
                <div className="lg:col-span-7 space-y-8">
                  <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6 sm:p-8">
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">1</span>
                        Content & Type
                      </h2>
                      <QRControls 
                        qrType={qrType} 
                        setQrType={setQrType} 
                        qrData={qrData} 
                        setQrData={setQrData}
                      />
                    </CardContent>
                  </Card>

                  {shouldShowAds && (
                    <AdSenseContainer>
                      <AdSenseResponsive slot="qr_mid" />
                    </AdSenseContainer>
                  )}

                  <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6 sm:p-8">
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">2</span>
                        Customize Style
                      </h2>
                      <QRStyleControls
                        fgColor={fgColor}
                        setFgColor={setFgColor}
                        bgColor={bgColor}
                        setBgColor={setBgColor}
                        size={size}
                        setSize={setSize}
                        qrStyle={qrStyle}
                        setQrStyle={setQrStyle}
                        level={level}
                        setLevel={setLevel}
                      />
                      
                      <div className="mt-8 border-t pt-8">
                        <h3 className="text-lg font-semibold mb-4">Add Logo (Optional)</h3>
                        <QRLogoUpload 
                          onLogoUpload={setLogoUrl} 
                          currentLogo={logoUrl} 
                        />
                        
                        {logoUrl && (
                          <LogoCustomizationPanel 
                            logoSize={logoSize}
                            setLogoSize={setLogoSize}
                            logoOpacity={logoOpacity}
                            setLogoOpacity={setLogoOpacity}
                            logoPosition={logoPosition}
                            setLogoPosition={setLogoPosition}
                            onClear={handleClearLogo}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Preview & Export */}
                <div className="lg:col-span-5">
                  <div className="sticky top-24">
                    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-primary to-purple-600"></div>
                      <CardContent className="p-6 sm:p-8">
                        <QRPreview 
                          value={qrValue}
                          fgColor={fgColor}
                          bgColor={bgColor}
                          size={size}
                          logo={logoUrl}
                          logoShape={logoShape}
                          level={level}
                          logoSize={logoSize}
                          logoOpacity={logoOpacity}
                          logoPosition={logoPosition}
                        />
                        <div className="pt-6 border-t mt-4">
                          <h3 className="font-semibold text-center text-gray-700 mb-2">Export Options</h3>
                          <QRExportBar 
                            onGenerate={handleGenerate} 
                            qrValue={qrValue} 
                            hasLogo={!!logoUrl}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Recent QR Codes */}
              <div className="max-w-7xl mx-auto mt-16 mb-16">
                <QRRecent />
              </div>
            </>
          )}

          {/* Info Sections Container */}
          <div className="max-w-6xl mx-auto space-y-12">
            <AboutAppSection />

            {shouldShowAds && (
              <AdSenseContainer className="my-8">
                <AdSenseResponsive slot="qr_about_mid" />
              </AdSenseContainer>
            )}

            <UserManualSection />

            {shouldShowAds && (
              <AdSenseContainer className="my-8">
                <AdSenseResponsive slot="qr_manual_mid" />
              </AdSenseContainer>
            )}

            <FAQSection />

            {shouldShowAds && (
              <AdSenseContainer className="my-8">
                <AdSenseResponsive slot="qr_faq_mid" />
              </AdSenseContainer>
            )}

            {/* Community Section */}
            <div id="community" className="mt-20 border-t border-gray-200/60 pt-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 flex items-center justify-center gap-2">
                <MessageCircle className="w-6 h-6 text-teal-600" />
                Community Discussion & Tips
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                 <CommentsSection pageId="app/qr-generator" />
              </div>
            </div>

            {shouldShowAds && (
              <AdSenseContainer className="mt-12">
                <AdSenseHorizontal slot="qr_bottom" />
              </AdSenseContainer>
            )}
          </div>

        </div>
      </div>
      <AppLoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultView={authView} />
    </>
  );
};

export default QrCodeGeneratorPage;