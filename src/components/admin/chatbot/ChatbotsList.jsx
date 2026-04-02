import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { StatusBadge, TypeBadge } from './ChatbotBadges';
import { useChatbotManagement } from '@/hooks/useChatbotManagement';
import { Skeleton } from "@/components/ui/skeleton";

const ChatbotsList = ({ filters, search, onView, onEdit, onCreate }) => {
    const { getChatbots, deleteChatbot } = useChatbotManagement();
    const [chatbots, setChatbots] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const { data } = await getChatbots(filters, search);
        setChatbots(data || []);
        setLoading(false);
    };

    useEffect(() => { load(); }, [filters, search]);

    const handleDelete = async (id) => {
        if(confirm('Are you sure?')) {
            await deleteChatbot(id);
            load();
        }
    };

    if (loading) return <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full"/>)}</div>;

    if (!chatbots.length) return (
        <div className="flex flex-col items-center justify-center h-64 border rounded-md border-dashed bg-muted/10">
            <p className="text-muted-foreground mb-4">No chatbots found.</p>
            <Button onClick={onCreate}><Plus className="mr-2 h-4 w-4"/> Create Chatbot</Button>
        </div>
    );

    return (
        <div className="border rounded-md bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Stats</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {chatbots.map(bot => (
                        <TableRow key={bot.id}>
                            <TableCell className="font-medium">{bot.name}</TableCell>
                            <TableCell><TypeBadge type={bot.type}/></TableCell>
                            <TableCell><StatusBadge status={bot.status}/></TableCell>
                            <TableCell className="uppercase">{bot.language}</TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                                {bot.total_conversations} conv • {bot.satisfaction_rating}★
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onView(bot)}><Eye className="mr-2 h-4 w-4"/> View</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onEdit(bot)}><Edit className="mr-2 h-4 w-4"/> Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(bot.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/> Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ChatbotsList;