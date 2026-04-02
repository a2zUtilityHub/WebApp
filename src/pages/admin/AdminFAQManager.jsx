import React, { useState, useEffect } from 'react';
import { useFAQ } from '@/hooks/useFAQ';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit, Trash2, Search } from 'lucide-react';

const AdminFAQManager = () => {
    const { fetchFAQItems, createFAQItem, updateFAQItem, deleteFAQItem, fetchCategories, loading } = useFAQ();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    const loadData = async () => {
        const { data } = await fetchFAQItems({ search });
        if (data) setItems(data);
        const cats = await fetchCategories();
        setCategories(cats || []);
    };

    useEffect(() => { loadData(); }, [search]);

    const handleSave = async () => {
        if (!formData.question || !formData.answer) return;
        
        let success;
        if (editingItem) {
            success = await updateFAQItem(editingItem.id, formData);
        } else {
            success = await createFAQItem(formData);
        }

        if (success.data) {
            setIsModalOpen(false);
            setEditingItem(null);
            loadData();
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setFormData(item || { question: '', answer: '', category: 'general', status: 'active', order_index: 0 });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this FAQ?')) {
            await deleteFAQItem(id);
            loadData();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">FAQ Manager</h2>
                <Button onClick={() => openModal()}><Plus className="mr-2 h-4 w-4"/> Add FAQ</Button>
            </div>
            
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search FAQs..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Question</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="animate-spin h-6 w-6 mx-auto"/></TableCell></TableRow>
                        ) : items.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No FAQs found.</TableCell></TableRow>
                        ) : (
                            items.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.question}</TableCell>
                                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
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
                        <DialogTitle>{editingItem ? 'Edit FAQ' : 'New FAQ'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Question *</Label>
                            <Input value={formData.question || ''} onChange={e => setFormData({...formData, question: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Answer *</Label>
                            <Textarea value={formData.answer || ''} onChange={e => setFormData({...formData, answer: e.target.value})} className="h-32" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label>Category</Label>
                                <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General</SelectItem>
                                        <SelectItem value="technical">Technical</SelectItem>
                                        <SelectItem value="billing">Billing</SelectItem>
                                        <SelectItem value="account">Account</SelectItem>
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

export default AdminFAQManager;