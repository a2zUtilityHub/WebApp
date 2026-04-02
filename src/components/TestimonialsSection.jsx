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
        <section id="testimonials" className="py-16 bg-muted/30">
            <div className="container px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Users Say</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">Discover why thousands of people trust a2z Utility Hub for their daily digital needs.</p>
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
                        <SwiperSlide key={item.id} className="h-full">
                            <Card className="h-full border-none shadow-md">
                                <CardContent className="pt-6 flex flex-col h-full">
                                    <div className="flex gap-1 mb-4 text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < item.rating ? 'fill-current' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-6 flex-grow italic">"{item.content}"</p>
                                    <div className="flex items-center gap-3 mt-auto">
                                        <Avatar>
                                            <AvatarImage src={item.author_image} />
                                            <AvatarFallback>{item.author_name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm">{item.author_name}</p>
                                            {item.author_title && <p className="text-xs text-muted-foreground">{item.author_title}</p>}
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