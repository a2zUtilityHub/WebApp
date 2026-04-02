import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TestimonialCard = ({ testimonial }) => (
  <motion.div
    className="h-full"
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-6 flex flex-col items-center text-center h-full justify-between">
        <Avatar className="h-20 w-20 mb-4 border-2 border-primary">
          <AvatarImage src={testimonial.user_avatar_url} alt={testimonial.user_name} />
          <AvatarFallback>{testimonial.user_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
            <p className="font-semibold text-lg">{testimonial.user_name}</p>
            <div className="flex my-2 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
              ))}
            </div>
            <p className="text-muted-foreground italic text-sm md:text-base">"{testimonial.review_text}"</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Testimonials = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) {
    return <p className="text-center text-muted-foreground">No testimonials available yet.</p>;
  }

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={30}
      slidesPerView={1}
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      navigation={true}
      breakpoints={{
        640: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 40 },
      }}
      className="!pb-12 !px-10"
      style={{
        '--swiper-navigation-color': 'var(--color-primary)',
        '--swiper-pagination-color': 'var(--color-primary)',
      }}
    >
      {testimonials.map((testimonial) => (
        <SwiperSlide key={testimonial.id} className="h-auto">
          <TestimonialCard testimonial={testimonial} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Testimonials;