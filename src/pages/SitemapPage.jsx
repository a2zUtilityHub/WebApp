import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useFooterCMS } from '@/hooks/useFooterCMS';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const SitemapPage = () => {
    const { fetchPages } = useFooterCMS();
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await fetchPages({ status: 'published' });
                if (data) setPages(data);
            } catch (error) {
                console.error("Failed to load sitemap pages:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [fetchPages]);

    const staticLinks = [
        { title: 'Home', path: '/' },
        { title: 'Apps', path: '/apps' },
        { title: 'Blogs', path: '/blogs' },
        { title: 'Coupons', path: '/coupons' },
        { title: 'Contact', path: '/contact' },
        { title: 'Donate', path: '/donate' },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Sitemap | a2z Utility Hub</title>
                <meta name="description" content="Overview of all pages available on a2z Utility Hub." />
            </Helmet>

            <div className="container py-16">
                <h1 className="text-4xl font-bold mb-8">Sitemap</h1>

                {loading ? (
                    <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader><CardTitle>Main Pages</CardTitle></CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {staticLinks.map(link => (
                                        <li key={link.path}>
                                            <Link to={link.path} className="text-primary hover:underline flex items-center gap-2">
                                                {link.title} <ExternalLink className="h-3 w-3 opacity-50"/>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Content Pages</CardTitle></CardHeader>
                            <CardContent>
                                {pages.length > 0 ? (
                                    <ul className="space-y-2">
                                        {pages.map(page => (
                                            <li key={page.id}>
                                                <Link to={`/${page.slug}`} className="text-primary hover:underline flex items-center gap-2">
                                                    {page.title} <span className="text-xs text-muted-foreground">(/ {page.slug})</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted-foreground">No dynamic pages found.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SitemapPage;