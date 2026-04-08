
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Shield, Key, Activity, Briefcase, FileText, 
  FolderOpen, Ticket, ShoppingCart, MessageSquare, Bot, LifeBuoy, Bell, 
  Settings, Database, Download, Globe, X, ChevronDown, ChevronRight, LogOut, Circle
} from 'lucide-react';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { adminNavigation } from '@/config/adminNavigation';

const iconMap = {
  LayoutDashboard, Users, Shield, Key, Activity, Briefcase, FileText, 
  FolderOpen, Ticket, ShoppingCart, MessageSquare, Bot, LifeBuoy, Bell, 
  Settings, Database, Download, Globe
};

const AdminSidebar = ({ isMobile, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, adminUser, adminSignOut, hasPermission } = useAuth();
  
  const [openGroups, setOpenGroups] = useState(() => {
    const activeGroups = adminNavigation
      .filter(group => group.items?.some(item => location.pathname.startsWith(item.route)))
      .map(group => group.id);
    return activeGroups.length ? activeGroups : [adminNavigation[0]?.id];
  });

  const handleLinkClick = () => {
    if (isMobile && setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    await adminSignOut();
    navigate('/admin/login');
  };

  const toggleGroup = (id) => {
    setOpenGroups(prev => 
      prev.includes(id) ? prev.filter(groupId => groupId !== id) : [...prev, id]
    );
  };

  const renderItem = (item) => {
    if (item.permission && !hasPermission(item.permission)) {
      return null;
    }

    const IconComponent = iconMap[item.icon] || Circle;
    
    // Explicitly define isActive by checking the current location path against the item route
    const isActive = location.pathname === item.route || location.pathname.startsWith(`${item.route}/`);

    return (
      <NavLink
        key={item.id}
        to={item.route}
        onClick={handleLinkClick}
        className={cn(
          "flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-all duration-200 text-sm font-medium",
          isActive 
            ? "bg-blue-600 text-white shadow-md border border-blue-500" 
            : "text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent"
        )}
      >
        <IconComponent className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-slate-400")} />
        <span className="truncate">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <div className="flex flex-col h-full w-[280px] min-w-[280px] bg-slate-950 text-slate-100 border-r border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm shadow-blue-900/50">
            A2
          </div>
          <span className="font-bold text-lg tracking-tight text-white">Admin Hub</span>
        </div>
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation Areas */}
      <ScrollArea className="flex-1 py-6 px-4 custom-scrollbar">
        <nav className="space-y-6">
          {adminNavigation.map((group) => {
            const hasVisibleItems = group.items?.some(item => !item.permission || hasPermission(item.permission));
            
            if (!hasVisibleItems) {
              return null;
            }

            const isOpen = openGroups.includes(group.id);

            return (
              <Collapsible
                key={group.id}
                open={isOpen}
                onOpenChange={() => toggleGroup(group.id)}
                className="space-y-2"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-2 py-2 h-auto hover:bg-slate-900 hover:text-white group"
                  >
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-200 transition-colors">
                      {group.label}
                    </span>
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-slate-300" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1.5 px-1 pt-1">
                  {group.items.map(item => renderItem(item))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer Area */}
      <div className="p-5 border-t border-slate-800 bg-slate-950 shrink-0">
        <div className="flex items-center gap-3 mb-5 px-1">
          <Avatar className="h-10 w-10 border border-slate-700 shadow-sm">
            <AvatarImage src={profile?.avatar_url} alt="Admin" className="object-cover" />
            <AvatarFallback className="bg-blue-900/50 text-blue-400 font-medium">
              {profile?.first_name?.[0] || adminUser?.email?.[0]?.toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-semibold text-white truncate">
              {profile?.first_name || adminUser?.email || 'Admin User'}
            </span>
            <span className="text-xs text-slate-400 truncate">
              {adminUser?.roles?.name || 'Administrator'}
            </span>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-500/20">
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Log out of Admin Panel?</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400">
                You will be required to authenticate again to access this area.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700 hover:text-white border-slate-700">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">
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
