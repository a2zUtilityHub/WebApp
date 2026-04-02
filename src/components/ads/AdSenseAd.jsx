
import React from 'react';
import { cn } from '@/lib/utils';

const AdSenseAd = ({ className, format, width, height, slot, style, responsive }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-muted/30 border-2 border-dashed border-border/60 rounded-xl overflow-hidden relative',
        className
      )}
      style={{
        width: responsive ? '100%' : width ? `${width}px` : '100%',
        height: responsive ? 'auto' : height ? `${height}px` : 'auto',
        minHeight: responsive ? '120px' : height ? `${height}px` : '90px',
        ...style
      }}
    >
      <span className="text-[10px] text-muted-foreground absolute top-2 left-3 uppercase tracking-widest font-bold bg-background/80 px-2 py-0.5 rounded shadow-sm">
        Advertisement
      </span>
      <div className="text-muted-foreground/60 font-medium text-sm mt-4 flex items-center gap-2">
        <span>Ad Slot:</span>
        <span className="font-mono text-primary/60 bg-primary/5 px-2 py-1 rounded-md">{slot}</span>
      </div>
      {format && (
        <div className="text-muted-foreground/40 text-xs mt-1">Format: {format}</div>
      )}
    </div>
  );
};

export default AdSenseAd;
