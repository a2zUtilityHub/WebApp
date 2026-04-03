
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/SectionHeader';
import { format } from 'date-fns';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('status', 'active')
          .limit(6);
          
        if (!error && data && data.length > 0) {
          setReviews(data);
        } else {
          // Fallback static data if no active testimonials exist
          setReviews([
            { id: 1, user_name: 'Sarah Jenkins', rating: 5, review_text: 'This platform completely changed how I organize my daily tasks. Highly recommended!', created_at: new Date().toISOString() },
            { id: 2, user_name: 'David Chen', rating: 4, review_text: 'Great deals and an intuitive interface. The coupons save me a ton of money.', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
            { id: 3, user_name: 'Emily Parker', rating: 5, review_text: 'An all-in-one utility hub that actually delivers on its promises. Flawless experience.', created_at: new Date(Date.now() - 86400000 * 5).toISOString() }
          ]);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      }
    };
    fetchReviews();
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="w-full mb-16">
      <SectionHeader 
        title="Customer Reviews" 
        subtitle="See what our amazing community has to say about their experiences." 
        align="left" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {reviews.map((review, i) => (
          <motion.div 
            key={review.id} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-50px" }} 
            transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
            className="h-full"
          >
            <Card className="h-full bg-card hover:shadow-lg transition-shadow duration-300 border-border/50">
              <CardContent className="p-6 flex flex-col h-full relative">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12 border border-primary/10">
                    <AvatarImage src={review.user_avatar_url} />
                    <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                      {review.user_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-foreground">{review.user_name}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, idx) => (
                          <Star 
                            key={idx} 
                            className={`w-3.5 h-3.5 ${idx < review.rating ? 'fill-current' : 'text-muted stroke-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                      {review.created_at && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(review.created_at), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground flex-grow italic text-sm md:text-base">
                  "{review.review_text}"
                </p>
                
                {review.is_featured && (
                  <Badge variant="secondary" className="absolute top-4 right-4 bg-brand-primary/10 text-brand-primary border-none">
                    Featured
                  </Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CustomerReviews;
