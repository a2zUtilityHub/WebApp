
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const AppTabsLayout = ({ tabsConfig }) => {
  const [activeTab, setActiveTab] = useState(tabsConfig[0]?.id);

  if (!tabsConfig || tabsConfig.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 mb-24">
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {tabsConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-2 rounded-full shadow-sm border transition-all duration-300 text-sm font-medium",
              activeTab === tab.id
                ? "bg-teal-50 border-teal-400 text-teal-800 scale-105"
                : "bg-white border-gray-200 text-gray-700 hover:text-teal-600 hover:border-teal-300 hover:bg-gray-50"
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
