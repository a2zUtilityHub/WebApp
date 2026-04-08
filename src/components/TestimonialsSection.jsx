import React, { useEffect, useState } from 'react';
import { useTestimonials } from '@/hooks/useTestimonials';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const TestimonialsSection = () => {
    const { fetchTestimonials } = useTestimonials();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const { data } = await fetchTestimonials({ status: 'active', limit: 10 });
            if (data) setTestimonials(data);
            setLoading(false);
        };
        load();
    }, [fetchTestimonials]);

    if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>;
    if (testimonials.length === 0) return null;

    return (
        <section id="testimonials" className="py-24 bg-background relative overflow-hidden border-y border-border/50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="container px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground">What Our Users Say</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover why thousands of people trust a2z Utility Hub for their daily digital needs.</p>
                </div>

                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    className="pb-12"
                >
                    {testimonials.map((item) => (
                        <SwiperSlide key={item.id} className="h-full py-4 px-2">
                            <Card className="h-full border border-border/50 bg-background/60 backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 rounded-3xl overflow-hidden group">
                                <div className="h-1.5 w-full bg-gradient-to-r from-primary/40 to-primary group-hover:from-primary group-hover:to-primary/40 transition-all duration-500"></div>
                                <CardContent className="pt-8 px-8 pb-8 flex flex-col h-full">
                                    <div className="flex gap-1 mb-6 text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-5 w-5 ${i < item.rating ? 'fill-current drop-shadow-sm' : 'text-muted/50'}`} />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground/90 text-lg leading-relaxed mb-8 flex-grow italic">"{item.content}"</p>
                                    <div className="flex items-center gap-4 mt-auto">
                                        <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-sm">
                                            <AvatarImage src={item.author_image} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{item.author_name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-[15px] text-foreground">{item.author_name}</p>
                                            {item.author_title && <p className="text-[13px] font-medium text-muted-foreground">{item.author_title}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default TestimonialsSection;