import React from 'react';
import { motion } from 'framer-motion';

const CallToAction = () => {
  return (
    <motion.p
      className='text-lg text-muted-foreground max-w-2xl mx-auto'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      Your one-stop destination for free tools, apps, and the best deals online.
    </motion.p>
  );
};

export default CallToAction;