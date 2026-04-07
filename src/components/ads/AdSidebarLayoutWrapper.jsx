import React, { useState } from 'react';
import { useAdSense } from '@/contexts/AdSenseProvider';
import AdSidebarLayout from './AdSidebarLayout';
import AdSidebar from './AdSidebar';
import AdSenseVertical from './AdSenseVertical';

const AdSidebarLayoutWrapper = ({ 
  children, 
  leftAdSlots = ['sidebar_left_1', 'sidebar_left_2'], 
  rightAdSlots = ['sidebar_right_1', 'sidebar_right_2'], 
  stickyOffset = 80, 
  gap = '24px' 
}) => {
  const { shouldShowAds } = useAdSense();
  
  const [leftActive, setLeftActive] = useState(true);
  const [rightActive, setRightActive] = useState(true);

  if (!shouldShowAds) {
    return <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full">{children}</div>;
  }

  // If one fails, we can just hide that particular slot or the whole sidebar. 
  // Let's rely on the child components to return null, and the AdSidebar container will shrink naturally.
  // However, we can also conditionally render based on failure state.
  
  const handleLeftFail = () => setLeftActive(false);
  const handleRightFail = () => setRightActive(false);

  const leftSidebar = leftActive ? (
    <AdSidebar position="left" stickyOffset={stickyOffset}>
      {leftAdSlots.map((slot, index) => (
        <AdSenseVertical key={`${slot}-${index}`} slot={slot} onAdFailed={handleLeftFail} />
      ))}
    </AdSidebar>
  ) : null;

  const rightSidebar = rightActive ? (
    <AdSidebar position="right" stickyOffset={stickyOffset}>
      {rightAdSlots.map((slot, index) => (
        <AdSenseVertical key={`${slot}-${index}`} slot={slot} onAdFailed={handleRightFail} />
      ))}
    </AdSidebar>
  ) : null;

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