import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryHeroSection = ({ categoryInfo, loading }) => {
  if (loading) {
    return (
      <section className="w-full flex flex-col justify-center items-center text-center overflow-hidden relative min-h-[200px] md:min-h-[240px] py-8 md:py-12 bg-gray-100 dark:bg-gray-800">
        <div className="w-full max-w-[1200px] mx-auto px-4 flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-3/4 max-w-md bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-6 w-full max-w-2xl bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-6 w-2/3 max-w-xl bg-gray-200 dark:bg-gray-700" />
        </div>
      </section>
    );
  }

  if (!categoryInfo) return null;

  return (
    <section 
      className="w-full flex flex-col justify-center items-center text-center overflow-hidden relative min-h-[200px] md:min-h-[240px] lg:min-h-[320px] py-8 md:py-12 lg:py-16"
      style={{ background: 'linear-gradient(135deg, #0EA5E9, #7C3AED, #EC4899)' }}
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: "easeOut" }} 
        className="w-full max-w-[1200px] mx-auto px-4 relative z-10 flex flex-col items-center"
      >
        {categoryInfo.icon_url && (
          <div className="mb-6 p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/30">
            <img 
              src={categoryInfo.icon_url} 
              alt={`${categoryInfo.name} icon`} 
              className="w-16 h-16 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
        
        <h1 className="text-white font-bold text-[32px] md:text-[40px] lg:text-[48px] leading-tight mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          {categoryInfo.name}
        </h1>
        
        {categoryInfo.description && (
          <p className="text-white font-medium text-[14px] md:text-[16px] lg:text-[18px] max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] mb-8">
            {categoryInfo.description}
          </p>
        )}
      </motion.div>
    </section>
  );
};

export default CategoryHeroSection;