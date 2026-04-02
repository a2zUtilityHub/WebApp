import React, { useState, useEffect } from 'react';
import { useContactPage } from '@/hooks/useContactPage';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Eye } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const AdminContactPageManager = () => {
    const { getContactPageContent, updateContactPageContent, updateContactSettings, getContactPageVisibility, toggleContactPageVisibility, loading } = useContactPage();
    const [content, setContent] = useState({});
    const [settings, setSettings] = useState({});
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const load = async () => {
            const { content: cData, settings: sData } = await getContactPageContent();
            const visible = await getContactPageVisibility();
            
            const contentMap = {};
            cData.forEach(item => contentMap[item.section_name] = item.section_content);
            setContent(contentMap);
            setSettings(sData);
            setIsVisible(visible);
        };
        load();
    }, [getContactPageContent, getContactPageVisibility]);

    const handleSaveContent = async (key) => await updateContactPageContent(key, content[key]);
    
    const handleSaveSetting = async (key) => await updateContactSettings(key, settings[key]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Contact Page Manager</h1>
                    <Breadcrumbs items={[{ title: "Dashboard", to: "/admin/dashboard" }, { title: "Contact Manager", to: "#" }]} />
                </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Label>Visibility</Label>
                        <Switch checked={isVisible} onCheckedChange={(v) => { setIsVisible(v); toggleContactPageVisibility(v); }} />
                    </div>
                    <Button variant="outline" onClick={() => window.open('/contact-us', '_blank')}><Eye className="mr-2 h-4 w-4"/> Preview</Button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Page Content</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Hero Title</Label>
                            <Input value={content['hero_title'] || ''} onChange={e => setContent({...content, hero_title: e.target.value})} />
                            <Button size="sm" onClick={() => handleSaveContent('hero_title')}>Save</Button>
                        </div>
                        <div className="space-y-2">
                            <Label>Hero Description</Label>
                            <Textarea value={content['hero_desc'] || ''} onChange={e => setContent({...content, hero_desc: e.target.value})} />
                            <Button size="sm" onClick={() => handleSaveContent('hero_desc')}>Save</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input value={settings['email'] || ''} onChange={e => setSettings({...settings, email: e.target.value})} />
                            <Button size="sm" onClick={() => handleSaveSetting('email')}>Save</Button>
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input value={settings['phone'] || ''} onChange={e => setSettings({...settings, phone: e.target.value})} />
                            <Button size="sm" onClick={() => handleSaveSetting('phone')}>Save</Button>
                        </div>
                        <div className="space-y-2">
                            <Label>Physical Address</Label>
                            <Textarea value={settings['address'] || ''} onChange={e => setSettings({...settings, address: e.target.value})} />
                            <Button size="sm" onClick={() => handleSaveSetting('address')}>Save</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminContactPageManager;