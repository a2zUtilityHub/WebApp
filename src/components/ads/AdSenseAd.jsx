import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useAdSense } from '@/contexts/AdSenseProvider';

const AdSenseAd = ({ className, format, width, height, slot, style, responsive, layoutKey }) => {
  const adRef = useRef(null);
  const { registerSlotStatus, slotStatuses } = useAdSense();
  const status = slotStatuses[slot] || 'loading';

  useEffect(() => {
    let checkInterval;
    let isMounted = true;

    // Register initial loading state
    registerSlotStatus(slot, 'loading');

    try {
      if (typeof window !== 'undefined' && adRef.current) {
        if (!adRef.current.hasAttribute('data-adsbygoogle-status')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }

        checkInterval = setInterval(() => {
          if (!isMounted || !adRef.current) return;
          
          const adStatus = adRef.current.getAttribute('data-ad-status');
          if (adStatus === 'filled') {
            registerSlotStatus(slot, 'loaded');
            clearInterval(checkInterval);
          } else if (adStatus === 'unfilled') {
            registerSlotStatus(slot, 'failed');
            clearInterval(checkInterval);
          }
        }, 500);
      }
    } catch (e) {
      console.error('[AdSense] Initialization error:', e);
      registerSlotStatus(slot, 'failed');
    }

    const failTimeout = setTimeout(() => {
      if (isMounted && slotStatuses[slot] !== 'loaded') {
        registerSlotStatus(slot, 'failed');
        clearInterval(checkInterval);
      }
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(checkInterval);
      clearTimeout(failTimeout);
    };
  }, [slot, registerSlotStatus]);

  // Always render the <ins> tag so AdSense can attempt to fill it, 
  // but hide it visually if it hasn't loaded to prevent empty containers.
  return (
    <div
      className={cn(
        'transition-all duration-500 min-h-[100px] w-full flex items-center justify-center',
        status === 'failed' ? 'hidden' : 'opacity-100',
        status === 'loading' ? 'bg-muted/20 animate-pulse rounded-lg' : '',
        className
      )}
      style={{
        ...style
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle w-full"
        style={{ display: 'block', width: responsive ? '100%' : width, height: responsive ? 'auto' : height }}
        data-ad-client="ca-pub-9198321800783167"
        data-ad-slot={slot}
        data-ad-format={format || (responsive ? 'auto' : undefined)}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        data-ad-layout-key={layoutKey}
      />
    </div>
  );
};

export default AdSenseAd;