import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppWindow, BookOpen, Tag, ShoppingBag, ArrowRight, Flame, Star, Clock, Image as ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const LazyImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && imgRef.current) {
        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoaded(true);
        img.onerror = () => setError(true);
        observer.disconnect();
      }
    }, { rootMargin: '50px' });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <ImageIcon className="h-8 w-8 opacity-50" />
        </div>
      )}
      <img
        src={isLoaded ? src : ''}
        alt={alt || "Item image"}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
      />
    </div>
  );
};

const ItemCard = React.forwardRef(({ item, type, isTop }, ref) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'apps': return { icon: AppWindow, label: 'App', color: 'bg-blue-100 text-blue-700', link: `/apps/${item.slug}` };
      case 'blogs': return { icon: BookOpen, label: 'Blog', color: 'bg-green-100 text-green-700', link: `/blogs/${item.slug}` };
      case 'deals': return { icon: ShoppingBag, label: 'Deal', color: 'bg-purple-100 text-purple-700', link: `/popular-deals` };
      case 'coupons': return { icon: Tag, label: 'Coupon', color: 'bg-orange-100 text-orange-700', link: `/coupons` };
      default: return { icon: Star, label: 'Item', color: 'bg-gray-100 text-gray-700', link: '#' };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;
  
  const title = item.name || item.title || 'Untitled';
  const description = item.description || item.meta_description || item.content?.substring(0, 100) || '';
  const image = item.icon || item.og_image_url || item.image_url || null;

  return (
    <motion.div
      ref={ref}
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className={`h-full flex flex-col overflow-hidden bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-brand-primary/50 transition-all group relative ${isTop ? 'border-brand-primary/30 bg-gradient-to-b from-brand-primary/5 to-transparent' : ''}`}>
        
        {isTop && (
          <div className="absolute top-0 right-0 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10 flex items-center">
            <Flame className="w-3 h-3 mr-1" /> Top Choice
          </div>
        )}

        <div className="p-4 pb-0">
          {image ? (
            <LazyImage src={image} alt={title} className="w-full h-40 rounded-xl mb-4" />
          ) : (
            <div className="w-full h-32 rounded-xl mb-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
              <Icon className="h-12 w-12 text-gray-300 dark:text-gray-600" />
            </div>
          )}
        </div>

        <CardHeader className="p-5 pt-2 pb-2">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className={`${config.color} border-none shadow-none`}>
              <Icon className="w-3 h-3 mr-1" /> {config.label}
            </Badge>
            {item.click_count > 0 && (
               <span className="text-xs font-semibold text-gray-500 flex items-center">
                 <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" /> {item.click_count} uses
               </span>
            )}
          </div>
          <CardTitle className="text-lg leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
            <Link to={config.link} className="after:absolute after:inset-0">
              {title}
            </Link>
          </CardTitle>
          
          {(type === 'deals' || type === 'coupons') && item.discount_value && (
            <div className="text-xl font-bold text-green-600 mt-1">{item.discount_value} OFF</div>
          )}
        </CardHeader>

        <CardContent className="p-5 pt-0 flex-grow">
          <CardDescription className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {description.replace(/<[^>]*>?/gm, '')}
          </CardDescription>
          
          {item.expires_at && (
             <div className="mt-4 flex items-center text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1.5 rounded-md w-fit">
               <Clock className="h-3.5 w-3.5 mr-1.5" />
               Expires {formatDistanceToNow(new Date(item.expires_at), { addSuffix: true })}
             </div>
          )}
        </CardContent>

        <CardFooter className="p-5 pt-0 mt-auto border-t border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30">
          <span className="text-sm font-semibold text-brand-primary group-hover:text-brand-primary-dark transition-colors flex items-center">
             View {config.label} Details
             <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </span>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

ItemCard.displayName = 'ItemCard';

export default ItemCard;