import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { initializeCheckout } from '@/api/EcommerceApi';
import { useToast } from '@/components/ui/use-toast';
import { retryWithBackoff, getUserFriendlyMessage, logDetailedError } from '@/utils/supabaseErrorHandler';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Add some products to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('[ShoppingCart] Initiating checkout...');
      
      const items = cartItems.map(item => ({
        variant_id: item.variant.id,
        quantity: item.quantity,
      }));

      const successUrl = `${window.location.origin}/payment-success`;
      const cancelUrl = window.location.href;

      const { url } = await retryWithBackoff(
        () => initializeCheckout({ items, successUrl, cancelUrl }),
        {
          maxRetries: 3,
          baseDelay: 1000,
          timeout: 30000,
          context: 'ShoppingCart.initializeCheckout'
        }
      );

      console.log('[ShoppingCart] Checkout initialized successfully');
      clearCart();
      window.location.href = url;
      
    } catch (error) {
      logDetailedError('ShoppingCart Checkout', error);
      const friendlyMessage = getUserFriendlyMessage(error);
      
      toast({
        title: 'Checkout Error',
        description: friendlyMessage,
        variant: 'destructive',
      });
    }
  }, [cartItems, clearCart, toast]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] transition-all"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full sm:max-w-md sm:m-4 sm:h-[calc(100vh-32px)] sm:rounded-[2.5rem] bg-background/80 backdrop-blur-2xl shadow-2xl flex flex-col border border-border/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 bg-gradient-to-b from-muted/30 to-transparent border-b border-border/50 shrink-0 z-10 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="h-5 w-5" />
                <h2 className="text-xl font-bold">Shopping Cart ({totalItems})</h2>
              </div>
              <Button
                onClick={() => setIsCartOpen(false)}
                variant="ghost"
                size="icon"
                className="hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Cart Items */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                  <div className="bg-muted p-4 rounded-full mb-4">
                    <ShoppingCartIcon size={32} />
                  </div>
                  <p className="text-lg font-medium">Your cart is empty.</p>
                  <p className="text-sm">Start shopping to add items.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsCartOpen(false)}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div
                    key={item.variant.id}
                    className="flex gap-4 p-4 border border-border/50 rounded-2xl bg-background/60 backdrop-blur-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted/30 shadow-sm relative">
                      <img 
                        src={item.product.image} 
                        alt={item.product.title} 
                        className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    
                    <div className="flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium">
                          <h3 className="line-clamp-1">{item.product.title}</h3>
                          <p className="ml-4 font-bold">
                            {item.variant.sale_price_formatted || item.variant.price_formatted}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.variant.title}</p>
                      </div>
                      
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border rounded-md h-8">
                          <button 
                            type="button" 
                            className="px-2.5 h-full hover:bg-muted transition-colors"
                            onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                          >
                            -
                          </button>
                          <span className="px-2 font-medium min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                            type="button" 
                            className="px-2.5 h-full hover:bg-muted transition-colors"
                            onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.variant.id)}
                          className="font-medium text-destructive hover:text-destructive/80 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-border/50 p-6 md:p-8 bg-background/60 backdrop-blur-xl shrink-0 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary"></div>
                <div className="flex justify-between text-lg font-bold text-foreground mb-2">
                  <p>Subtotal</p>
                  <p className="text-primary">{getCartTotal()}</p>
                </div>
                <p className="mt-1 text-[13px] text-muted-foreground mb-6">
                  Shipping and taxes calculated securely at checkout.
                </p>
                <div className="mt-4">
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-primary-foreground"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-muted-foreground">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="font-medium text-primary hover:text-primary/80"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;