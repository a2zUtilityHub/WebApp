import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useFooterCMS } from '@/hooks/useFooterCMS';
import { Loader2, Megaphone, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Breadcrumbs from '@/components/Breadcrumbs';

const AdvertisePage = () => {
    const { fetchPages } = useFooterCMS();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await fetchPages({ slug: 'advertise' });
                if (data) setPage(data);
            } catch (error) {
                console.error("Failed to load advertise page:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [fetchPages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        toast({ title: "Inquiry Sent", description: "Our sales team will contact you shortly." });
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>;

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Advertise With Us | a2z Utility Hub</title>
                <meta name="description" content="Reach a targeted audience with our advertising solutions." />
            </Helmet>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Grow Your Brand With Us</h1>
                    <p className="text-xl opacity-80 max-w-2xl mx-auto mb-8">Reach thousands of engaged users daily. Targeted, effective, and affordable advertising solutions.</p>
                    <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}>
                        Start a Campaign
                    </Button>
                </div>
            </div>

            <div className="container py-16">
                 <Breadcrumbs items={[{ title: "Advertise", to: "/advertise" }]} className="mb-12" />

                 <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <Card>
                        <CardContent className="pt-6">
                            <Target className="h-10 w-10 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">Targeted Reach</h3>
                            <p className="text-muted-foreground">Connect with users looking for productivity tools, deals, and tech content.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <Megaphone className="h-10 w-10 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">Multiple Formats</h3>
                            <p className="text-muted-foreground">Banner ads, sponsored content, newsletter placements, and more.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <TrendingUp className="h-10 w-10 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">High Engagement</h3>
                            <p className="text-muted-foreground">Our users are active and looking for solutions, ensuring high CTR.</p>
                        </CardContent>
                    </Card>
                 </div>

                 <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div 
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: page?.content || "<p>Contact us for more details on our advertising packages.</p>" }} 
                    />
                    
                    <Card id="contact-form" className="p-6 shadow-lg border-t-4 border-t-primary">
                        <h3 className="text-2xl font-bold mb-4">Contact Sales</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">First Name</label>
                                    <Input required placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Last Name</label>
                                    <Input required placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Work Email</label>
                                <Input required type="email" placeholder="john@company.com" />
                            </div>
                             <div className="space-y-2">
                                <label className="text-sm font-medium">Company Website</label>
                                <Input placeholder="https://company.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message</label>
                                <Textarea required placeholder="Tell us about your advertising goals..." className="min-h-[120px]" />
                            </div>
                            <Button type="submit" className="w-full">Submit Inquiry</Button>
                        </form>
                    </Card>
                 </div>
            </div>
        </div>
    );
};

export default AdvertisePage;