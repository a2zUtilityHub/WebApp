
import React from 'react';
import { cn } from '@/lib/utils';

const SectionHeader = ({ title, subtitle, align = 'left', className }) => {
  return (
    <div 
      className={cn(
        'section-header w-full', 
        align === 'center' ? 'text-center items-center' : 'text-left items-start', 
        className
      )}
    >
      <h2 className="section-title">
        {title}
      </h2>
      {subtitle && (
        <p className="section-subtitle">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
