import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useFooterCMS } from '@/hooks/useFooterCMS';
import { Loader2 } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButtons from '@/components/ShareButtons';
import TableOfContents from '@/components/TableOfContents';

const PrivacyPage = () => {
    const { fetchPages, fetchCopyright } = useFooterCMS();
    const [page, setPage] = useState(null);
    const [copyright, setCopyright] = useState(null);
    const [loading, setLoading] = useState(true);
    const contentRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await fetchPages({ slug: 'privacy' });
                if (data) setPage(data);
                const { data: copy } = await fetchCopyright();
                setCopyright(copy);
            } catch (error) {
                console.error("Failed to load privacy page:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [fetchPages, fetchCopyright]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>;

    return (
        <div className="min-h-screen bg-background pb-12">
            <Helmet>
                <title>{page?.title || "Privacy Policy"} | a2z Utility Hub</title>
                <meta name="description" content={page?.meta_description || "Read our privacy policy."} />
            </Helmet>

            <div className="bg-muted/30 border-b py-8">
                <div className="container">
                    <Breadcrumbs items={[{ title: "Legal" }, { title: "Privacy Policy", to: "/legal/privacy" }]} className="mb-4" />
                    <h1 className="text-4xl font-bold tracking-tight mb-2">{page?.title || "Privacy Policy"}</h1>
                    <p className="text-muted-foreground">Last updated: {new Date(page?.updated_at || Date.now()).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="container py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="hidden lg:block">
                    <TableOfContents contentRef={contentRef} />
                </aside>
                
                <div className="lg:col-span-3">
                    <div 
                        ref={contentRef}
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: page?.content || "<p>Our privacy policy is currently being updated. Please check back later.</p>" }} 
                    />
                    
                    <div className="mt-12 pt-6 border-t flex justify-between items-center">
                        <ShareButtons />
                        {copyright && <p className="text-sm text-muted-foreground">{copyright.copyright_text}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;