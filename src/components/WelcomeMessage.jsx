import React from 'react';
import { motion } from 'framer-motion';

const WelcomeMessage = () => {
  return (
    <motion.h1
      className='text-3xl md:text-5xl font-bold max-w-4xl mx-auto'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      Welcome to <span className='text-primary'>a2z utility hub</span>
    </motion.h1>
  );
};

export default WelcomeMessage;