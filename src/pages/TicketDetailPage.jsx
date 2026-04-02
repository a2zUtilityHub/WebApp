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
import { Loader2, Send, ArrowLeft, Bot, User } from 'lucide-react';
import { format } from 'date-fns';

const TicketDetailPage = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
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
  
  useEffect(() => {
    const fetchTicketData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data: ticketData, error: ticketError } = await supabase
          .from('tickets')
          .select('*, assigned:profiles!tickets_assigned_to_fkey(first_name, last_name, avatar_url)')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        if (ticketError) throw new Error("Ticket not found or access denied.");
        setTicket(ticketData);

        const { data: messagesData, error: messagesError } = await supabase
          .from('ticket_messages')
          .select('*, author:profiles(first_name, last_name, avatar_url, role_id, roles(name))')
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

    fetchTicketData();

    const channel = supabase
      .channel(`ticket-chat:${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${id}` }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user, toast]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    try {
      const { error } = await supabase
        .from('ticket_messages')
        .insert({ ticket_id: id, user_id: user.id, message: newMessage });
      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      toast({ title: 'Error sending message', description: error.message, variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Ticket Not Found</h1>
        <p className="text-muted-foreground">The ticket you are looking for does not exist or you don't have permission to view it.</p>
        <Button asChild className="mt-4"><Link to="/support">Back to Support</Link></Button>
      </div>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'open': return 'default';
      case 'in progress': return 'secondary';
      case 'closed': return 'outline';
      default: return 'secondary';
    }
  };

  const getMessageSender = (message) => {
    if (message.message.startsWith('[user]')) return 'You';
    if (message.message.startsWith('[assistant]')) return 'A2Z Assistant';
    return message.author?.first_name || 'Admin';
  }
  
  const cleanMessage = (message) => {
    return message.replace(/\[(user|assistant|admin)\]\s*/, '');
  }

  const isMyMessage = (msg) => msg.user_id === user.id;

  return (
    <>
      <Helmet>
        <title>Ticket #{ticket.id} - Support</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Button asChild variant="ghost">
            <Link to="/support"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Support</Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Ticket #{ticket.id}: {ticket.subject}</CardTitle>
              <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
            </div>
            <CardDescription>
              Created: {format(new Date(ticket.created_at), 'PPP p')}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[50vh] overflow-y-auto p-4 space-y-4 bg-muted/20">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-3 ${isMyMessage(msg) ? 'justify-end' : ''}`}>
                 {!isMyMessage(msg) && <Bot className="h-8 w-8 text-muted-foreground flex-shrink-0" />}
                 <div className={`max-w-lg rounded-lg px-4 py-2 ${isMyMessage(msg) ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                   <p className="text-sm font-semibold">{getMessageSender(msg)}</p>
                   <p className="text-sm whitespace-pre-wrap">{cleanMessage(msg.message)}</p>
                   <p className="text-xs text-right mt-1 opacity-70">{format(new Date(msg.created_at), 'p')}</p>
                 </div>
                 {isMyMessage(msg) && <User className="h-8 w-8 text-primary flex-shrink-0" />}
              </div>
            ))}
             <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="pt-4 border-t">
            <div className="w-full space-y-2">
              <Textarea
                placeholder={ticket.status === 'closed' ? 'This ticket is closed.' : 'Type your message...'}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending || ticket.status === 'closed'}
              />
              <Button onClick={handleSendMessage} disabled={isSending || ticket.status === 'closed' || !newMessage.trim()} className="w-full">
                {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default TicketDetailPage;