import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFooterCMS } from '@/hooks/useFooterCMS';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  Twitter, Linkedin, Instagram, Youtube, Building2, HelpCircle, Ticket, 
  Link as LinkIcon, Heart, Wrench 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewsletterSubscriptionComponent from '@/components/NewsletterSubscriptionComponent';
import { supabase } from '@/lib/customSupabaseClient';
import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseHorizontal from '@/components/ads/AdSenseHorizontal';

const Footer = () => {
  const { fetchCopyright } = useFooterCMS();
  const { user } = useAuth();
  const [copyright, setCopyright] = useState(null);
  const [visiblePages, setVisiblePages] = useState({
      about: true,
      contact: true,
      share: true,
      testimonials: true
  });

  useEffect(() => {
    fetchCopyright().then(({ data }) => setCopyright(data));
    
    const checkVisibility = async () => {
        const { data } = await supabase.from('pages').select('slug, is_visible').in('slug', ['about-us', 'contact-us', 'share-earn', 'testimonials']);
        setVisiblePages(prev => {
            const visibility = { ...prev };
            data?.forEach(p => {
                if (p.slug === 'about-us') visibility.about = p.is_visible;
                if (p.slug === 'contact-us') visibility.contact = p.is_visible;
                if (p.slug === 'share-earn') visibility.share = p.is_visible;
                if (p.slug === 'testimonials') visibility.testimonials = p.is_visible;
            });
            return visibility;
        });
    };
    checkVisibility();
  }, [fetchCopyright]);

  const socialLinks = [
    { icon: Linkedin, path: copyright?.social_links?.linkedin || 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, path: copyright?.social_links?.twitter || 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, path: copyright?.social_links?.instagram || 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, path: copyright?.social_links?.youtube || 'https://youtube.com', label: 'YouTube' },
  ];

  const year = copyright?.copyright_year || new Date().getFullYear();
  const company = copyright?.company_name || 'a2z Utility Hub';

  return (
    <footer className="w-full bg-background/80 backdrop-blur-3xl text-muted-foreground border-t border-border/50 mt-auto pt-6 flex flex-col items-center relative z-40">
      <AdSenseContainer className="mt-0 mb-8 w-full px-4">
        <AdSenseHorizontal slot="footer_top" />
      </AdSenseContainer>

      <div className="w-full px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 w-full">
          
          {/* Company Section */}
          <div className="flex flex-col items-start text-left">
            <h3 className="font-extrabold text-[18px] text-foreground mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary"/> Company
            </h3>
            <ul className="space-y-4 text-left w-full">
              {visiblePages.about && (
                  <li><Link to="/about" className="text-[15px] font-medium text-muted-foreground/80 hover:text-primary transition-colors block">About Us</Link></li>
              )}
              {visiblePages.contact && (
                  <li><Link to="/contact" className="text-[15px] font-medium text-muted-foreground/80 hover:text-primary transition-colors block">Contact Us</Link></li>
              )}
              {visiblePages.testimonials && (
                  <li><Link to="/testimonials" className="text-[15px] font-medium text-muted-foreground/80 hover:text-primary transition-colors block">Testimonials</Link></li>
              )}
              <li><Link to="/careers" className="text-[15px] font-medium text-muted-foreground/80 hover:text-primary transition-colors block">Careers</Link></li>
              <li><Link to="/faq" className="text-[15px] font-medium text-muted-foreground/80 hover:text-primary transition-colors block">FAQs</Link></li>
              <li><Link to="/press" className="text-[15px] font-medium text-muted-foreground/80 hover:text-primary transition-colors block">Press</Link></li>
            </ul>
          </div>

          {/* Guidelines Section */}
          <div className="flex flex-col items-start text-left">
            <h3 className="font-extrabold text-[18px] text-foreground mb-5 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary"/> Guidelines
            </h3>
            <ul className="space-y-4 text-left w-full">
              <li><Link to="/how-it-works" className="text-[15px] font-medium text-muted-foreground/80 hover:text-primary transition-colors block">How It Works</Link></li>
              <li><Link to="/privacy" className="text-[15px] font-medium text-muted-foreground/80 hover:text-primary transition-colors block">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-[15px] font-medium text-muted-foreground/80 hover:text-primary transition-colors block">Terms of Service</Link></li>
              <li><Link to="/refer-earn" className="text-[15px] font-medium text-muted-foreground/80 hover:text-primary transition-colors block">Refer and Earn</Link></li>
              {visiblePages.share && (
                  <li><Link to="/share-earn" className="text-[15px] font-medium text-muted-foreground/80 hover:text-primary transition-colors block">Share and Earn</Link></li>
              )}
            </ul>
          </div>

          {/* Popular Deals */}
          <div className="flex flex-col items-start text-left">
             <Link to="/popular-deals" className="group block w-full">
               <h3 className="font-extrabold text-[18px] text-foreground mb-5 flex items-center gap-2 group-hover:text-primary transition-colors">
                 <Ticket className="h-5 w-5 text-primary"/> Popular Deals
               </h3>
             </Link>
             <ul className="space-y-4 text-left w-full">
              <li><Link to="/popular-deals" className="text-[15px] font-bold text-primary hover:text-primary/80 transition-colors block">All Popular Deals →</Link></li>
              {['Amazon', 'Flipkart', 'MakeMyTrip', 'Dominos', 'BigBasket'].map((item) => (
                <li key={item}><Link to={`/coupons/${item.toLowerCase()}`} className="text-[15px] font-medium text-muted-foreground/80 hover:text-primary transition-colors block">{item} Coupons</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
           <div className="flex flex-col items-start text-left">
             <Link to="/categories" className="group block w-full">
               <h3 className="font-extrabold text-[18px] text-foreground mb-5 flex items-center gap-2 group-hover:text-primary transition-colors">
                <LinkIcon className="h-5 w-5 text-primary"/> Categories
               </h3>
             </Link>
             <ul className="space-y-4 text-left w-full">
              {['Mobiles', 'Electronics', 'Fashion', 'Home Appliances', 'Travel'].map((item) => (
                <li key={item}><Link to={`/categories/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-[15px] font-medium text-muted-foreground/80 hover:text-primary transition-colors block">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="flex flex-col items-start text-left">
            <h3 className="font-extrabold text-[18px] text-foreground mb-5">Stay Updated</h3>
            <NewsletterSubscriptionComponent />
            <div className="flex gap-3 mb-8 mt-6 w-full">
               <Button asChild className="flex-1 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground min-h-[44px] rounded-xl shadow-sm hover:shadow-md transition-all"><Link to="/donate"><Heart className="h-4 w-4 mr-2" /> Donate</Link></Button>
               <Button asChild variant="outline" className="flex-1 min-h-[44px] rounded-xl border-border/50 bg-background/60 hover:bg-background/80"><Link to="/apps"><Wrench className="h-4 w-4 mr-2" /> Tools</Link></Button>
            </div>
            <h3 className="font-extrabold text-[16px] text-foreground mb-4">Connect With Us</h3>
            <div className="flex gap-2 justify-start w-full">
              {socialLinks.map((link, idx) => (
                <a key={idx} href={link.path} className="flex items-center justify-center h-11 w-11 rounded-full border border-border/50 text-muted-foreground bg-background/60 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-1 transition-all duration-300 shadow-sm"><link.icon className="h-5 w-5"/></a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Copyright Bar */}
      <div className="border-t border-border/50 bg-muted/10 w-full mt-4 pb-[80px] md:pb-0">
         <div className="w-full px-4 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <span className="text-[13px] font-medium text-muted-foreground/80 text-left">
              &copy; {year} {company}. All rights reserved.
            </span>
            <div className="flex flex-wrap justify-start items-center gap-4 text-[13px] font-medium text-muted-foreground/80">
              <Link to="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
              <span className="hidden md:inline opacity-50">•</span>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <span className="hidden md:inline opacity-50">•</span>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
         </div>
      </div>
    </footer>
  );
};

export default Footer;