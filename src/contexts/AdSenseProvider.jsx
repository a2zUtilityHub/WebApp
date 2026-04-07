import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const AdSenseContext = createContext({
  isAdminRoute: false,
  shouldShowAds: true,
  slotStatuses: {}, 
  registerSlotStatus: () => {},
  isAdLoaded: () => false,
  isAnyAdLoaded: false
});

export const AdSenseProvider = ({ children }) => {
  const location = useLocation();
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [shouldShowAds, setShouldShowAds] = useState(true);
  const [slotStatuses, setSlotStatuses] = useState({});

  useEffect(() => {
    const isRouteAdmin = location.pathname.startsWith('/admin');
    setIsAdminRoute(isRouteAdmin);
    
    const isAuthRoute = location.pathname.startsWith('/auth');
    setShouldShowAds(!isRouteAdmin && !isAuthRoute);
  }, [location.pathname]);

  const registerSlotStatus = useCallback((slot, status) => {
    setSlotStatuses(prev => {
      if (prev[slot] === status) return prev;
      return { ...prev, [slot]: status };
    });
    
    if (status === 'loaded') {
      const event = new CustomEvent('adSenseLoaded', { detail: { slot } });
      window.dispatchEvent(event);
    } else if (status === 'failed') {
      const event = new CustomEvent('adSenseFailed', { detail: { slot } });
      window.dispatchEvent(event);
    }
  }, []);

  const isAdLoaded = useCallback((slot) => {
    return slotStatuses[slot] === 'loaded';
  }, [slotStatuses]);

  const isAnyAdLoaded = Object.values(slotStatuses).some(status => status === 'loaded');

  return (
    <AdSenseContext.Provider value={{ 
      isAdminRoute, 
      shouldShowAds, 
      slotStatuses, 
      registerSlotStatus,
      isAdLoaded,
      isAnyAdLoaded
    }}>
      {children}
    </AdSenseContext.Provider>
  );
};

export const useAdSense = () => useContext(AdSenseContext);

export const useAdSenseLoadStatus = (slot) => {
  const { slotStatuses } = useAdSense();
  return slotStatuses[slot] || 'loading';
};