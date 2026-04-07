import React, { useEffect, useRef, useState } from 'react';
import AdSenseVertical from './AdSenseVertical';
import { cn } from '@/lib/utils';

const AdContainer = ({ 
  adSlot, 
  label = "Advertisement", 
  showLabel = true, 
  border = true, 
  shadow = true, 
  rounded = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        'ad-box-container mb-6 p-4',
        border && 'border border-[var(--ad-border)]',
        shadow && 'shadow-[0_1px_3px_rgba(0,0,0,0.1)]',
        rounded && 'rounded-lg'
      )}
    >
      {showLabel && <div className="ad-box-label">{label}</div>}
      <div className="min-h-[250px] w-full flex items-center justify-center relative bg-muted/5 rounded">
        {isVisible ? (
          <AdSenseVertical slot={adSlot} />
        ) : (
          <div className="w-full h-full absolute inset-0 bg-muted/20 animate-pulse rounded" />
        )}
      </div>
    </div>
  );
};

export default AdContainer;