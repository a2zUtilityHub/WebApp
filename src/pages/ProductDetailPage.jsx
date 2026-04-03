
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
      <div className="bg-gray-50 min-h-screen py-12 w-full">
        <div className="w-full px-4">
          <Link to="/store" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-primary mb-6"><ArrowLeft size={16} /> Back</Link>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 grid lg:grid-cols-2 gap-10 mb-8 w-full">
            <ProductImageGallery images={product.images} alt={product.title} />
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-start mb-4 w-full">
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <Button variant="ghost" size="icon" onClick={() => toggleWishlist(product)}>
                  <Heart className={`w-6 h-6 ${isWished ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </Button>
              </div>
              <div className="text-3xl font-bold text-brand-primary mb-8">{price}</div>
              <div className="prose text-gray-600 mb-8" dangerouslySetInnerHTML={{ __html: product.description }} />
              
              <div className="mt-auto space-y-4 bg-gray-50 p-6 rounded-xl border w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Quantity</span>
                  <div className="flex items-center bg-white border rounded-lg p-1">
                    <Button onClick={() => setQuantity(q => Math.max(1, q - 1))} variant="ghost" size="icon" className="h-8 w-8"><Minus size={14}/></Button>
                    <span className="w-12 text-center font-bold">{quantity}</span>
                    <Button onClick={() => setQuantity(q => q + 1)} variant="ghost" size="icon" className="h-8 w-8"><Plus size={14}/></Button>
                  </div>
                </div>
                <Button onClick={handleAddToCart} size="lg" className="w-full h-14 text-lg"><ShoppingCart className="mr-2" /> Add to Cart</Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                <Star className="mr-2 h-4 w-4" /> Write a Review
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
