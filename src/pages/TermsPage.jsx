import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useFooterCMS } from '@/hooks/useFooterCMS';
import { Loader2 } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButtons from '@/components/ShareButtons';
import TableOfContents from '@/components/TableOfContents';

const TermsPage = () => {
    const { fetchPages, fetchCopyright } = useFooterCMS();
    const [page, setPage] = useState(null);
    const [copyright, setCopyright] = useState(null);
    const [loading, setLoading] = useState(true);
    const contentRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await fetchPages({ slug: 'terms' });
                if (data) setPage(data);
                const { data: copy } = await fetchCopyright();
                setCopyright(copy);
            } catch (error) {
                console.error("Failed to load terms page:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [fetchPages, fetchCopyright]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>;

    return (
        <div className="min-h-screen bg-background pb-20 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
            
            <Helmet>
                <title>{page?.title || "Terms of Service"} | a2z Utility Hub</title>
                <meta name="description" content={page?.meta_description || "Read our terms of service."} />
            </Helmet>

            <div className="bg-gradient-to-b from-muted/30 to-background border-b border-border/50 py-16 relative z-10">
                <div className="container">
                    <Breadcrumbs items={[{ title: "Legal" }, { title: "Terms of Service", to: "/legal/terms" }]} className="mb-6 inline-flex bg-background/60 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm" />
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-foreground">{page?.title || "Terms of Service"}</h1>
                    <p className="text-lg text-muted-foreground font-medium flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"></span>
                       Last updated: {new Date(page?.updated_at || Date.now()).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="container py-12 grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
                <aside className="hidden lg:block relative">
                    <div className="sticky top-28 bg-background/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-sm">
                       <TableOfContents contentRef={contentRef} />
                    </div>
                </aside>
                
                <div className="lg:col-span-3">
                    <div className="bg-background/60 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] shadow-lg p-8 md:p-12 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/40 to-primary"></div>
                        <div 
                            ref={contentRef}
                            className="prose dark:prose-invert max-w-none text-foreground/80 prose-headings:text-foreground prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-a:text-primary hover:prose-a:text-primary/80 prose-li:marker:text-primary leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: page?.content || "<p className='text-lg'>Our terms of service are currently being updated. Please check back later.</p>" }} 
                        />
                    </div>
                    
                    <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="bg-background/60 backdrop-blur-md p-3 rounded-2xl border border-border/50 shadow-sm">
                           <ShareButtons />
                        </div>
                        {copyright && <p className="text-[14px] font-medium text-muted-foreground/80 bg-muted/30 px-4 py-2 rounded-full">{copyright.copyright_text}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;