import React, { useState, useEffect } from 'react';
import { useSocialLinks } from '@/hooks/useSocialLinks';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ExternalLink, Save } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

const AdminSocialLinksManager = () => {
    const { fetchLinks, saveLink, loading } = useSocialLinks();
    const [links, setLinks] = useState([]);

    const loadData = async () => {
        const data = await fetchLinks();
        if (data) setLinks(data);
    };

    useEffect(() => { loadData(); }, []);

    const handleUpdate = async (id, url, status) => {
        await saveLink(id, url, status);
        loadData();
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Social Media Links</h2>
                <Button onClick={loadData} variant="outline" size="sm"><Loader2 className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}/> Refresh</Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Platform</TableHead>
                            <TableHead className="w-[50%]">URL</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {links.map(link => (
                            <TableRow key={link.id}>
                                <TableCell className="font-medium capitalize">{link.platform}</TableCell>
                                <TableCell>
                                    <Input 
                                        defaultValue={link.url} 
                                        onBlur={(e) => {
                                            if (e.target.value !== link.url) handleUpdate(link.id, e.target.value, link.status);
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Switch 
                                        checked={link.status === 'active'} 
                                        onCheckedChange={(c) => handleUpdate(link.id, link.url, c ? 'active' : 'inactive')}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4"/></a>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {links.length === 0 && !loading && (
                            <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No links found. Run seeding script.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminSocialLinksManager;