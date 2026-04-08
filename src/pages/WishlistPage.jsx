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

      <div className="content-container py-16 min-h-[60vh] relative overflow-hidden">
        {/* Soft Glowing Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
        
        <div className="relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <ProductCardSkeleton key={i} />)}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-24 px-8 bg-background/60 backdrop-blur-xl rounded-[2.5rem] border border-border/50 shadow-sm max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 p-16 opacity-5 bg-gradient-to-bl from-primary to-transparent rounded-bl-full z-0 w-48 h-48"></div>
            <div className="mx-auto w-24 h-24 bg-muted/50 border border-border/50 shadow-sm rounded-full flex items-center justify-center mb-6 relative z-10">
              <Heart className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-3xl font-extrabold text-foreground mb-3 relative z-10">Your wishlist is empty</h3>
            <p className="text-muted-foreground text-lg mb-10 relative z-10">Save items you love by clicking the heart icon while shopping.</p>
            <Button asChild size="lg" className="h-14 px-8 rounded-2xl text-lg font-bold shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative z-10 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"><Link to="/store"><ShoppingBag className="mr-2 h-5 w-5"/> Browse Store</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const product = item.product_data || {};
              const price = product.variants?.[0]?.sale_price_formatted || product.variants?.[0]?.price_formatted || 'N/A';
              
              return (
                <div key={item.id} className="bg-background/60 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 transition-all duration-500 relative flex flex-col group">
                  <Link to={`/product/${product.id}`} className="block relative h-48 bg-muted/20 overflow-hidden">
                    <img 
                      src={product.image || product.thumbnail || "https://via.placeholder.com/400"} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-transparent to-muted/10 relative z-10">
                    <h4 className="font-bold text-foreground mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">{product.title || 'Unknown Product'}</h4>
                    <p className="text-primary font-extrabold text-lg mb-5">{price}</p>
                    
                    <div className="mt-auto flex gap-3 pt-4 border-t border-border/50">
                      <Button asChild className="flex-1 rounded-xl shadow-sm hover:shadow-md transition-shadow font-semibold"><Link to={`/product/${product.id}`}>View Details</Link></Button>
                      <Button variant="outline" size="icon" onClick={() => removeFromWishlist(product.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-border/50 rounded-xl transition-colors shrink-0">
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
      </div>
    </motion.div>
  );
};

export default WishlistPage;