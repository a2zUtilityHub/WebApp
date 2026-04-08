import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = ({ title, subtitle, ctaButtons }) => {
  return (
    <section 
      className="w-full flex flex-col justify-center items-center text-center overflow-hidden relative min-h-[200px] md:min-h-[240px] lg:min-h-[320px] py-16 md:py-24 lg:py-32 bg-background border-b border-border/50"
    >
      {/* Dynamic Animated Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[150%] bg-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
         <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-primary/5 rounded-t-full blur-[100px]"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: "easeOut" }} 
        className="w-full max-w-[1200px] mx-auto px-4 relative z-10"
      >
        <h1 className="text-foreground font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
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