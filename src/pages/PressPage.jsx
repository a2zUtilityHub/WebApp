import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { usePress } from '@/hooks/usePress';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';
import { formatDate } from '@/utils/seoUtils';

const PressPage = () => {
    const { fetchPressReleases } = usePress();
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await fetchPressReleases({ status: 'published' });
                if (data) setReleases(data);
            } catch (error) {
                console.error("Failed to load press releases:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [fetchPressReleases]);

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Press & News | a2z Utility Hub</title>
                <meta name="description" content="Latest news, updates, and announcements from a2z Utility Hub." />
            </Helmet>

            <div className="container py-16">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Newsroom</h1>
                    <p className="text-xl text-muted-foreground">Latest updates, announcements, and media resources.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>
                ) : releases.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                        <h3 className="text-xl font-medium mb-2">No News Yet</h3>
                        <p className="text-muted-foreground">Check back later for the latest updates.</p>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {releases.map((item) => (
                            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-0 sm:flex">
                                    {item.image_url && (
                                        <div className="sm:w-1/3 h-48 sm:h-auto bg-muted">
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="p-6 sm:w-2/3 flex flex-col justify-center">
                                        <div className="flex gap-2 mb-3">
                                            <Badge variant="outline">{item.category}</Badge>
                                            <span className="text-sm text-muted-foreground">{formatDate(item.publication_date)}</span>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors cursor-pointer">{item.title}</h2>
                                        <div className="text-muted-foreground line-clamp-2 mb-4" dangerouslySetInnerHTML={{ __html: item.content }} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PressPage;