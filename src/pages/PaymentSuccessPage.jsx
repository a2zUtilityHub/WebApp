import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import confetti from 'canvas-confetti';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Fire confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Payment Successful - a2z Utility Hub</title>
        <meta name="description" content="Your payment was successful. Thank you for your purchase!" />
      </Helmet>

      <div className="full-width-container min-h-[80vh] flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="text-center">
            <CardHeader className="pt-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1 
                }}
                className="flex justify-center mb-6"
              >
                <div className="bg-green-100 rounded-full p-6">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
              </motion.div>
              <h1 className="text-3xl font-bold">Payment Successful!</h1>
            </CardHeader>

            <CardContent className="pb-8">
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for your purchase. Your order has been confirmed and will be processed shortly.
              </p>
              <p className="text-sm text-muted-foreground">
                You will receive an order confirmation email with details of your purchase.
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pb-8">
              <Button asChild className="w-full" size="lg">
                <Link to="/store">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Continue Shopping
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link to="/">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default PaymentSuccessPage;