import React, { useState, useEffect } from 'react';
import { useTestimonials } from '@/hooks/useTestimonials';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit, Trash2, Search } from 'lucide-react';

const AdminTestimonialsManager = () => {
    const { fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, loading } = useTestimonials();
    const [testimonials, setTestimonials] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    const loadData = async () => {
        const { data } = await fetchTestimonials({ search, status: statusFilter });
        if (data) setTestimonials(data);
    };

    useEffect(() => { loadData(); }, [search, statusFilter]);

    const handleSave = async () => {
        if (!formData.author_name || !formData.content) return;
        
        let success;
        if (editingItem) {
            success = await updateTestimonial(editingItem.id, formData);
        } else {
            success = await createTestimonial(formData);
        }

        if (success.data) {
            setIsModalOpen(false);
            setEditingItem(null);
            setFormData({});
            loadData();
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setFormData(item || { author_name: '', content: '', rating: 5, status: 'active' });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this testimonial?')) {
            await deleteTestimonial(id);
            loadData();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Testimonials</h2>
                <Button onClick={() => openModal()}><Plus className="mr-2 h-4 w-4"/> Add Testimonial</Button>
            </div>
            
            <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Author</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin h-6 w-6 mx-auto"/></TableCell></TableRow>
                        ) : testimonials.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No testimonials found.</TableCell></TableRow>
                        ) : (
                            testimonials.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.author_name}</TableCell>
                                    <TableCell>{item.rating} ★</TableCell>
                                    <TableCell className="max-w-xs truncate">{item.content}</TableCell>
                                    <TableCell><Badge variant={item.status === 'active' ? 'success' : 'secondary'}>{item.status}</Badge></TableCell>
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Testimonial' : 'New Testimonial'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Author Name *</Label>
                            <Input value={formData.author_name || ''} onChange={e => setFormData({...formData, author_name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Content *</Label>
                            <Textarea value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label>Rating</Label>
                                <Select value={String(formData.rating)} onValueChange={v => setFormData({...formData, rating: parseInt(v)})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {[1,2,3,4,5].map(r => <SelectItem key={r} value={String(r)}>{r} Stars</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
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

export default AdminTestimonialsManager;