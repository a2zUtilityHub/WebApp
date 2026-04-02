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
          className="fixed inset-0 bg-black/60 z-[60]"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl flex flex-col border-l"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
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
                    className="flex gap-4 p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                      <img 
                        src={item.product.image} 
                        alt={item.product.title} 
                        className="h-full w-full object-cover object-center" 
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
              <div className="border-t p-6 bg-muted/20">
                <div className="flex justify-between text-base font-medium text-foreground mb-4">
                  <p>Subtotal</p>
                  <p>{getCartTotal()}</p>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground mb-4">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="mt-6">
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
                  >
                    Checkout
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