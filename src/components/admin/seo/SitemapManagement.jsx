import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminSEO } from '@/hooks/useAdminSEO';
import { FileCode, RefreshCw, Download, ExternalLink, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const SitemapManagement = () => {
    const { fetchSitemapData } = useAdminSEO();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const res = await fetchSitemapData();
            setData(res);
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return <Skeleton className="h-[300px] w-full" />;

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileCode className="h-5 w-5 text-blue-600" />
                        XML Sitemap
                    </CardTitle>
                    <CardDescription>Manage your sitemap configuration and submission.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-card border shadow-sm">
                            <div className="text-sm text-muted-foreground">Status</div>
                            <div className="text-xl font-bold flex items-center gap-2 mt-1">
                                {data?.status === 'Active' ? <CheckCircle className="h-4 w-4 text-green-500"/> : null}
                                {data?.status}
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-card border shadow-sm">
                            <div className="text-sm text-muted-foreground">Pages Included</div>
                            <div className="text-xl font-bold mt-1">{data?.page_count}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-card border shadow-sm">
                            <div className="text-sm text-muted-foreground">Last Updated</div>
                            <div className="text-sm font-medium mt-1">{new Date(data?.last_updated).toLocaleDateString()}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-card border shadow-sm">
                            <div className="text-sm text-muted-foreground">Sitemap URL</div>
                            <a href={data?.sitemap_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1 mt-1 truncate">
                                View <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </div>

                    <div className="rounded-lg border p-4 bg-muted/30">
                        <h4 className="font-medium mb-4">Preview (First 5 Entries)</h4>
                        <div className="space-y-2 font-mono text-xs text-muted-foreground">
                            <div className="p-2 bg-card rounded border">https://a2zutils.com/</div>
                            <div className="p-2 bg-card rounded border">https://a2zutils.com/about</div>
                            <div className="p-2 bg-card rounded border">https://a2zutils.com/contact</div>
                            <div className="p-2 bg-card rounded border">https://a2zutils.com/apps</div>
                            <div className="p-2 bg-card rounded border">https://a2zutils.com/blogs</div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 justify-end border-t pt-6">
                    <Button variant="outline"><Download className="mr-2 h-4 w-4"/> Download XML</Button>
                    <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4"/> Regenerate</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">Submit to Google</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SitemapManagement;