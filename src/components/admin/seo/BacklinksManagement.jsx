import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAdminSEO } from '@/hooks/useAdminSEO';
import { Badge } from '@/components/ui/badge';
import { Plus, Link as LinkIcon } from 'lucide-react';

const BacklinksManagement = () => {
    const { fetchBacklinks, loading } = useAdminSEO();
    const [backlinks, setBacklinks] = useState([]);

    useEffect(() => {
        fetchBacklinks().then(res => setBacklinks(res.data || []));
    }, []);

    return (
        <div className="space-y-4">
             <div className="flex justify-end">
                <Button><Plus className="mr-2 h-4 w-4"/> Add Backlink</Button>
            </div>
            <div className="rounded-xl border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Referring Page</TableHead>
                            <TableHead>Anchor Text</TableHead>
                            <TableHead>DA / PA</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {backlinks.length > 0 ? backlinks.map(b => (
                            <TableRow key={b.id}>
                                <TableCell className="font-mono text-xs max-w-[200px] truncate" title={b.backlink_url}>{b.backlink_url}</TableCell>
                                <TableCell>{b.anchor_text}</TableCell>
                                <TableCell>{b.domain_authority} / {b.page_authority}</TableCell>
                                <TableCell><Badge variant="outline">{b.type}</Badge></TableCell>
                                <TableCell><Badge className="bg-green-100 text-green-800 hover:bg-green-100">{b.status}</Badge></TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No backlinks recorded.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default BacklinksManagement;