
import React from 'react';
import { useAdSidebarLayout } from '@/hooks/useAdSidebarLayout';

const AdSidebarLayout = ({ 
  children, 
  leftSidebar, 
  rightSidebar, 
  showLeftAds = true, 
  showRightAds = true, 
  gap = '24px' 
}) => {
  const { isDesktop, showRightAds: mqShowRight, showLeftAds: mqShowLeft } = useAdSidebarLayout();

  const renderLeft = showLeftAds && mqShowLeft && leftSidebar;
  const renderRight = showRightAds && mqShowRight && rightSidebar;

  return (
    <div className="ad-layout-grid max-w-[1600px] mx-auto px-4 lg:px-8" style={{ gap }}>
      {renderLeft && (
        <div className="ad-column-left hidden xl:block">
          {leftSidebar}
        </div>
      )}
      
      <div className="ad-column-main min-w-0 w-full">
        {children}
      </div>
      
      {renderRight && (
        <div className="ad-column-right hidden md:block">
          {rightSidebar}
        </div>
      )}
    </div>
  );
};

export default AdSidebarLayout;
