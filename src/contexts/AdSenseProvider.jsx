
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AdSenseContext = createContext({
  isAdminRoute: false,
  shouldShowAds: true,
});

export const AdSenseProvider = ({ children }) => {
  const location = useLocation();
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [shouldShowAds, setShouldShowAds] = useState(true);

  useEffect(() => {
    const isRouteAdmin = location.pathname.startsWith('/admin');
    setIsAdminRoute(isRouteAdmin);
    
    // Logic to determine if ads should be shown based on route or user preferences
    // For now, we hide them on admin routes and auth routes
    const isAuthRoute = location.pathname.startsWith('/auth');
    setShouldShowAds(!isRouteAdmin && !isAuthRoute);
  }, [location.pathname]);

  return (
    <AdSenseContext.Provider value={{ isAdminRoute, shouldShowAds }}>
      {children}
    </AdSenseContext.Provider>
  );
};

export const useAdSense = () => useContext(AdSenseContext);
