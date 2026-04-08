import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { VideoProvider } from '@/contexts/VideoContext';
import VideoEditor from '@/components/video/VideoEditor';
import ErrorBoundaryWithRetry from '@/components/ErrorBoundaryWithRetry';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Loader2, Film, Sparkles, Scissors, Mic, Type, Download } from 'lucide-react';

import { AppPageNavigation } from '@/components/apps/shared/AppPageNavigation';
import { AboutSection, ManualSection, FAQSection, CommunitySection } from '@/components/apps/shared/AppSections';
import { AppLoginModal } from '@/components/apps/shared/AppLoginModal';

const videoEditorData = {
  about: {
    title: "Video Studio Pro",
    description: "Video Studio Pro is a powerful, browser-based video editing platform that brings professional-grade tools directly to your fingertips. Create stunning videos without the need for expensive software.",
    features: [
      { icon: <Film className="w-6 h-6" />, title: "Browser Editing", desc: "Full-featured multi-track editing right in your browser." },
      { icon: <Sparkles className="w-6 h-6" />, title: "AI-Powered", desc: "Auto-subtitles, noise removal, and smart cropping." },
      { icon: <Scissors className="w-6 h-6" />, title: "Timeline", desc: "Drag, drop, split, and arrange clips with precision." },
      { icon: <Mic className="w-6 h-6" />, title: "Audio Mixing", desc: "Control volume, add background music, and voiceovers." },
      { icon: <Type className="w-6 h-6" />, title: "Text Overlays", desc: "Add beautiful, customizable text and titles to videos." },
      { icon: <Download className="w-6 h-6" />, title: "Export", desc: "Fast rendering and export to standard MP4 formats." },
    ],
    benefits: [
      "Save hours of editing time with AI tools.",
      "No need for expensive hardware or software.",
      "Edit anywhere, anytime on any device.",
      "Secure processing (files stay in your browser)."
    ]
  },
  manual: {
    title: "Video Editor",
    steps: [
      { title: "Upload Video", desc: "Drag and drop your video files into the upload area." },
      { title: "Timeline Editing", desc: "Arrange clips by dragging them along the timeline." },
      { title: "Add Text/Music", desc: "Use the side tools to overlay audio and titles." },
      { title: "Export", desc: "Choose resolution and format, then click Export." }
    ],
    tips: [
      "Use keyboard shortcuts (Space to play/pause).",
      "Always preview AI-generated subtitles before export.",
      "Split large videos into smaller segments for easier manipulation."
    ]
  },
  faq: [
    { q: "What formats are supported?", a: "MP4 and WebM formats are fully supported for browser-based editing." },
    { q: "Is there a size limit?", a: "We recommend keeping files under 500MB for optimal browser performance." },
    { q: "Is my data secure?", a: "Yes. Core editing happens in your browser. Files aren't uploaded unless you save to cloud." }
  ]
};

const VideoEditorPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState('login');

  return (
    <ErrorBoundaryWithRetry>
      <VideoProvider>
        <Helmet>
          <title>Video Studio Pro - A2Z Utility Hub</title>
          <meta name="description" content="Advanced in-browser video editor with multi-track support, audio mixing, AI tools, and text overlays." />
        </Helmet>
        <div className="min-h-screen bg-background text-foreground pb-20 w-full overflow-x-hidden flex flex-col">
          <AppPageNavigation />
          
          <div className="flex-1 space-y-16">
            
            {/* Tool Section */}
            <section id="tool" className="scroll-mt-24">
              {loading ? (
                <div className="flex min-h-[60vh] items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              ) : !isAuthenticated ? (
                <div className="min-h-[60vh] flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
                  <Card className="w-full max-w-md border border-border/50 bg-background/60 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] text-center relative z-10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/40 to-primary"></div>
                    <CardHeader className="pb-6 pt-10">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-sm relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                        <Video className="w-10 h-10 text-primary relative z-10" />
                      </div>
                      <CardTitle className="text-3xl font-black tracking-tight text-foreground">Video Studio Pro</CardTitle>
                      <CardDescription className="text-lg mt-3 text-muted-foreground font-medium px-4">
                        Please log in to access the editing suite and start creating amazing content.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 pb-10 px-10">
                      <Button size="lg" className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-bold text-lg" onClick={() => { setAuthView('login'); setIsAuthModalOpen(true); }}>
                        Login to Continue
                      </Button>
                      <Button variant="outline" size="lg" className="w-full h-14 rounded-2xl border-border/50 bg-background/60 backdrop-blur-sm hover:bg-muted shadow-sm font-bold text-lg" onClick={() => { setAuthView('signup'); setIsAuthModalOpen(true); }}>
                        Create an Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <VideoEditor />
              )}
            </section>

            {/* About Section */}
            <section id="about" className="scroll-mt-24">
              <AboutSection {...videoEditorData.about} />
            </section>

            {/* Manual Section */}
            <section id="manual" className="scroll-mt-24">
              <ManualSection {...videoEditorData.manual} />
            </section>

            {/* FAQ Section */}
            <section id="faq" className="scroll-mt-24">
              <FAQSection faqs={videoEditorData.faq} />
            </section>

            {/* Community Section */}
            <section id="community" className="scroll-mt-24">
              <CommunitySection appId="video-editor" />
            </section>

          </div>
        </div>
        
        <AppLoginModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          defaultView={authView} 
        />
      </VideoProvider>
    </ErrorBoundaryWithRetry>
  );
};

export default VideoEditorPage;