import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminSEO } from '@/hooks/useAdminSEO';
import { Activity, Search, Link as LinkIcon, AlertOctagon, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const MetricCard = ({ title, value, subtext, icon: Icon, trend }) => (
    <Card className="bg-white/50 dark:bg-card/50 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
                {trend === 'up' && <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />}
                {trend === 'down' && <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />}
                {subtext}
            </div>
        </CardContent>
    </Card>
);

const SEODashboard = () => {
    const { fetchSEOPages, fetchKeywords, fetchBacklinks, loading } = useAdminSEO();
    const [stats, setStats] = useState({ pages: 0, keywords: 0, backlinks: 0, score: 0 });

    const loadStats = async () => {
        const [p, k, b] = await Promise.all([fetchSEOPages(), fetchKeywords(), fetchBacklinks()]);
        // Mock score calc
        const avgScore = p.data.length ? p.data.reduce((acc, curr) => acc + (curr.seo_score || 0), 0) / p.data.length : 0;
        
        setStats({
            pages: p.count || 0,
            keywords: k.count || 0,
            backlinks: b.count || 0,
            score: Math.round(avgScore)
        });
    };

    useEffect(() => { loadStats(); }, []);

    if (loading && stats.pages === 0) return <div className="grid gap-4 md:grid-cols-4"><Skeleton className="h-32"/><Skeleton className="h-32"/><Skeleton className="h-32"/><Skeleton className="h-32"/></div>;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard 
                    title="Overall SEO Score" 
                    value={`${stats.score}/100`} 
                    subtext="Average across all pages" 
                    icon={Activity}
                    trend={stats.score > 70 ? 'up' : 'down'}
                />
                <MetricCard 
                    title="Tracked Pages" 
                    value={stats.pages} 
                    subtext="Total pages indexed" 
                    icon={Search}
                    trend="up"
                />
                <MetricCard 
                    title="Keywords" 
                    value={stats.keywords} 
                    subtext="Ranking in top 100" 
                    icon={BarChart3}
                />
                <MetricCard 
                    title="Backlinks" 
                    value={stats.backlinks} 
                    subtext="Total active backlinks" 
                    icon={LinkIcon}
                    trend="up"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>SEO Health Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Chart Component Placeholder
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Issues</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1,2,3].map(i => (
                                <div key={i} className="flex items-start gap-3 text-sm border-b pb-3 last:border-0">
                                    <AlertOctagon className="h-4 w-4 text-red-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Missing Meta Description</p>
                                        <p className="text-muted-foreground text-xs">/blog/post-{i}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SEODashboard;