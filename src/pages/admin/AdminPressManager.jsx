import React, { useState, useEffect } from 'react';
import { usePress } from '@/hooks/usePress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit, Trash2, Search } from 'lucide-react';
import { formatDate } from '@/utils/seoUtils';

const AdminPressManager = () => {
    const { fetchPressReleases, savePressRelease, deletePressRelease, loading } = usePress();
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    const loadData = async () => {
        const { data } = await fetchPressReleases({ search });
        if (data) setItems(data);
    };

    useEffect(() => { loadData(); }, [search]);

    const handleSave = async () => {
        if (!formData.title) return;
        const success = await savePressRelease(formData, editingItem?.id);
        if (success.data) {
            setIsModalOpen(false);
            setEditingItem(null);
            loadData();
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setFormData(item || { title: '', content: '', status: 'published', category: 'news' });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this press release?')) {
            await deletePressRelease(id);
            loadData();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Press Releases</h2>
                <Button onClick={() => openModal()}><Plus className="mr-2 h-4 w-4"/> Add Press Release</Button>
            </div>
            
            <div className="flex items-center space-x-2">
                 <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search press..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Published Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin h-6 w-6 mx-auto"/></TableCell></TableRow>
                        ) : items.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No press releases found.</TableCell></TableRow>
                        ) : (
                            items.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium max-w-xs truncate">{item.title}</TableCell>
                                    <TableCell>{formatDate(item.publication_date)}</TableCell>
                                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                                    <TableCell><Badge variant={item.status === 'published' ? 'success' : 'secondary'}>{item.status}</Badge></TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => openModal(item)}><Edit className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Press Release' : 'New Press Release'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Title *</Label>
                            <Input value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} className="h-32" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="news">News</SelectItem>
                                        <SelectItem value="announcement">Announcement</SelectItem>
                                        <SelectItem value="update">Update</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPressManager;