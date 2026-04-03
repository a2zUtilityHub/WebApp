
import React from 'react';
import AdSenseAd from './AdSenseAd';
import { cn } from '@/lib/utils';
import { useAdSense, useAdSenseLoadStatus } from '@/contexts/AdSenseProvider';

const AdSenseHorizontal = ({ className, slot }) => {
  const { shouldShowAds } = useAdSense();
  const status = useAdSenseLoadStatus(slot);
  
  if (!shouldShowAds || status === 'failed') return null;

  return (
    <AdSenseAd 
      className={cn('ad-horizontal w-full max-w-[728px] mx-auto', className)} 
      format="horizontal" 
      width={728} 
      height={90} 
      slot={slot}
    />
  );
};

export default AdSenseHorizontal;
