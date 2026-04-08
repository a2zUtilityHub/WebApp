import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, LayoutDashboard, Zap, Shield, Smartphone, ArrowRight } from 'lucide-react';
import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseResponsive from '@/components/ads/AdSenseResponsive';
import { useAdSense } from '@/contexts/AdSenseProvider';

const AboutPage = () => {
  const { shouldShowAds } = useAdSense();
  const features = [
    { icon: <LayoutDashboard className="w-6 h-6 text-primary" />, title: "Visual Kanban Board", desc: "Organize your workflow visually with intuitive columns." },
    { icon: <Zap className="w-6 h-6 text-amber-500" />, title: "Lightning Fast", desc: "Optimized for speed with drag-and-drop and keyboard shortcuts." },
    { icon: <Shield className="w-6 h-6 text-emerald-500" />, title: "Secure & Private", desc: "Your data is encrypted and securely synced in real-time." },
    { icon: <Smartphone className="w-6 h-6 text-indigo-500" />, title: "Mobile Ready", desc: "Manage tasks on-the-go with a fully responsive design." },
  ];

  return (
    <div className="bg-background min-h-screen animate-fade-in">
      <Helmet>
        <title>About Task Manager - A2Z Utility Hub</title>
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container max-w-5xl mx-auto text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Organize your workflow.<br/>
            <span className="text-primary">Boost your productivity.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            A simple, powerful, and intuitive task management tool designed to help you stay focused, hit deadlines, and achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8 text-lg">
              <Link to="/apps/task-manager">Get Started Free <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-lg">
              <Link to="/help">View Documentation</Link>
            </Button>
          </div>
        </div>
      </section>

      {shouldShowAds && (
        <AdSenseContainer className="mt-8 container">
            <AdSenseResponsive slot="about_mid" />
        </AdSenseContainer>
      )}

      {/* Features Grid */}
      <section className="py-24 container max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">Everything you need to get things done</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Powerful features hidden behind a beautifully simple interface.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {features.map((f, i) => (
            <div key={i} className="bg-background/60 backdrop-blur-xl p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
              <div className="bg-muted/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-border/50 shadow-sm">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{f.title}</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-24 bg-muted/10 border-y border-border/50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-extrabold tracking-tight mb-16 text-center text-foreground">Who is it for?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {['Students managing assignments', 'Professionals tracking deadlines', 'Freelancers organizing projects', 'Anyone looking for focus'].map((item, i) => (
              <div key={i} className="flex items-center p-6 bg-background/80 backdrop-blur-md rounded-2xl shadow-sm border border-border/50 hover:shadow-md hover:border-primary/30 transition-all duration-300">
                <div className="bg-primary/10 p-2 rounded-full mr-5 shrink-0">
                   <CheckCircle className="text-primary w-6 h-6" />
                </div>
                <span className="font-semibold text-lg text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;