import React from 'react';
import AdSenseAd from './AdSenseAd';
import { cn } from '@/lib/utils';
import { useAdSense, useAdSenseLoadStatus } from '@/contexts/AdSenseProvider';

const AdSenseResponsive = ({ className, slot, layoutKey }) => {
  const { shouldShowAds } = useAdSense();
  const status = useAdSenseLoadStatus(slot);

  if (!shouldShowAds || status === 'failed') return null;

  return (
    <AdSenseAd 
      className={cn('ad-responsive w-full', className)} 
      format="auto" 
      responsive={true} 
      slot={slot} 
      layoutKey={layoutKey}
    />
  );
};

export default AdSenseResponsive;