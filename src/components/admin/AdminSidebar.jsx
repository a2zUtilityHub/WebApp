import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  LayoutDashboard, Users, Shield, AppWindow, Ticket, BookOpen, ShoppingBag, 
  FolderTree, CreditCard, MessageSquare, Bot, LifeBuoy, CheckSquare, 
  UserCog, Activity, Database, Settings, Bell, Search, LogOut, X
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'User Management', path: '/admin/users', icon: Users },
  { name: 'Role Management', path: '/admin/roles', icon: Shield },
  { name: 'Apps', path: '/admin/apps', icon: AppWindow },
  { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
  { name: 'Blogs', path: '/admin/blogs', icon: BookOpen },
  { name: 'Deals', path: '/admin/deals', icon: ShoppingBag },
  { name: 'Categories', path: '/admin/categories', icon: FolderTree },
  { name: 'Plans', path: '/admin/plans', icon: CreditCard },
  { name: 'Messaging', path: '/admin/messaging', icon: MessageSquare },
  { name: 'Chatbot', path: '/admin/chatbot', icon: Bot },
  { name: 'Support', path: '/admin/support', icon: LifeBuoy },
  { name: 'Tasks', path: '/admin/tasks', icon: CheckSquare },
  { name: 'HR', path: '/admin/hr', icon: UserCog },
  { name: 'Audit', path: '/admin/audit', icon: Activity },
  { name: 'Backup', path: '/admin/backup', icon: Database },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
  { name: 'Notifications', path: '/admin/notifications', icon: Bell },
  { name: 'SEO', path: '/admin/seo', icon: Search }
];

const AdminSidebar = ({ isMobile, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, adminUser, adminSignOut } = useAuth();

  const handleLinkClick = () => {
    if (isMobile && setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    await adminSignOut();
    navigate('/admin/login');
  };

  return (
    <div className="flex flex-col h-full w-full bg-[hsl(var(--admin-sidebar-bg))] text-[hsl(var(--admin-text))] overflow-hidden">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[hsl(var(--admin-border))] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-sm">
            A2
          </div>
          <span className="font-bold text-lg tracking-tight text-[hsl(var(--admin-text))]">
            Admin Hub
          </span>
        </div>
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation Links */}
      <ScrollArea className="flex-1 py-4 px-3 custom-scrollbar">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative text-sm font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-[hsl(var(--admin-hover))] hover:text-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                )}
                <Icon className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-[hsl(var(--admin-border))] shrink-0 bg-[hsl(var(--admin-sidebar-bg))]">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Avatar className="h-10 w-10 border border-border shadow-sm">
            <AvatarImage src={profile?.avatar_url} alt="Admin" className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {profile?.first_name?.[0] || adminUser?.email?.[0]?.toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-semibold text-foreground truncate">
              {profile?.first_name || 'Admin User'}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {adminUser?.roles?.name || 'Super Admin'}
            </span>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl transition-colors">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be redirected to the login page and will need to authenticate again to access the admin panel.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Log out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminSidebar;