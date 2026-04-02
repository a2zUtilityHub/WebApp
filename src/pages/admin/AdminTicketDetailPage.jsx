import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send, ArrowLeft, Bot, User, Shield } from 'lucide-react';
import { format } from 'date-fns';

const AdminTicketDetailPage = () => {
    const { id } = useParams();
    const { user, session } = useAuth();
    const { toast } = useToast();
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);
    
    const fetchTicketData = async () => {
        setLoading(true);
        try {
            const { data: ticketData, error: ticketError } = await supabase
                .from('tickets')
                .select('*, user:profiles!tickets_user_id_fkey(id, first_name, last_name, email, avatar_url), assigned:profiles!tickets_assigned_to_fkey(first_name, last_name, avatar_url)')
                .eq('id', id)
                .single();
            if (ticketError) throw new Error("Ticket not found.");
            setTicket(ticketData);

            const { data: messagesData, error: messagesError } = await supabase
                .from('ticket_messages')
                .select('*, author:profiles(id, first_name, last_name, avatar_url, role_id, roles(name))')
                .eq('ticket_id', id)
                .order('created_at', { ascending: true });
            if (messagesError) throw messagesError;
            setMessages(messagesData);
            
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchTicketData();

        const channel = supabase
            .channel(`admin-ticket-chat:${id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${id}` }, (payload) => {
                fetchTicketData(); // Refetch all to get author info
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id, toast]);
    
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        setIsSending(true);
        
        try {
            const { error } = await supabase.functions.invoke('chatbot-assistant', {
                body: { query: `[admin] ${newMessage}`, ticketId: id, isFromAdmin: true },
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });

            if (error) throw error;
            setNewMessage('');
        } catch (error) {
            toast({ title: 'Error sending message', description: error.message, variant: 'destructive' });
        } finally {
            setIsSending(false);
        }
    };
    
    const handleStatusChange = async (newStatus) => {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .update({ status: newStatus })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        setTicket(data);
        toast({ title: "Status Updated", description: `Ticket status changed to ${newStatus}.` });
      } catch(error) {
        toast({ title: 'Error updating status', description: error.message, variant: 'destructive' });
      }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }
    if (!ticket) {
        return <div className="text-center py-20"><h1 className="text-2xl font-bold">Ticket Not Found</h1></div>;
    }
    
    const getStatusVariant = (status) => {
      switch (status) {
        case 'open': return 'default';
        case 'in progress': return 'secondary';
        case 'closed': return 'destructive';
        default: return 'outline';
      }
    };
    
    const isUserMessage = (msg) => msg.author.id === ticket.user.id;
    const cleanMessage = (message) => message.replace(/\[(user|assistant|admin)\]\s*/, '');
    
    return (
        <>
            <Helmet><title>Admin: Ticket #{ticket.id}</title></Helmet>
            <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                    <Button asChild variant="ghost" size="sm" className="mb-2">
                        <Link to="/admin/support"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Tickets</Link>
                    </Button>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold">Ticket #{ticket.id}: {ticket.subject}</h1>
                            <p className="text-sm text-muted-foreground">From: {ticket.user.email}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant={getStatusVariant(ticket.status)} className="text-base">{ticket.status}</Badge>
                            <Select onValueChange={handleStatusChange} value={ticket.status}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Change status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in progress">In Progress</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-3 ${isUserMessage(msg) ? 'justify-end' : ''}`}>
                            {!isUserMessage(msg) && <Shield className="h-8 w-8 text-secondary flex-shrink-0" />}
                            <div className={`max-w-lg rounded-lg px-4 py-2 ${isUserMessage(msg) ? 'bg-background' : 'bg-blue-100 dark:bg-blue-900/50'}`}>
                                <p className="text-sm font-semibold">{msg.author.first_name || 'Agent'}</p>
                                <p className="text-sm whitespace-pre-wrap">{cleanMessage(msg.message)}</p>
                                <p className="text-xs text-right mt-1 opacity-70">{format(new Date(msg.created_at), 'p')}</p>
                            </div>
                            {isUserMessage(msg) && <User className="h-8 w-8 text-primary flex-shrink-0" />}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t">
                    <div className="w-full space-y-2">
                        <Textarea
                            placeholder={ticket.status === 'closed' ? 'This ticket is closed.' : 'Type your reply...'}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={isSending || ticket.status === 'closed'}
                        />
                        <Button onClick={handleSendMessage} disabled={isSending || ticket.status === 'closed' || !newMessage.trim()} className="w-full">
                            {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Send Reply
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminTicketDetailPage;