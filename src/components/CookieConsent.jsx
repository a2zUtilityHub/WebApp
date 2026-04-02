import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'a2z-cookie-consent';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="container mx-auto max-w-4xl p-6 rounded-lg shadow-2xl bg-card border border-border/60 flex items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <Cookie className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground">We use cookies</p>
                <p className="text-sm text-muted-foreground">
                  Our website uses cookies to enhance your experience. By continuing to browse, you agree to our cookie policy.
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button onClick={handleAccept}>Accept</Button>
              <Button variant="secondary" onClick={handleDecline}>Decline</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;