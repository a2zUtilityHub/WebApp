import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useChatbotAdmin } from '@/hooks/useChatbotAdmin';
import { useDebounce } from '@/hooks/useDebounce';

const AdminChatbotIntents = ({ chatbotId }) => {
    const { fetchIntents, createIntent, updateIntent, deleteIntent, loading } = useChatbotAdmin(chatbotId);
    const [intents, setIntents] = useState([]);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIntent, setEditingIntent] = useState(null);
    const [formData, setFormData] = useState({});

    const loadData = async () => {
        const result = await fetchIntents({ search: debouncedSearch });
        if (result) setIntents(result.data || []);
    };

    useEffect(() => { loadData(); }, [debouncedSearch, chatbotId]);

    const handleSave = async () => {
        const payload = {
            ...formData,
            examples: typeof formData.examples === 'string' ? formData.examples.split('\n') : formData.examples,
        };

        let success;
        if (editingIntent) {
            success = await updateIntent(editingIntent.id, payload);
        } else {
            success = await createIntent(payload);
        }

        if (success) {
            setIsModalOpen(false);
            setEditingIntent(null);
            setFormData({});
            loadData();
        }
    };

    const openModal = (intent = null) => {
        setEditingIntent(intent);
        setFormData(intent ? {
            ...intent,
            examples: intent.examples ? intent.examples.join('\n') : ''
        } : {
            name: '', description: '', examples: '', confidence_threshold: 0.7, status: 'active'
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this intent?')) {
            await deleteIntent(id);
            loadData();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Input 
                    placeholder="Search intents..." 
                    className="max-w-sm" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={() => openModal()}><Plus className="mr-2 h-4 w-4"/> Create Intent</Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Examples</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow>
                        ) : intents.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No intents found.</TableCell></TableRow>
                        ) : (
                            intents.map(intent => (
                                <TableRow key={intent.id}>
                                    <TableCell className="font-medium">{intent.name}</TableCell>
                                    <TableCell className="max-w-xs truncate">{intent.description}</TableCell>
                                    <TableCell>{intent.examples?.length || 0}</TableCell>
                                    <TableCell><Badge variant={intent.status === 'active' ? 'success' : 'secondary'}>{intent.status}</Badge></TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => openModal(intent)}><Edit className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(intent.id)}><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingIntent ? 'Edit Intent' : 'Create Intent'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. greeting" />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="What is this intent for?" />
                        </div>
                        <div className="space-y-2">
                            <Label>Training Examples (one per line)</Label>
                            <Textarea 
                                value={formData.examples || ''} 
                                onChange={e => setFormData({...formData, examples: e.target.value})} 
                                placeholder="hello&#10;hi there&#10;good morning" 
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label>Confidence Threshold</Label>
                                <Input type="number" min="0" max="1" step="0.1" value={formData.confidence_threshold} onChange={e => setFormData({...formData, confidence_threshold: parseFloat(e.target.value)})} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Intent</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminChatbotIntents;