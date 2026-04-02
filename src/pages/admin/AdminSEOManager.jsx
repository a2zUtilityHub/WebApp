import React, { useState, useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useFooterCMS } from '@/hooks/useFooterCMS';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { calculateSEOScore } from '@/utils/seoUtils';
import { Loader2, Save } from 'lucide-react';

const AdminSEOManager = () => {
    const { fetchPages } = useFooterCMS();
    const { fetchSEOSettings, updateSEOSettings, loading } = useSEO();
    
    const [pages, setPages] = useState([]);
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [settings, setSettings] = useState({});
    const [score, setScore] = useState(0);

    useEffect(() => {
        const loadPages = async () => {
            const { data } = await fetchPages();
            if (data) setPages(data);
        };
        loadPages();
    }, [fetchPages]);

    useEffect(() => {
        if (!selectedPageId) return;
        const loadSettings = async () => {
            const data = await fetchSEOSettings(selectedPageId);
            setSettings(data || { 
                title: '', description: '', keywords: [], og_title: '', og_description: '', robots: 'index, follow' 
            });
        };
        loadSettings();
    }, [selectedPageId, fetchSEOSettings]);

    useEffect(() => {
        setScore(calculateSEOScore(settings));
    }, [settings]);

    const handleSave = async () => {
        if (!selectedPageId) return;
        await updateSEOSettings(selectedPageId, settings);
    };

    const handleKeywordChange = (e) => {
        const val = e.target.value;
        setSettings({ ...settings, keywords: val.split(',').map(s => s.trim()) });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">SEO Manager</h2>
                <Button onClick={handleSave} disabled={loading || !selectedPageId}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                    Save Settings
                </Button>
            </div>

            <div className="w-full max-w-md">
                <Label>Select Page to Edit</Label>
                <Select value={selectedPageId} onValueChange={setSelectedPageId}>
                    <SelectTrigger><SelectValue placeholder="Choose a page..." /></SelectTrigger>
                    <SelectContent>
                        {pages.map(p => <SelectItem key={p.id} value={p.id}>{p.title} (/{p.slug})</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {selectedPageId && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Meta Tags</CardTitle>
                                <CardDescription>Basic SEO information for search engines.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Meta Title</Label>
                                    <Input value={settings.title || ''} onChange={e => setSettings({...settings, title: e.target.value})} maxLength={60} />
                                    <p className="text-xs text-muted-foreground text-right">{settings.title?.length || 0}/60</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Meta Description</Label>
                                    <Textarea value={settings.description || ''} onChange={e => setSettings({...settings, description: e.target.value})} maxLength={160} />
                                    <p className="text-xs text-muted-foreground text-right">{settings.description?.length || 0}/160</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Keywords (comma separated)</Label>
                                    <Input value={settings.keywords?.join(', ') || ''} onChange={handleKeywordChange} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Social Media (Open Graph)</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>OG Title</Label>
                                    <Input value={settings.og_title || ''} onChange={e => setSettings({...settings, og_title: e.target.value})} placeholder="Defaults to Meta Title" />
                                </div>
                                <div className="space-y-2">
                                    <Label>OG Description</Label>
                                    <Textarea value={settings.og_description || ''} onChange={e => setSettings({...settings, og_description: e.target.value})} placeholder="Defaults to Meta Description" />
                                </div>
                                <div className="space-y-2">
                                    <Label>OG Image URL</Label>
                                    <Input value={settings.og_image || ''} onChange={e => setSettings({...settings, og_image: e.target.value})} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO Score</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center py-6">
                                <div className={`text-5xl font-bold ${score > 80 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {score}/100
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Based on completeness</p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader><CardTitle>Advanced</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Canonical URL</Label>
                                    <Input value={settings.canonical_url || ''} onChange={e => setSettings({...settings, canonical_url: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Robots</Label>
                                    <Select value={settings.robots || 'index, follow'} onValueChange={v => setSettings({...settings, robots: v})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="index, follow">Index, Follow</SelectItem>
                                            <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                                            <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                                            <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSEOManager;