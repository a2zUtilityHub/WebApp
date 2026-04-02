
import React from 'react';
import AdSenseAd from './AdSenseAd';
import { cn } from '@/lib/utils';
import { useAdSense } from '@/contexts/AdSenseProvider';

const AdSenseResponsive = ({ className, slot }) => {
  const { shouldShowAds } = useAdSense();
  if (!shouldShowAds) return null;

  return (
    <AdSenseAd 
      className={cn('ad-responsive w-full', className)} 
      format="auto" 
      responsive={true} 
      slot={slot} 
    />
  );
};

export default AdSenseResponsive;
