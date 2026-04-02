import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/HeroSection';
import { ProductCardSkeleton } from '@/components/ui/SkeletonLoader';

const WishlistPage = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet>
        <title>My Wishlist | a2z Utility Hub</title>
        <meta name="description" content="View and manage your favorite products." />
      </Helmet>
      
      <HeroSection 
        title="Your Wishlist"
        subtitle="Products you've saved for later"
      />

      <div className="content-container py-12 min-h-[50vh]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <ProductCardSkeleton key={i} />)}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300 max-w-2xl mx-auto">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-8">Save items you love by clicking the heart icon while shopping.</p>
            <Button asChild size="lg"><Link to="/store"><ShoppingBag className="mr-2 h-5 w-5"/> Browse Store</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const product = item.product_data || {};
              const price = product.variants?.[0]?.sale_price_formatted || product.variants?.[0]?.price_formatted || 'N/A';
              
              return (
                <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                  <Link to={`/product/${product.id}`} className="block relative h-48 bg-gray-100 overflow-hidden group">
                    <img 
                      src={product.image || product.thumbnail || "https://via.placeholder.com/400"} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.title || 'Unknown Product'}</h4>
                    <p className="text-brand-primary font-bold mb-4">{price}</p>
                    
                    <div className="mt-auto flex gap-2">
                      <Button asChild className="flex-1"><Link to={`/product/${product.id}`}>View Details</Link></Button>
                      <Button variant="outline" size="icon" onClick={() => removeFromWishlist(product.id)} className="text-red-500 hover:bg-red-50 hover:text-red-600 border-gray-200">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WishlistPage;