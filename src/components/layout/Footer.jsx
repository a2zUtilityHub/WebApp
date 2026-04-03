
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
        const visibility = { ...visiblePages };
        data?.forEach(p => {
            if (p.slug === 'about-us') visibility.about = p.is_visible;
            if (p.slug === 'contact-us') visibility.contact = p.is_visible;
            if (p.slug === 'share-earn') visibility.share = p.is_visible;
            if (p.slug === 'testimonials') visibility.testimonials = p.is_visible;
        });
        setVisiblePages(visibility);
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
    <footer className="w-full bg-white text-gray-700 border-t border-gray-200 mt-auto pt-6 flex flex-col items-center">
      <AdSenseContainer className="mt-0 mb-8 w-full px-4">
        <AdSenseHorizontal slot="footer_top" />
      </AdSenseContainer>

      <div className="w-full px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 w-full">
          
          {/* Company Section */}
          <div className="flex flex-col items-start text-left">
            <h3 className="font-bold text-[18px] text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-primary"/> Company
            </h3>
            <ul className="space-y-4 text-left w-full">
              {visiblePages.about && (
                  <li><Link to="/about" className="text-[14px] text-gray-600 hover:text-brand-primary block">About Us</Link></li>
              )}
              {visiblePages.contact && (
                  <li><Link to="/contact" className="text-[14px] text-gray-600 hover:text-brand-primary block">Contact Us</Link></li>
              )}
              {visiblePages.testimonials && (
                  <li><Link to="/testimonials" className="text-[14px] text-gray-600 hover:text-brand-primary block">Testimonials</Link></li>
              )}
              <li><Link to="/careers" className="text-[14px] text-gray-600 hover:text-brand-primary block">Careers</Link></li>
              <li><Link to="/faq" className="text-[14px] text-gray-600 hover:text-brand-primary block">FAQs</Link></li>
              <li><Link to="/press" className="text-[14px] text-gray-600 hover:text-brand-primary block">Press</Link></li>
            </ul>
          </div>

          {/* Guidelines Section */}
          <div className="flex flex-col items-start text-left">
            <h3 className="font-bold text-[18px] text-gray-900 mb-5 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-brand-primary"/> Guidelines
            </h3>
            <ul className="space-y-4 text-left w-full">
              <li><Link to="/how-it-works" className="text-[14px] text-gray-600 hover:text-brand-primary block">How It Works</Link></li>
              <li><Link to="/privacy" className="text-[14px] text-gray-600 hover:text-brand-primary block">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-[14px] text-gray-600 hover:text-brand-primary block">Terms of Service</Link></li>
              <li><Link to="/refer-earn" className="text-[14px] text-gray-600 hover:text-brand-primary block">Refer and Earn</Link></li>
              {visiblePages.share && (
                  <li><Link to="/share-earn" className="text-[14px] text-gray-600 hover:text-brand-primary block">Share and Earn</Link></li>
              )}
            </ul>
          </div>

          {/* Popular Deals */}
          <div className="flex flex-col items-start text-left">
             <Link to="/popular-deals" className="group block w-full">
               <h3 className="font-bold text-[18px] text-gray-900 mb-5 flex items-center gap-2 group-hover:text-brand-primary transition-colors">
                 <Ticket className="h-5 w-5 text-brand-primary"/> Popular Deals
               </h3>
             </Link>
             <ul className="space-y-4 text-left w-full">
              <li><Link to="/popular-deals" className="text-[14px] font-semibold text-brand-primary hover:text-brand-primary-dark block">All Popular Deals →</Link></li>
              {['Amazon', 'Flipkart', 'MakeMyTrip', 'Dominos', 'BigBasket'].map((item) => (
                <li key={item}><Link to={`/coupons/${item.toLowerCase()}`} className="text-[14px] text-gray-600 hover:text-brand-primary block">{item} Coupons</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
           <div className="flex flex-col items-start text-left">
             <Link to="/categories" className="group block w-full">
               <h3 className="font-bold text-[18px] text-gray-900 mb-5 flex items-center gap-2 group-hover:text-brand-primary transition-colors">
                <LinkIcon className="h-5 w-5 text-brand-primary"/> Categories
               </h3>
             </Link>
             <ul className="space-y-4 text-left w-full">
              {['Mobiles', 'Electronics', 'Fashion', 'Home Appliances', 'Travel'].map((item) => (
                <li key={item}><Link to={`/categories/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-[14px] text-gray-600 hover:text-brand-primary block">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="flex flex-col items-start text-left">
            <h3 className="font-bold text-[18px] text-gray-900 mb-5">Stay Updated</h3>
            <NewsletterSubscriptionComponent />
            <div className="flex gap-3 mb-8 mt-6 w-full">
               <Button asChild className="flex-1 bg-brand-primary text-white min-h-[44px]"><Link to="/donate"><Heart className="h-4 w-4 mr-2" /> Donate</Link></Button>
               <Button asChild variant="outline" className="flex-1 min-h-[44px]"><Link to="/apps"><Wrench className="h-4 w-4 mr-2" /> Tools</Link></Button>
            </div>
            <h3 className="font-bold text-[16px] text-gray-900 mb-4">Connect With Us</h3>
            <div className="flex gap-2 justify-start w-full">
              {socialLinks.map((link, idx) => (
                <a key={idx} href={link.path} className="flex items-center justify-center h-11 w-11 rounded-full border border-gray-200 text-gray-500 hover:bg-brand-primary hover:text-white transition-all"><link.icon className="h-5 w-5"/></a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Copyright Bar */}
      <div className="border-t border-gray-100 bg-gray-50 w-full mt-4 pb-[80px] md:pb-0">
         <div className="w-full px-4 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <span className="text-[12px] text-gray-500 text-left">
              &copy; {year} {company}. All rights reserved.
            </span>
            <div className="flex flex-wrap justify-start items-center gap-4 text-[12px] text-gray-500">
              <Link to="/sitemap" className="hover:text-brand-primary">Sitemap</Link>
              <span className="hidden md:inline">•</span>
              <Link to="/privacy" className="hover:text-brand-primary">Privacy</Link>
              <span className="hidden md:inline">•</span>
              <Link to="/terms" className="hover:text-brand-primary">Terms</Link>
            </div>
         </div>
      </div>
    </footer>
  );
};

export default Footer;
