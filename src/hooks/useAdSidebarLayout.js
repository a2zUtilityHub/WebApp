
import { useState, useEffect } from 'react';

export function useAdSidebarLayout() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Initial check
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1200;
  const isDesktop = windowWidth >= 1200;

  return {
    isMobile,
    isTablet,
    isDesktop,
    showLeftAds: isDesktop,
    showRightAds: isDesktop || isTablet,
    stickyOffset: 80,
  };
}
