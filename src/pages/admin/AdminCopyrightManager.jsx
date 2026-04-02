import React, { useState, useEffect } from 'react';
import { useCopyright } from '@/hooks/useCopyright';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save } from 'lucide-react';

const AdminCopyrightManager = () => {
    const { fetchCopyrightInfo, updateCopyrightInfo, loading } = useCopyright();
    const [info, setInfo] = useState({});

    useEffect(() => {
        const load = async () => {
            const data = await fetchCopyrightInfo();
            if (data) setInfo(data);
        };
        load();
    }, [fetchCopyrightInfo]);

    const handleSave = async () => {
        await updateCopyrightInfo(info);
    };

    const handleSocialChange = (platform, value) => {
        setInfo(prev => ({
            ...prev,
            social_links: {
                ...prev.social_links,
                [platform]: value
            }
        }));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Copyright & Company Info</h2>
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>General Info</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input value={info.company_name || ''} onChange={e => setInfo({...info, company_name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Copyright Year</Label>
                            <Input type="number" value={info.copyright_year || new Date().getFullYear()} onChange={e => setInfo({...info, copyright_year: parseInt(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Copyright Text Template</Label>
                            <Textarea value={info.copyright_text || ''} onChange={e => setInfo({...info, copyright_text: e.target.value})} placeholder="© {year} {company}. All rights reserved." />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={info.email || ''} onChange={e => setInfo({...info, email: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input value={info.phone || ''} onChange={e => setInfo({...info, phone: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Textarea value={info.address || ''} onChange={e => setInfo({...info, address: e.target.value})} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>Social Media Links</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Facebook URL</Label>
                            <Input value={info.social_links?.facebook || ''} onChange={e => handleSocialChange('facebook', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Twitter/X URL</Label>
                            <Input value={info.social_links?.twitter || ''} onChange={e => handleSocialChange('twitter', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Instagram URL</Label>
                            <Input value={info.social_links?.instagram || ''} onChange={e => handleSocialChange('instagram', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>LinkedIn URL</Label>
                            <Input value={info.social_links?.linkedin || ''} onChange={e => handleSocialChange('linkedin', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>YouTube URL</Label>
                            <Input value={info.social_links?.youtube || ''} onChange={e => handleSocialChange('youtube', e.target.value)} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminCopyrightManager;