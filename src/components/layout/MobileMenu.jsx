import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Home, AppWindow, BookOpen, Settings, Tag, Info, Phone, Heart, User, LogIn, UserPlus, LogOut, MessageSquare, ShieldQuestion, ShoppingBag, Briefcase, Star, Newspaper, DollarSign, ListTree } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const mainNavItems = [
  { to: '/', text: 'Home', icon: Home },
  { to: '/store', text: 'Store', icon: ShoppingBag },
  { to: '/apps', text: 'Apps', icon: AppWindow },
  { to: '/pricing', text: 'Pricing', icon: DollarSign },
];

const moreNavItems = [
  { to: '/categories', text: 'Categories', icon: ListTree },
  { to: '/popular-deals', text: 'Popular Deals', icon: Star },
  { to: '/blogs', text: 'Blogs', icon: BookOpen },
  { to: '/coupons', text: 'Coupons', icon: Tag },
  { to: '/discussion', text: 'Community', icon: MessageSquare },
  { to: '/support', text: 'Support', icon: Heart },
  { to: '/settings', text: 'Settings', icon: Settings },
  { to: '/donate', text: 'Donate', icon: Heart },
];

const MobileMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSignOut = async () => {
    setIsSheetOpen(false);
    await signOut();
  };

  const handleLinkClick = (path) => {
    setIsSheetOpen(false);
    navigate(path);
  }

  const isMoreActive = moreNavItems.some(item => location.pathname === item.to) || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/settings');

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-background/80 backdrop-blur-xl border-t border-border/50 z-[60] shadow-[0_-4px_24px_rgba(0,0,0,0.04)] pb-safe">
      <div className="flex h-full w-full justify-around items-center px-2 max-w-md mx-auto">
        {mainNavItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 h-[60px] min-h-[44px] min-w-[44px] transition-all duration-250 rounded-xl mx-0.5 outline-none focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 [-webkit-tap-highlight-color:transparent] select-none ${isActive
                  ? 'text-brand-primary bg-brand-primary/10 scale-105'
                  : 'text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 active:scale-95'
                }`}
            >
              <item.icon className={`w-6 h-6 mb-1 transition-transform duration-250 ${isActive ? 'scale-110 fill-brand-primary/10' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] leading-none transition-all duration-200 ${isActive ? 'font-bold' : 'font-medium'}`}>{item.text}</span>
            </NavLink>
          );
        })}

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button type="button" className={`flex flex-col items-center justify-center flex-1 h-[60px] min-h-[44px] min-w-[44px] transition-all duration-250 rounded-xl mx-0.5 outline-none focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 [-webkit-tap-highlight-color:transparent] select-none ${isSheetOpen || isMoreActive ? 'text-brand-primary bg-brand-primary/10 scale-105' : 'text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 active:scale-95'}`}>
              <Settings className={`w-6 h-6 mb-1 transition-all duration-300 ${isSheetOpen ? 'rotate-90 scale-110 fill-brand-primary/10' : isMoreActive ? 'fill-brand-primary/10' : ''}`} strokeWidth={isSheetOpen || isMoreActive ? 2.5 : 2} />
              <span className={`text-[10px] leading-none transition-all duration-200 ${isSheetOpen || isMoreActive ? 'font-bold' : 'font-medium'}`}>More</span>
            </button>
          </SheetTrigger>
          
          <SheetContent side="bottom" className="w-full max-h-[90dvh] flex flex-col p-0 rounded-t-3xl z-[70] shadow-2xl border border-border/50 bg-background/80 backdrop-blur-2xl">
            
            {/* Header stays pinned to the top - Logo Removed */}
            <SheetHeader className="pt-6 pb-2 px-6 flex flex-col items-center justify-center shrink-0">
              <div className="w-12 h-1.5 bg-muted rounded-full mb-4 opacity-50"></div>
              <SheetTitle className="text-xl font-bold tracking-tight text-foreground">Discover More</SheetTitle>
            </SheetHeader>
            
            {/* Scrollable container for links */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-12 pt-2">
              <nav className="grid grid-cols-3 gap-3 py-2">
                {moreNavItems.map(item => (
                  <button key={item.to} onClick={() => handleLinkClick(item.to)} className="group flex flex-col items-center justify-center p-3 h-[96px] min-h-[44px] bg-muted/30 dark:bg-muted/10 rounded-2xl hover:bg-brand-primary/10 hover:text-brand-primary hover:shadow-sm text-foreground/80 hover:text-brand-primary transition-all duration-200 border border-transparent hover:border-brand-primary/20 outline-none focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 [-webkit-tap-highlight-color:transparent] select-none active:scale-[0.96]">
                    <item.icon className="w-7 h-7 mb-2.5 opacity-80 transition-transform group-hover:-translate-y-1" />
                    <span className="text-[12px] font-semibold text-center leading-tight tracking-wide">{item.text}</span>
                  </button>
                ))}
              </nav>
              
              <div className="border-t border-gray-200/60 mt-6 pt-6 mb-8">
                {user ? (
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start h-14 rounded-xl text-base font-semibold border-gray-200 hover:bg-brand-primary/5 hover:text-brand-primary hover:border-brand-primary/30 shadow-sm outline-none focus:!outline-none focus:!ring-0 [-webkit-tap-highlight-color:transparent]" onClick={() => handleLinkClick('/dashboard')}><User className="mr-3 h-5 w-5 text-brand-primary" />My Dashboard</Button>
                    <Button variant="destructive" className="w-full justify-start h-14 rounded-xl text-base font-semibold bg-red-50 text-red-600 hover:bg-red-100 border-0 outline-none focus:!outline-none focus:!ring-0 [-webkit-tap-highlight-color:transparent]" onClick={handleSignOut}><LogOut className="mr-3 h-5 w-5" />Sign Out</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button variant="outline" className="w-full h-14 rounded-xl text-base font-semibold border-gray-200 hover:bg-brand-primary/5 hover:text-brand-primary shadow-sm outline-none focus:!outline-none focus:!ring-0 [-webkit-tap-highlight-color:transparent]" onClick={() => handleLinkClick('/auth?mode=login')}><LogIn className="mr-3 h-5 w-5" />Sign In</Button>
                    <Button className="w-full h-14 rounded-xl text-base font-semibold bg-brand-primary hover:bg-brand-secondary text-white shadow-md outline-none focus:!outline-none focus:!ring-0 [-webkit-tap-highlight-color:transparent]" onClick={() => handleLinkClick('/auth?mode=signup')}><UserPlus className="mr-3 h-5 w-5" />Create Account</Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileMenu;