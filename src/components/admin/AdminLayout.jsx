
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import AdminBreadcrumbs from '@/components/admin/AdminBreadcrumbs';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="flex flex-row h-screen w-full bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Fixed 280px width on left */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex-shrink-0 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 w-[280px] min-w-[280px]",
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:shadow-xl"
        )}
      >
        <AdminSidebar 
          isMobile={isMobile}
          setMobileOpen={setIsMobileMenuOpen}
        />
      </aside>

      {/* Main Content Area - Flex Grow */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 relative z-0">
        <AdminTopBar onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-grow overflow-auto custom-scrollbar">
          <div className="w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
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
