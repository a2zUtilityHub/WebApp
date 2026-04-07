import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  LogOut, 
  LayoutDashboard, 
  Home, 
  AppWindow, 
  BookOpen, 
  Tag, 
  DollarSign, 
  ShoppingBag, 
  Heart, 
  ShoppingCart as ShoppingCartIcon, 
  Bell, 
  MessageSquare, 
  Settings,
  Shield
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import ShoppingCart from '@/components/ShoppingCart';
import { useUserNotifications } from '@/hooks/useUserNotifications';
import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseResponsive from '@/components/ads/AdSenseResponsive';
import { useAdSense } from '@/contexts/AdSenseProvider';

const Navbar = () => {
  const { user, profile, isAdmin, signOut, loading, authReady } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { unreadCount } = useUserNotifications();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { shouldShowAds } = useAdSense();

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishItemCount = wishlist.length;

  const mainNavItems = [
    { to: '/', text: 'Home', icon: Home },
    { to: '/apps', text: 'Apps', icon: AppWindow },
    { to: '/store', text: 'Store', icon: ShoppingBag },
    { to: '/pricing', text: 'Pricing', icon: DollarSign },
    { to: '/blogs', text: 'Blogs', icon: BookOpen },
    { to: '/coupons', text: 'Coupons', icon: Tag },
    { to: '/discussion', text: 'Community', icon: MessageSquare },
    { to: '/support', text: 'Support', icon: Heart },
  ];
  
  return (
    <>
      <header className="hidden md:block sticky top-0 z-[60] w-full border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-sm transition-all duration-200">
        <div className="flex h-16 items-center justify-between w-full px-4">
          
          <div className="flex items-center shrink-0 min-w-0 mr-4">
            <BrandLogo />
          </div>

          <div className="hidden lg:flex flex-1 items-center justify-center overflow-x-auto hide-scrollbar">
            <nav className="flex items-center gap-1">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.text}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative flex items-center gap-1.5 px-2 py-2 mx-1 transition-colors text-sm font-medium whitespace-nowrap outline-none focus:outline-none focus-visible:outline-none [-webkit-tap-highlight-color:transparent] ` +
                    `after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:transition-transform after:duration-300 after:bg-brand-primary ` +
                    (isActive
                      ? `text-brand-primary after:scale-x-100`
                      : `text-gray-700 hover:text-brand-primary after:scale-x-0 hover:after:scale-x-100`)
                  }
                >
                  <item.icon className="h-4 w-4" /> {item.text}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center justify-end gap-2 shrink-0">
            {user && (
              <>
                <Button asChild variant="ghost" size="icon" className="relative text-gray-700 hover:text-brand-primary">
                  <Link to="/notifications">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{unreadCount}</span>}
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="relative text-gray-700 hover:text-brand-primary">
                  <Link to="/wishlist">
                    <Heart className="h-5 w-5" />
                    {wishItemCount > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{wishItemCount}</span>}
                  </Link>
                </Button>
              </>
            )}

            <Button variant="ghost" size="icon" className="relative text-gray-700 hover:text-brand-primary" onClick={() => setIsCartOpen(true)}>
              <ShoppingCartIcon className="h-5 w-5" />
              {cartItemCount > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-secondary text-[10px] font-bold text-white">{cartItemCount}</span>}
            </Button>

            {!loading && authReady && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 h-10 px-2 rounded-xl hover:bg-brand-primary/5">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback className="bg-brand-primary text-white">{profile?.first_name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl">
                    <DropdownMenuItem asChild><Link to="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link></DropdownMenuItem>
                    
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="text-brand-primary font-medium">
                            <Shield className="mr-2 h-4 w-4" />Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-red-600"><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2 ml-2">
                  <Button asChild variant="ghost" className="hidden sm:flex h-9 px-4"><Link to="/auth?mode=login">Login</Link></Button>
                  <Button asChild className="h-9 px-4"><Link to="/auth?mode=signup">Sign Up</Link></Button>
                  <Button asChild variant="ghost" size="icon" className="text-gray-400 hover:text-brand-primary ml-1" title="Admin Login">
                    <Link to="/admin/login"><Shield className="h-4 w-4" /></Link>
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </header>
      
      {shouldShowAds && (
        <AdSenseContainer className="mb-0 mt-2 w-full px-4 !min-h-[50px]">
          <AdSenseResponsive slot="navbar_bottom" />
        </AdSenseContainer>
      )}

      <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>
  );
};

export default Navbar;