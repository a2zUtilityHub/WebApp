import React from 'react';
import { Link } from 'react-router-dom';

const BrandLogo = ({ onClick }) => {
  return (
    <Link 
      to="/" 
      onClick={onClick}
      className="flex items-center gap-2 md:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      <div className="flex items-center justify-center shrink-0">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          fill="url(#brandLogoGradient)"
        >
          <defs>
            <linearGradient id="brandLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        </svg>
      </div>
      <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bold tracking-tight bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent whitespace-nowrap font-sans">
        a2z Utility Hub
      </span>
    </Link>
  );
};

export default BrandLogo;