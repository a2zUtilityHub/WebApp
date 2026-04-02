
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gray-50/50 pb-20">
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
             <div className="space-y-2">
               {sidebarItems.map((item) => (
                  <button
                     key={item.id}
                     onClick={() => handleTabChange(item.id)}
                     className={cn(
                        "w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200",
                        activeTab === item.id && !ticketId
                           ? "bg-brand-primary text-white shadow-md" 
                           : "bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700"
                     )}
                  >
                     <item.icon className={cn("h-5 w-5", activeTab === item.id && !ticketId ? "text-white" : "text-gray-500")} />
                     {item.label}
                  </button>
               ))}
             </div>
             
             <Separator className="my-6 border-gray-200" />
             
             <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h4 className="font-bold mb-3 text-gray-900 flex items-center gap-2">
                   <LifeBuoy className="h-5 w-5 text-brand-primary" />
                   Support Hours
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 flex justify-between"><span>Mon-Fri:</span> <span className="font-medium">9am - 6pm EST</span></p>
                  <p className="text-sm text-gray-600 flex justify-between"><span>Weekend:</span> <span className="font-medium">Limited Support</span></p>
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
