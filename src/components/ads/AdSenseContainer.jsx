
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAdSense } from '@/contexts/AdSenseProvider';

const AdSenseContainer = ({ children, className, id }) => {
  const { shouldShowAds } = useAdSense();
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!shouldShowAds) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '400px' } // Trigger earlier
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldShowAds]);

  if (!shouldShowAds) {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      id={id}
      className={cn('ad-container w-full flex justify-center py-4 my-4', className)}
      role="complementary"
      aria-label="Advertisement Section"
    >
      {isVisible ? children : (
        <div className="w-full h-full min-h-[90px] bg-muted/10 rounded-xl border border-transparent animate-pulse" />
      )}
    </div>
  );
};

export default AdSenseContainer;
