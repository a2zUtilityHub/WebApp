import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  LayoutDashboard, 
  MessageSquarePlus, 
  List, 
  HelpCircle,
  LifeBuoy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SupportTicketForm from '@/components/support/SupportTicketForm';
import SupportTicketsList from '@/components/support/SupportTicketsList';
import SupportTicketDetail from '@/components/support/SupportTicketDetail';
import HeroSection from '@/components/HeroSection';
import Breadcrumbs from '@/components/Breadcrumbs';
import { motion } from 'framer-motion';
import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseResponsive from '@/components/ads/AdSenseResponsive';
import AdSenseVertical from '@/components/ads/AdSenseVertical';
import { useAdSense } from '@/contexts/AdSenseProvider';

const SupportPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tickets');
  const ticketId = searchParams.get('ticketId');
  const { shouldShowAds } = useAdSense();

  useEffect(() => {
     if (ticketId) {
        setActiveTab('detail');
     } else {
        const tab = searchParams.get('tab');
        if (tab && ['tickets', 'create', 'categories'].includes(tab)) {
           setActiveTab(tab);
        } else {
           setActiveTab('tickets');
        }
     }
  }, [searchParams, ticketId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleTicketSelect = (id) => {
    setSearchParams({ ticketId: id });
  };

  const handleBackToTickets = () => {
     setSearchParams({ tab: 'tickets' });
  };

  const sidebarItems = [
    { id: 'tickets', label: 'My Tickets', icon: List },
    { id: 'create', label: 'Create Ticket', icon: MessageSquarePlus },
    { id: 'categories', label: 'Help Categories', icon: LayoutDashboard },
  ];

  const renderContent = () => {
    if (activeTab === 'detail' && ticketId) {
      return <SupportTicketDetail ticketId={ticketId} onBack={handleBackToTickets} />;
    }

    switch (activeTab) {
      case 'create':
        return <SupportTicketForm onSuccess={handleBackToTickets} />;
      case 'categories':
        return (
          <div className="grid gap-6 md:grid-cols-2">
             <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white border-gray-200">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2"><LifeBuoy className="h-6 w-6 text-brand-primary"/> General Inquiry</CardTitle>
                   <CardDescription className="text-gray-600 mt-2">Questions about account, platform features, or general help.</CardDescription>
                </CardHeader>
             </Card>
             <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white border-gray-200">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2"><HelpCircle className="h-6 w-6 text-brand-accent"/> Technical Support</CardTitle>
                   <CardDescription className="text-gray-600 mt-2">Reporting bugs, errors, or technical glitches.</CardDescription>
                </CardHeader>
             </Card>
             <Card className="col-span-full bg-brand-primary/5 border-brand-primary/20">
                <CardHeader>
                   <CardTitle className="text-brand-primary">Need immediate help?</CardTitle>
                   <CardDescription className="text-gray-700 mt-1">Check out our FAQ page for instant answers to common questions.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Button asChild className="bg-brand-primary hover:bg-brand-primary-dark text-white">
                      <Link to="/faq">Visit FAQ</Link>
                   </Button>
                </CardContent>
             </Card>
          </div>
        );
      case 'tickets':
      default:
        return <SupportTicketsList onTicketSelect={handleTicketSelect} />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-background pb-20 relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <Helmet>
        <title>Support Center | a2z Utility Hub</title>
        <meta name="description" content="Get help from our support team and find answers to common questions." />
      </Helmet>
      
      <HeroSection 
        title="Support & Help Center"
        subtitle="Get help from our support team and find answers to common questions"
      />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { title: "Home", to: "/" },
            { title: "Support", to: "/support" }
          ]} 
          className="mb-8"
        />

        {shouldShowAds && (
          <AdSenseContainer className="mb-8">
            <AdSenseResponsive slot="support_top" />
          </AdSenseContainer>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 space-y-4">
             <div className="space-y-2 relative z-10">
               {sidebarItems.map((item) => (
                  <button
                     key={item.id}
                     onClick={() => handleTabChange(item.id)}
                     className={cn(
                        "w-full flex items-center gap-3 px-5 py-4 text-[15px] font-semibold rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
                        activeTab === item.id && !ticketId
                           ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md scale-[1.02]" 
                           : "bg-background/60 backdrop-blur-md border border-border/50 hover:border-primary/50 hover:bg-background/80 text-muted-foreground/90 hover:text-foreground hover:-translate-y-0.5"
                     )}
                  >
                     <item.icon className={cn("h-5 w-5 transition-colors", activeTab === item.id && !ticketId ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                     {item.label}
                  </button>
               ))}
             </div>
             
             <Separator className="my-8 border-border/50 relative z-10" />
             
             <div className="bg-background/60 backdrop-blur-xl rounded-3xl p-6 border border-border/50 shadow-sm relative z-10 hover:shadow-md transition-shadow">
                <h4 className="font-bold mb-4 text-foreground flex items-center gap-2 text-lg">
                   <div className="p-2 bg-primary/10 rounded-xl"><LifeBuoy className="h-5 w-5 text-primary" /></div>
                   Support Hours
                </h4>
                <div className="space-y-3">
                  <p className="text-[15px] text-muted-foreground flex justify-between border-b border-border/50 pb-2"><span>Mon-Fri:</span> <span className="font-bold text-foreground">9am - 6pm EST</span></p>
                  <p className="text-[15px] text-muted-foreground flex justify-between"><span>Weekend:</span> <span className="font-bold text-foreground">Limited Support</span></p>
                </div>
             </div>

             {shouldShowAds && (
               <AdSenseContainer className="mt-8">
                  <AdSenseVertical slot="support_sidebar" />
               </AdSenseContainer>
             )}
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
             <div className="animate-in fade-in duration-300">
                {renderContent()}
             </div>
          </main>
        </div>
      </div>
    </motion.div>
  );
};

export default SupportPage;