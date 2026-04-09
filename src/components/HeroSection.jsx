import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = ({ title, subtitle, ctaButtons }) => {
  return (
    <section 
      className="w-full flex flex-col justify-center items-center text-center overflow-hidden relative min-h-[200px] md:min-h-[240px] lg:min-h-[320px] py-8 md:py-12 lg:py-16"
      style={{ background: 'linear-gradient(135deg, #0EA5E9, #7C3AED, #EC4899)' }}
    >
      <div 
        className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: "easeOut" }} 
        className="w-full max-w-[1200px] mx-auto px-4 relative z-10"
      >
        <h1 className="text-white font-bold text-[32px] md:text-[40px] lg:text-[48px] leading-tight mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white font-medium text-[14px] md:text-[16px] lg:text-[18px] max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] mb-8">
            {subtitle}
          </p>
        )}
        {ctaButtons && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto mt-4">
            {ctaButtons}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default HeroSection;