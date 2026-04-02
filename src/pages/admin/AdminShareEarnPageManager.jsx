import React, { useState, useEffect } from 'react';
import { useShareEarnPage } from '@/hooks/useShareEarnPage';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Save } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const AdminShareEarnPageManager = () => {
    const { getPageContent, updatePageContent, getVisibility, toggleVisibility, loading } = useShareEarnPage();
    const [content, setContent] = useState({});
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await getPageContent();
            const visible = await getVisibility();
            const contentMap = {};
            data.forEach(item => contentMap[item.section_name] = item.section_content);
            setContent(contentMap);
            setIsVisible(visible);
        };
        load();
    }, [getPageContent, getVisibility]);

    const handleSave = async (key) => await updatePageContent(key, content[key]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <div>
                    <h1 className="text-3xl font-bold">Share & Earn Manager</h1>
                    <Breadcrumbs items={[{ title: "Dashboard", to: "/admin/dashboard" }, { title: "Share & Earn", to: "#" }]} />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Label>Visibility</Label>
                        <Switch checked={isVisible} onCheckedChange={(v) => { setIsVisible(v); toggleVisibility(v); }} />
                    </div>
                    <Button variant="outline" onClick={() => window.open('/share-earn', '_blank')}><Eye className="mr-2 h-4 w-4"/> Preview</Button>
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle>Program Details</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Program Description</Label>
                        <Textarea 
                            value={content['program_details'] || ''} 
                            onChange={e => setContent({...content, program_details: e.target.value})}
                            className="h-32"
                        />
                        <Button onClick={() => handleSave('program_details')}><Save className="mr-2 h-4 w-4"/> Save</Button>
                    </div>
                    <div className="space-y-2">
                        <Label>How It Works</Label>
                        <Textarea 
                            value={content['how_it_works'] || ''} 
                            onChange={e => setContent({...content, how_it_works: e.target.value})}
                            className="h-32"
                        />
                        <Button onClick={() => handleSave('how_it_works')}><Save className="mr-2 h-4 w-4"/> Save</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminShareEarnPageManager;