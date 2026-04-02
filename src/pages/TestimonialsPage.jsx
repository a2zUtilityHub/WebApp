import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Breadcrumbs from '@/components/Breadcrumbs';
import NotFoundPage from './NotFoundPage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { motion } from 'framer-motion';

const TestimonialsPage = () => {
  const { getPageVisibility } = usePageVisibility();
  const [isVisible, setIsVisible] = useState(true);
  const [loadingVisibility, setLoadingVisibility] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkVisibility = async () => {
      const visible = await getPageVisibility('testimonials');
      setIsVisible(visible);
      setLoadingVisibility(false);
      
      if (visible) {
        fetchTestimonials();
      }
    };
    checkVisibility();
  }, [getPageVisibility]);

  const fetchTestimonials = async () => {
    setLoadingContent(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingContent(false);
    }
  };

  if (loadingVisibility) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>;
  if (!isVisible) return <NotFoundPage />;

  return (
    <div className="min-h-screen bg-background pb-12">
      <Helmet>
        <title>Testimonials | a2z Utility Hub</title>
        <meta name="description" content="See what our users are saying about a2z Utility Hub." />
      </Helmet>

      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-background py-16 md:py-24">
        <div className="container text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Loved by Thousands</h1>
          <p className="text-xl text-muted-foreground">
            Join the community of satisfied users who rely on our tools and deals every day.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <Breadcrumbs items={[{ title: "Testimonials", to: "/testimonials" }]} className="mb-12" />

        {loadingContent ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : error ? (
            <div className="text-center py-12">
                <p className="text-destructive mb-4">Failed to load testimonials: {error}</p>
                <Button onClick={fetchTestimonials}>Retry</Button>
            </div>
        ) : testimonials.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-xl">
                <p className="text-muted-foreground text-lg">No testimonials yet. Be the first to share your experience!</p>
            </div>
        ) : (
          <div className="mb-20">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation
              className="pb-16 px-4"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-8 flex flex-col h-full">
                        <div className="mb-6 text-primary">
                          <Quote className="h-8 w-8 opacity-50" />
                        </div>
                        <p className="text-lg mb-6 flex-grow italic text-foreground/90 leading-relaxed">"{testimonial.review_text}"</p>
                        
                        <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
                          <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                            <AvatarImage src={testimonial.user_avatar_url} />
                            <AvatarFallback>{testimonial.user_name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-bold text-sm">{testimonial.user_name || 'Anonymous'}</h4>
                            {testimonial.user_role && <p className="text-xs text-muted-foreground">{testimonial.user_role}</p>}
                            <div className="flex gap-0.5 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < (testimonial.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className="bg-primary text-primary-foreground rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Have an experience to share?</h2>
                <p className="mb-8 opacity-90 text-lg">We'd love to hear your feedback. Send us your testimonial and get featured!</p>
                <Button size="lg" variant="secondary" asChild>
                    <a href="/contact-us">Submit Testimonial</a>
                </Button>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;