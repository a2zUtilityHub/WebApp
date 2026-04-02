import React, { useState, useEffect } from 'react';
import { useContactInfo } from '@/hooks/useContactInfo';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from 'lucide-react';

const AdminContactInfoManager = () => {
    const { fetchContactInfo, saveContactInfo, loading } = useContactInfo();
    const [info, setInfo] = useState({});

    useEffect(() => {
        const load = async () => {
            const data = await fetchContactInfo();
            if (data) setInfo(data);
        };
        load();
    }, [fetchContactInfo]);

    const handleSave = async () => {
        await saveContactInfo(info);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Contact Information</h2>
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
                            <Label>Main Email</Label>
                            <Input value={info.email || ''} onChange={e => setInfo({...info, email: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Main Phone</Label>
                            <Input value={info.phone || ''} onChange={e => setInfo({...info, phone: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Textarea value={info.address || ''} onChange={e => setInfo({...info, address: e.target.value})} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Support Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Support Email</Label>
                            <Input value={info.support_email || ''} onChange={e => setInfo({...info, support_email: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Support Phone</Label>
                            <Input value={info.support_phone || ''} onChange={e => setInfo({...info, support_phone: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Website URL</Label>
                            <Input value={info.website || ''} onChange={e => setInfo({...info, website: e.target.value})} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminContactInfoManager;