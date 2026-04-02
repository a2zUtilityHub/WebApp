import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { usePermission } from '@/hooks/usePermission';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AdminHeader from '@/components/admin/AdminHeader'; 
import AdminFooter from '@/components/admin/AdminFooter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminUser } from '@/hooks/useAdminUser';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { adminSignOut } = useAuth();
  const navigate = useNavigate();
  const { isSuperAdmin, adminRole } = useAdminUser();

  // Persist sidebar state
  useEffect(() => {
    const saved = localStorage.getItem('admin_sidebar_collapsed');
    if (saved !== null) setCollapsed(JSON.parse(saved));
  }, []);

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('admin_sidebar_collapsed', JSON.stringify(newState));
  };

  const handleSignOut = async () => {
      await adminSignOut();
      navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-muted/10 flex flex-col md:flex-row w-full overflow-x-hidden">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-slate-900 border-r-slate-800 text-slate-100">
           <div className="flex items-center h-16 px-6 border-b border-white/10">
               <Shield className="h-6 w-6 text-primary mr-2" />
               <span className="font-bold text-lg tracking-tight">A2Z Admin</span>
           </div>
           <AdminNavigation isMobile={true} isCollapsed={false} setIsCollapsed={() => {}} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside 
        className={cn(
            "hidden md:flex flex-col bg-slate-900 border-r border-white/10 text-slate-100 fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out",
            collapsed ? "w-16" : "w-64"
        )}
      >
         <div className={cn("flex items-center h-16 border-b border-white/10", collapsed ? "justify-center" : "px-6")}>
             <Shield className="h-6 w-6 text-primary shrink-0" />
             {!collapsed && <span className="ml-2 font-bold text-lg tracking-tight truncate">A2Z Admin</span>}
         </div>
         
         <div className="flex-1 overflow-hidden hover:overflow-y-auto">
             <AdminNavigation isCollapsed={collapsed} setIsCollapsed={setCollapsed} isMobile={false} />
         </div>

         <div className="p-4 border-t border-white/10 shrink-0">
             <Button variant="ghost" size="sm" onClick={toggleCollapse} className="w-full text-slate-400 hover:text-white">
                {collapsed ? <Menu className="h-4 w-4" /> : "Collapse Sidebar"}
             </Button>
         </div>
      </aside>

      {/* Main Content */}
      <div 
        className={cn(
            "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out w-full",
            collapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
         <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b h-16 px-4 md:px-6 flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                    <Menu className="h-5 w-5" />
                </Button>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="hidden md:block text-sm text-right">
                    <div className="font-medium">Admin User</div>
                    <div className="text-xs text-muted-foreground">{adminRole}</div>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>Sign Out</Button>
            </div>
         </header>

         <main className="flex-1 p-4 md:p-6 lg:p-8 w-full">
             <div className="w-full">
                <Outlet />
             </div>
         </main>
         
         <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;