import React from 'react';
import { motion } from 'framer-motion';

const HeroImage = () => {
  return (
    <motion.section
      className="flex flex-col justify-center items-center text-center py-20 px-4 rounded-lg mb-12"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-accent))',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-white mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Welcome to a2z Utility Hub
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-white/90 max-w-3xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Your one-stop destination for free tools, apps, and the best deals online.
      </motion.p>
      <motion.img
        src="https://images.unsplash.com/photo-1629612459784-38f4ad4bd3c4"
        alt="Collage of utility app icons like QR codes, calculators, and file converters"
        className="rounded-xl shadow-2xl mt-10 w-full max-w-5xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
    </motion.section>
  );
};

export default HeroImage;