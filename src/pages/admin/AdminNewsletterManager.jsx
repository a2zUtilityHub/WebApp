import React, { useState, useEffect } from 'react';
import { useNewsletter } from '@/hooks/useNewsletter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail, Trash2, Send } from 'lucide-react';

const AdminNewsletterManager = () => {
    const { fetchSubscribers, deleteSubscriber, getStats, loading } = useNewsletter();
    const [subscribers, setSubscribers] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });
    const [search, setSearch] = useState('');
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [newsletterData, setNewsletterData] = useState({ subject: '', content: '' });

    const loadData = async () => {
        const { data } = await fetchSubscribers({ search });
        if (data) setSubscribers(data);
        const s = await getStats();
        setStats(s);
    };

    useEffect(() => { loadData(); }, [search]);

    const handleDelete = async (id) => {
        if (confirm('Delete subscriber?')) {
            await deleteSubscriber(id);
            loadData();
        }
    };

    const handleSend = async () => {
        // Mock sending
        alert('Newsletter queued for sending!');
        setIsSendModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Newsletter Manager</h2>
                <Button onClick={() => setIsSendModalOpen(true)}><Send className="mr-2 h-4 w-4"/> Send Newsletter</Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Card><CardHeader><CardTitle>Total</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{stats.total}</CardContent></Card>
                <Card><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-green-600">{stats.active}</CardContent></Card>
                <Card><CardHeader><CardTitle>Unsubscribed</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-red-600">{stats.unsubscribed}</CardContent></Card>
            </div>

            <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Input placeholder="Search email..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Subscribed At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="animate-spin h-6 w-6 mx-auto"/></TableCell></TableRow>
                        ) : subscribers.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No subscribers found.</TableCell></TableRow>
                        ) : (
                            subscribers.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell><Badge variant={item.status === 'active' ? 'success' : 'secondary'}>{item.status}</Badge></TableCell>
                                    <TableCell>{new Date(item.subscribed_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isSendModalOpen} onOpenChange={setIsSendModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>Send Newsletter</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input value={newsletterData.subject} onChange={e => setNewsletterData({...newsletterData, subject: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea value={newsletterData.content} onChange={e => setNewsletterData({...newsletterData, content: e.target.value})} className="h-40" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSendModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSend}>Send Now</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminNewsletterManager;