import React, { useState, useEffect } from 'react';
import { useCareers } from '@/hooks/useCareers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit, Trash2, Search } from 'lucide-react';

const AdminCareersManager = () => {
    const { fetchJobPostings, saveJobPosting, deleteJobPosting, loading } = useCareers();
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    const loadData = async () => {
        const { data } = await fetchJobPostings({ search });
        if (data) setJobs(data);
    };

    useEffect(() => { loadData(); }, [search]);

    const handleSave = async () => {
        if (!formData.title || !formData.location) return;
        
        const success = await saveJobPosting(formData, editingItem?.id);
        if (success.data) {
            setIsModalOpen(false);
            setEditingItem(null);
            loadData();
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setFormData(item || { title: '', description: '', location: '', job_type: 'full-time', status: 'active' });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this job posting?')) {
            await deleteJobPosting(id);
            loadData();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Careers & Jobs</h2>
                <Button onClick={() => openModal()}><Plus className="mr-2 h-4 w-4"/> Post Job</Button>
            </div>
            
            <div className="flex items-center space-x-2">
                 <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search jobs..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin h-6 w-6 mx-auto"/></TableCell></TableRow>
                        ) : jobs.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No job postings found.</TableCell></TableRow>
                        ) : (
                            jobs.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell><Badge variant="outline">{item.job_type}</Badge></TableCell>
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
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Job' : 'Post New Job'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Job Title *</Label>
                                <Input value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Location *</Label>
                                <Input value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="h-32" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Job Type</Label>
                                <Select value={formData.job_type} onValueChange={v => setFormData({...formData, job_type: v})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full-time">Full Time</SelectItem>
                                        <SelectItem value="part-time">Part Time</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="internship">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Job</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminCareersManager;