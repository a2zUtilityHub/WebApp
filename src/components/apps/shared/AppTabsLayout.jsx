import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const AppTabsLayout = ({ tabsConfig }) => {
  const [activeTab, setActiveTab] = useState(tabsConfig[0]?.id);

  if (!tabsConfig || tabsConfig.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 mb-24">
      <div className="flex flex-wrap justify-center gap-3 mb-10 relative z-20">
        {tabsConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-2.5 rounded-full shadow-sm border transition-all duration-300 text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
              activeTab === tab.id
                ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-transparent scale-105 shadow-md"
                : "bg-background/60 backdrop-blur-md border-border/50 text-muted-foreground/90 hover:text-foreground hover:border-primary/50 hover:bg-background/80 hover:-translate-y-0.5"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="relative w-full">
        <AnimatePresence mode="wait">
          {tabsConfig.map((tab) => (
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                {tab.content}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};