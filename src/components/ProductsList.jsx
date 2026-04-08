import React, { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, AlertCircle, RefreshCw, ShoppingBag, WifiOff, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/components/ui/use-toast';
import { getProducts, getProductQuantities } from '@/api/EcommerceApi';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { retryWithBackoff, isOnline, getUserFriendlyMessage, logDetailedError } from '@/utils/supabaseErrorHandler';
import { ProductCardSkeleton } from '@/components/ui/SkeletonLoader';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isWished = isInWishlist(product.id);
  const displayVariant = product.variants?.[0];
  const hasSale = displayVariant && displayVariant.sale_price_in_cents !== null;
  const displayPrice = hasSale ? displayVariant.sale_price_formatted : displayVariant?.price_formatted;
  const originalPrice = hasSale ? displayVariant.price_formatted : null;

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.variants || product.variants.length === 0) {
      toast({ title: "Unavailable", description: "Product is currently unavailable.", variant: "destructive" });
      return;
    }

    if (product.variants.length > 1) {
      navigate(`/product/${product.id}`);
      return;
    }

    const defaultVariant = product.variants[0];
    try {
      await addToCart(product, defaultVariant, 1, defaultVariant.inventory_quantity);
      toast({ title: "Added to Cart! 🛒", description: `${product.title} has been added to your cart.` });
    } catch (error) {
      toast({ title: "Error adding to cart", description: error.message, variant: "destructive" });
    }
  }, [product, addToCart, toast, navigate]);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="h-full"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 hover:border-primary/50 h-full flex flex-col relative">
          
          <button 
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-background/80 backdrop-blur-md hover:bg-background border border-border/50 shadow-sm transition-all duration-300 hover:scale-110"
          >
            <Heart className={`w-5 h-5 transition-colors ${isWished ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`} />
          </button>

          <div className="relative overflow-hidden bg-muted/20">
            <img
              src={product.image || placeholderImage}
              alt={product.title}
              className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {product.ribbon_text && (
              <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow-md border border-primary-foreground/20">
                {product.ribbon_text}
              </div>
            )}
          </div>
          
          <div className="p-5 flex-grow flex flex-col bg-gradient-to-b from-transparent to-muted/10 relative">
            <div className="mb-2 relative z-10">
              <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300">{product.title}</h3>
              <p className="text-[14px] text-muted-foreground/80 line-clamp-2 mt-1.5 min-h-[40px] leading-relaxed">
                {product.subtitle || product.description?.replace(/<[^>]*>?/gm, '') || 'Check out this amazing product!'}
              </p>
            </div>
            
            <div className="mt-auto pt-5 flex items-center justify-between relative z-10 border-t border-border/50">
              <div className="flex flex-col">
                {hasSale && <span className="line-through text-muted-foreground/60 text-xs font-medium">{originalPrice}</span>}
                <span className="font-extrabold text-xl text-primary">{displayPrice}</span>
              </div>
              <Button onClick={handleAddToCart} size="icon" className="rounded-xl w-11 h-11 shadow-sm bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProductsList = ({ products: externalProducts }) => {
  const [internalProducts, setInternalProducts] = useState([]);
  const [loading, setLoading] = useState(!externalProducts);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  const fetchProductsWithQuantities = useCallback(async () => {
    if (externalProducts) {
      setLoading(false);
      return;
    }
    
    if (!isOnline()) {
      setIsOffline(true);
      setError("You appear to be offline. Please check your internet connection.");
      setLoading(false);
      return;
    }
    
    setIsOffline(false);
    setLoading(true);
    setError(null);

    try {
      const productsResponse = await retryWithBackoff(() => getProducts(), { maxRetries: 3, baseDelay: 1000, timeout: 30000 });

      if (!productsResponse?.products?.length) {
        setInternalProducts([]);
        setLoading(false);
        return;
      }

      const productIds = productsResponse.products.map(product => product.id);
      let quantitiesResponse = { variants: [] };
      
      try {
        quantitiesResponse = await retryWithBackoff(() => getProductQuantities({ fields: 'inventory_quantity', product_ids: productIds }), { maxRetries: 2, baseDelay: 1000, timeout: 20000 });
      } catch (qErr) {
        console.warn("Proceeding with default inventory data.");
      }

      const variantQuantityMap = new Map();
      if (quantitiesResponse?.variants) {
        quantitiesResponse.variants.forEach(v => variantQuantityMap.set(v.id, v.inventory_quantity));
      }

      const productsWithQuantities = productsResponse.products.map(product => ({
        ...product,
        variants: (product.variants || []).map(variant => ({
          ...variant,
          inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
        }))
      }));

      setInternalProducts(productsWithQuantities);
    } catch (err) {
      const friendlyMessage = getUserFriendlyMessage(err);
      setError(friendlyMessage);
      toast({ title: 'Failed to load products', description: friendlyMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [externalProducts, toast]);

  useEffect(() => {
    fetchProductsWithQuantities();
  }, [fetchProductsWithQuantities]);

  const displayProducts = externalProducts || internalProducts;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  if (error || isOffline) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-8">
        {isOffline ? <WifiOff className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
        <AlertTitle>{isOffline ? "Connection Lost" : "Store Unavailable"}</AlertTitle>
        <AlertDescription className="mt-2">
          {error}
          <Button variant="outline" size="sm" onClick={fetchProductsWithQuantities} className="mt-4 block">
            <RefreshCw className="h-4 w-4 mr-2 inline" /> Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <div className="text-center py-16 px-4 border border-dashed rounded-xl bg-gray-50">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-gray-500 max-w-md mx-auto">We're currently updating our inventory. Please check back later!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayProducts.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductsList;