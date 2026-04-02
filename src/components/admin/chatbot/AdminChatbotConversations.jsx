import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Eye, Archive } from 'lucide-react';
import { useChatbotAdmin } from '@/hooks/useChatbotAdmin';
import { formatDistanceToNow } from 'date-fns';

const AdminChatbotConversations = ({ chatbotId }) => {
    const { fetchConversations, deleteConversation, archiveConversation, loading } = useChatbotAdmin(chatbotId);
    const [conversations, setConversations] = useState([]);

    const loadData = async () => {
        const result = await fetchConversations();
        if (result) setConversations(result.data || []);
    };

    useEffect(() => { loadData(); }, [chatbotId]);

    const handleDelete = async (id) => {
        if (confirm('Delete this conversation history?')) {
            await deleteConversation(id);
            loadData();
        }
    };

    return (
        <div className="space-y-4">
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Started</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow>
                        ) : conversations.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No conversations found.</TableCell></TableRow>
                        ) : (
                            conversations.map(conv => (
                                <TableRow key={conv.id}>
                                    <TableCell className="font-medium">User {conv.user_id?.slice(0, 8) || 'Guest'}</TableCell>
                                    <TableCell>{formatDistanceToNow(new Date(conv.created_at), { addSuffix: true })}</TableCell>
                                    <TableCell><Badge variant={conv.status === 'active' ? 'success' : 'secondary'}>{conv.status || 'active'}</Badge></TableCell>
                                    <TableCell>{conv.rating ? `${conv.rating} ★` : '-'}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" title="View details (Coming Soon)"><Eye className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" onClick={() => archiveConversation(conv.id)} title="Archive"><Archive className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(conv.id)} title="Delete"><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminChatbotConversations;