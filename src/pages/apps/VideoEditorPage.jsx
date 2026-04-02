
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
                <div className="min-h-[60vh] flex items-center justify-center p-4">
                  <Card className="w-full max-w-md shadow-xl border-primary/10 bg-card text-center">
                    <CardHeader className="pb-6 pt-8">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5">
                        <Video className="w-10 h-10 text-primary" />
                      </div>
                      <CardTitle className="text-3xl font-extrabold tracking-tight">Video Editor</CardTitle>
                      <CardDescription className="text-base mt-3 text-muted-foreground">
                        Please log in to access the Video Editor and start creating amazing content
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
