
import React from 'react';
import { useAdSense } from '@/contexts/AdSenseProvider';
import AdSidebarLayout from './AdSidebarLayout';
import AdSidebar from './AdSidebar';
import AdContainer from './AdContainer';

const AdSidebarLayoutWrapper = ({ 
  children, 
  leftAdSlots = ['sidebar_left_1', 'sidebar_left_2'], 
  rightAdSlots = ['sidebar_right_1', 'sidebar_right_2'], 
  stickyOffset = 80, 
  gap = '24px' 
}) => {
  const { shouldShowAds } = useAdSense();

  if (!shouldShowAds) {
    return <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full">{children}</div>;
  }

  const leftSidebar = (
    <AdSidebar position="left" stickyOffset={stickyOffset}>
      {leftAdSlots.map((slot, index) => (
        <AdContainer key={`${slot}-${index}`} adSlot={slot} />
      ))}
    </AdSidebar>
  );

  const rightSidebar = (
    <AdSidebar position="right" stickyOffset={stickyOffset}>
      {rightAdSlots.map((slot, index) => (
        <AdContainer key={`${slot}-${index}`} adSlot={slot} />
      ))}
    </AdSidebar>
  );

  return (
    <AdSidebarLayout 
      leftSidebar={leftSidebar} 
      rightSidebar={rightSidebar} 
      gap={gap}
    >
      {children}
    </AdSidebarLayout>
  );
};

export default AdSidebarLayoutWrapper;
