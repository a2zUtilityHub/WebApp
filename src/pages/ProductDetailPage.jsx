import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProduct, getProductQuantities } from '@/api/EcommerceApi';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, ArrowLeft, CheckCircle, Minus, Plus, XCircle, Heart, Star } from 'lucide-react';
import ProductImageGallery from '@/components/ProductImageGallery';
import ReviewsList from '@/components/ReviewsList';
import ReviewForm from '@/components/ReviewForm';
import { ProductDetailSkeleton } from '@/components/ui/SkeletonLoader';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = useCallback(async () => {
    if (product && selectedVariant) {
      await addToCart(product, selectedVariant, quantity, selectedVariant.inventory_quantity);
      toast({ title: "Added to Cart!", description: `${quantity} x ${product.title} added.` });
    }
  }, [product, selectedVariant, quantity, addToCart, toast]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await getProduct(id);
        const qRes = await getProductQuantities({ fields: 'inventory_quantity', product_ids: [fetchedProduct.id] });
        const qMap = new Map();
        qRes.variants.forEach(v => qMap.set(v.id, v.inventory_quantity));
        const pWithQ = { ...fetchedProduct, variants: fetchedProduct.variants.map(v => ({ ...v, inventory_quantity: qMap.get(v.id) ?? v.inventory_quantity })) };
        setProduct(pWithQ);
        if (pWithQ.variants?.length > 0) setSelectedVariant(pWithQ.variants[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;
  if (error || !product) return <div className="text-center p-8 w-full"><p className="text-red-500 mb-4">{error}</p></div>;

  const price = selectedVariant?.sale_price_formatted ?? selectedVariant?.price_formatted;
  const isWished = isInWishlist(product.id);

  return (
    <>
      <Helmet><title>{product.title} - Our Store</title></Helmet>
      <div className="bg-background min-h-screen py-12 w-full relative overflow-hidden">
        {/* Soft Background Orbs */}
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <Link to="/store" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-medium bg-background/60 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm w-fit"><ArrowLeft size={16} /> Back to Store</Link>
          
          <div className="bg-background/60 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] shadow-xl p-6 md:p-12 grid lg:grid-cols-2 gap-12 mb-12 w-full relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/40 to-primary"></div>
            
            <div className="rounded-3xl overflow-hidden border border-border/50 shadow-sm bg-muted/10">
               <ProductImageGallery images={product.images} alt={product.title} />
            </div>
            
            <div className="flex flex-col w-full h-full">
              <div className="flex justify-between items-start mb-4 w-full">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">{product.title}</h1>
                <Button variant="outline" size="icon" onClick={() => toggleWishlist(product)} className="rounded-full h-12 w-12 border-border/50 shadow-sm shrink-0 ml-4 hover:border-red-500/50 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all">
                  <Heart className={`w-6 h-6 transition-colors ${isWished ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                </Button>
              </div>
              
              <div className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary/10 text-primary w-fit mb-8 border border-primary/20 shadow-sm">
                 <span className="text-3xl font-black">{price}</span>
              </div>
              
              <div className="prose prose-lg max-w-none text-foreground/80 dark:prose-invert mb-10 leading-relaxed border-t border-border/50 pt-8" dangerouslySetInnerHTML={{ __html: product.description }} />
              
              <div className="mt-auto space-y-5 bg-muted/30 backdrop-blur-md p-8 rounded-3xl border border-border/50 w-full shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="font-semibold text-lg text-foreground">Quantity</span>
                  <div className="flex items-center bg-background border border-border/50 rounded-2xl p-1 shadow-sm">
                    <Button onClick={() => setQuantity(q => Math.max(1, q - 1))} variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted"><Minus size={16}/></Button>
                    <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                    <Button onClick={() => setQuantity(q => q + 1)} variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted"><Plus size={16}/></Button>
                  </div>
                </div>
                <Button onClick={handleAddToCart} size="lg" className="w-full h-16 text-lg rounded-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-primary-foreground font-bold">
                   <ShoppingCart className="mr-3 h-6 w-6" /> Add to Cart — {price}
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-[2.5rem] shadow-lg p-6 md:p-12 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-border/50 pb-6">
              <div>
                 <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Customer Reviews</h2>
                 <p className="text-muted-foreground mt-2">See what others are saying about this product.</p>
              </div>
              <Button onClick={() => setShowReviewForm(!showReviewForm)} className="rounded-xl h-12 px-6 shadow-sm border border-border/50" variant={showReviewForm ? "secondary" : "default"}>
                {showReviewForm ? <><XCircle className="mr-2 h-5 w-5" /> Cancel Review</> : <><Star className="mr-2 h-5 w-5" /> Write a Review</>}
              </Button>
            </div>
            {showReviewForm && (
              <div className="mb-8 w-full">
                <ReviewForm productId={product.id} onSuccess={() => setShowReviewForm(false)} />
              </div>
            )}
            <div className="w-full">
               <ReviewsList productId={product.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;