import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import AdminBreadcrumbs from './AdminBreadcrumbs';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Handle responsive design and resizing
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint in tailwind
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };
    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="flex h-screen w-full bg-[hsl(var(--admin-bg))] text-[hsl(var(--admin-text))] overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Fixed width on desktop, sliding on mobile */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-[60] w-[260px] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 bg-[hsl(var(--admin-sidebar-bg))] border-r border-[hsl(var(--admin-border))] flex flex-col h-full shadow-2xl lg:shadow-none",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AdminSidebar 
          isMobile={isMobile}
          setMobileOpen={setIsMobileMenuOpen}
        />
      </aside>

      {/* Main Content Area - Flex Grow */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <AdminTopBar onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[hsl(var(--admin-bg))]">
          <div className="w-full mx-auto p-[10px]">
            <AdminBreadcrumbs />
            
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full pb-12"
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;