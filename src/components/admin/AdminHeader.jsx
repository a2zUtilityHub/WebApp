import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, Bell, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserPermissions } from '@/hooks/useUserPermissions';

const AdminHeader = ({ navItems = [], onSignOut }) => {
  const { adminUser } = useAuth();
  const location = useLocation();
  const { hasPermission } = useUserPermissions();

  const getPageTitle = () => {
    if (!navItems || !Array.isArray(navItems)) {
      return 'Admin Panel';
    }
    // Find the current item by best match (longest path match usually better, but startsWith is okay for flat routes)
    const currentNavItem = navItems.find(item => location.pathname === item.href || (item.href !== '/admin/dashboard' && location.pathname.startsWith(item.href)));
    return currentNavItem ? currentNavItem.label : 'Admin Panel';
  };
  
  const getInitials = (firstName, lastName) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return `${first}${last}`.toUpperCase() || 'AD';
  }

  const userFirstName = adminUser?.first_name || 'Admin';
  const userRole = adminUser?.roles?.name || 'User';
  const userAvatar = adminUser?.avatar_url;

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30 shadow-sm">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-[280px]">
            <div className="flex h-14 items-center border-b px-6">
              <Link to="/admin" className="flex items-center gap-2 font-bold text-lg">
                 <Shield className="h-6 w-6 text-primary" />
                 <span>A2Z Admin</span>
              </Link>
            </div>
            <nav className="grid gap-1 p-4 text-base font-medium overflow-y-auto">
              {Array.isArray(navItems) && navItems.length > 0 ? (
                navItems.map(item => {
                    const canAccess = hasPermission ? hasPermission(item.permission) : false;
                    if(item.permission && !canAccess) return null;

                    const isActive = location.pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
                            }`}
                        >
                            {item.icon && <item.icon className="h-5 w-5" />}
                            {item.label}
                        </Link>
                    )
                })
              ) : null}
            </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <h1 className="font-semibold text-lg">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <div className="flex items-center gap-3 pl-2 border-l">
           <div className="hidden md:block text-right">
              <p className="text-sm font-medium leading-none">{userFirstName}</p>
              <p className="text-xs text-muted-foreground mt-1">{userRole}</p>
            </div>
           <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{getInitials(adminUser?.first_name, adminUser?.last_name)}</AvatarFallback>
            </Avatar>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;