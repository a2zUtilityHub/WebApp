
import React from 'react';
import AdSenseAd from './AdSenseAd';
import { cn } from '@/lib/utils';
import { useAdSense } from '@/contexts/AdSenseProvider';

const AdSenseVertical = ({ className, slot }) => {
  const { shouldShowAds } = useAdSense();
  if (!shouldShowAds) return null;

  return (
    <AdSenseAd 
      className={cn('ad-vertical mx-auto', className)} 
      format="vertical" 
      width={300} 
      height={600} 
      slot={slot} 
    />
  );
};

export default AdSenseVertical;
