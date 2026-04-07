import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAdSense } from '@/contexts/AdSenseProvider';

const AdSenseContainer = ({ children, className, id }) => {
  const { shouldShowAds, slotStatuses } = useAdSense();
  const containerRef = useRef(null);
  
  const [isVisible, setIsVisible] = useState(false);

  // Extract slots from children to check their load status
  const childSlots = React.Children.toArray(children)
    .filter(child => React.isValidElement(child) && child.props.slot)
    .map(child => child.props.slot);

  const anySlotLoaded = childSlots.some(slot => slotStatuses[slot] === 'loaded');
  const allSlotsFailed = childSlots.length > 0 && childSlots.every(slot => slotStatuses[slot] === 'failed');

  useEffect(() => {
    if (!shouldShowAds) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '400px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldShowAds]);

  if (!shouldShowAds || allSlotsFailed) {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      id={id}
      className={cn(
        'w-full flex flex-col justify-center items-center transition-all duration-500',
        anySlotLoaded ? 'py-4 my-4 opacity-100' : 'h-0 opacity-0 overflow-hidden my-0 py-0',
        className
      )}
      role="complementary"
      aria-label="Advertisement Section"
    >
      {anySlotLoaded && (
        <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-t-md border border-b-0 border-border">
          Advertisement
        </span>
      )}
      {isVisible && (
        <div className={cn(
          'w-full flex justify-center items-center',
          anySlotLoaded ? 'ad-wrapper p-2' : ''
        )}>
          {children}
        </div>
      )}
    </div>
  );
};

export default AdSenseContainer;