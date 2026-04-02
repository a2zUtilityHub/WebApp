import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useFooterCMS } from '@/hooks/useFooterCMS';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DynamicFooterPage = ({ slug, fallbackTitle }) => {
    const { fetchPages, fetchSEOSettings, fetchCopyright } = useFooterCMS();
    const { getPageVisibility } = usePageVisibility();
    
    const [page, setPage] = useState(null);
    const [seo, setSeo] = useState(null);
    const [copyright, setCopyright] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const visible = await getPageVisibility(slug);
                setIsVisible(visible);

                if (visible) {
                    const { data: pageData } = await fetchPages({ slug, status: 'published' });
                    setPage(pageData);
                    
                    if (pageData) {
                        const { data: seoData } = await fetchSEOSettings(pageData.id);
                        setSeo(seoData);
                    }

                    const { data: copyData } = await fetchCopyright();
                    setCopyright(copyData);
                }
            } catch (error) {
                console.error("Error loading dynamic page:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug, fetchPages, fetchSEOSettings, fetchCopyright, getPageVisibility]);

    if (loading) return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>;

    if (!isVisible) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-muted-foreground">Page Not Found</p>
                <p className="text-sm text-muted-foreground mt-2">This page is currently hidden or does not exist.</p>
                <Button asChild className="mt-6"><Link to="/">Return Home</Link></Button>
            </div>
        );
    }

    if (!page) {
        return (
             <div className="container py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-muted-foreground">The page "{fallbackTitle || slug}" could not be found.</p>
                <p className="text-sm text-muted-foreground mt-2">It may have been moved or deleted.</p>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-background"
        >
            <Helmet>
                <title>{seo?.title || page.title} | a2z Utility Hub</title>
                <meta name="description" content={seo?.description || page.meta_description || `Read about ${page.title}`} />
                {seo?.keywords && <meta name="keywords" content={seo.keywords.join(', ')} />}
                {seo?.robots && <meta name="robots" content={seo.robots} />}
                {seo?.canonical_url && <link rel="canonical" href={seo.canonical_url} />}
                {seo?.og_image && <meta property="og:image" content={seo.og_image} />}
                {seo?.og_title && <meta property="og:title" content={seo.og_title} />}
                {seo?.og_description && <meta property="og:description" content={seo.og_description} />}
            </Helmet>

            <div className="bg-gradient-to-b from-primary/5 to-background py-16">
                <div className="container px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight mb-4">{page.title}</h1>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"/>
                </div>
            </div>

            <div className="container px-4 py-12 max-w-4xl mx-auto">
                <div 
                    className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>

            {copyright && (
                <div className="border-t py-8 mt-12 bg-muted/20">
                    <div className="container text-center text-sm text-muted-foreground">
                        <p>{copyright.copyright_text || `© ${copyright.copyright_year} ${copyright.company_name}. All rights reserved.`}</p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default DynamicFooterPage;