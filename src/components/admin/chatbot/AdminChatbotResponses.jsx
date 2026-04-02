import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { useChatbotAdmin } from '@/hooks/useChatbotAdmin';
import { useDebounce } from '@/hooks/useDebounce';

const AdminChatbotResponses = ({ chatbotId }) => {
    const { fetchResponses, fetchIntents, createResponse, updateResponse, deleteResponse, loading } = useChatbotAdmin(chatbotId);
    const [responses, setResponses] = useState([]);
    const [intents, setIntents] = useState([]);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResponse, setEditingResponse] = useState(null);
    const [formData, setFormData] = useState({});

    const loadData = async () => {
        const [respResult, intentResult] = await Promise.all([
            fetchResponses({ search: debouncedSearch }),
            fetchIntents({ pageSize: 100 }) // Fetch intents for dropdown
        ]);
        if (respResult) setResponses(respResult.data || []);
        if (intentResult) setIntents(intentResult.data || []);
    };

    useEffect(() => { loadData(); }, [debouncedSearch, chatbotId]);

    const handleSave = async () => {
        let success;
        if (editingResponse) {
            success = await updateResponse(editingResponse.id, formData);
        } else {
            success = await createResponse(formData);
        }

        if (success) {
            setIsModalOpen(false);
            setEditingResponse(null);
            setFormData({});
            loadData();
        }
    };

    const openModal = (resp = null) => {
        setEditingResponse(resp);
        setFormData(resp || {
            text: '', intent_id: '', priority: 'medium', status: 'active'
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this response?')) {
            await deleteResponse(id);
            loadData();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Input 
                    placeholder="Search responses..." 
                    className="max-w-sm" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={() => openModal()}><Plus className="mr-2 h-4 w-4"/> Create Response</Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Response Text</TableHead>
                            <TableHead>Intent</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow>
                        ) : responses.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No responses found.</TableCell></TableRow>
                        ) : (
                            responses.map(resp => (
                                <TableRow key={resp.id}>
                                    <TableCell className="max-w-xs truncate font-medium">{resp.text}</TableCell>
                                    <TableCell><Badge variant="outline">{resp.intent?.name || 'Unlinked'}</Badge></TableCell>
                                    <TableCell><Badge variant="secondary">{resp.priority}</Badge></TableCell>
                                    <TableCell><Badge variant={resp.status === 'active' ? 'success' : 'secondary'}>{resp.status}</Badge></TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => openModal(resp)}><Edit className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(resp.id)}><Trash2 className="h-4 w-4"/></Button>
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
                        <DialogTitle>{editingResponse ? 'Edit Response' : 'Create Response'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Response Text</Label>
                            <Textarea 
                                value={formData.text || ''} 
                                onChange={e => setFormData({...formData, text: e.target.value})} 
                                placeholder="Hi! How can I help?" 
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Linked Intent</Label>
                            <Select value={formData.intent_id} onValueChange={v => setFormData({...formData, intent_id: v})}>
                                <SelectTrigger><SelectValue placeholder="Select intent..."/></SelectTrigger>
                                <SelectContent>
                                    {intents.map(i => (
                                        <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label>Priority</Label>
                                <Select value={formData.priority} onValueChange={v => setFormData({...formData, priority: v})}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Response</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminChatbotResponses;