import React, { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSupport } from '@/hooks/useSupport';
import { StatusBadge, PriorityBadge } from './SupportTicketBadges';
import SupportMessageReply from './SupportMessageReply';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, MoreHorizontal, FileText, Lock, Unlock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const SupportTicketDetail = ({ ticketId, onBack }) => {
  const { user } = useAuth();
  const { getTicketDetail, replyToTicket, updateTicketStatus, loading: hookLoading } = useSupport();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    const result = await getTicketDetail(ticketId);
    if (result) {
        setTicket(result.ticket);
        setMessages(result.messages);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [ticketId]);

  useEffect(() => {
     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReply = async (data) => {
    setReplying(true);
    try {
      await replyToTicket({ ticketId, ...data });
      await fetchData(); // Refresh conversation
    } catch (e) {
      // Error handled in hook
    } finally {
      setReplying(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    await updateTicketStatus(ticketId, newStatus);
    await fetchData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading discussion...</p>
      </div>
    );
  }

  if (!ticket) return <div className="p-8 text-center">Ticket not found</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" className="w-fit pl-0 -ml-2 text-muted-foreground hover:text-primary" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-card p-6 rounded-xl border shadow-sm">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
               <h1 className="text-2xl font-bold text-foreground">{ticket.subject}</h1>
               <StatusBadge status={ticket.status} />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
               <span>ID: #{ticket.id}</span>
               <span>•</span>
               <span>{format(new Date(ticket.created_at), 'PPP p')}</span>
               <span>•</span>
               <PriorityBadge priority={ticket.priority} />
               <span>•</span>
               <span>{ticket.support_categories?.name}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ticket.status !== 'Closed' ? (
                 <DropdownMenuItem onClick={() => handleStatusChange('Closed')}>
                    <Lock className="h-4 w-4 mr-2" /> Close Ticket
                 </DropdownMenuItem>
              ) : (
                 <DropdownMenuItem onClick={() => handleStatusChange('Open')}>
                    <Unlock className="h-4 w-4 mr-2" /> Reopen Ticket
                 </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Conversation Area */}
      <div className="space-y-8">
         {/* Original Description as the first "message" context */}
         <Card className="border-l-4 border-l-primary/20 shadow-sm">
            <CardHeader className="pb-3">
               <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                     <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                  <div>
                     <p className="font-semibold text-sm">You</p>
                     <p className="text-xs text-muted-foreground">Original Request</p>
                  </div>
               </div>
            </CardHeader>
            <CardContent>
                <div className="prose dark:prose-invert text-sm max-w-none" dangerouslySetInnerHTML={{ __html: ticket.description }} />
            </CardContent>
         </Card>

         <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border/50 -z-10 hidden md:block" />
            
            <div className="space-y-6">
                {messages.map((msg) => {
                   const isMe = msg.user_id === user.id;
                   return (
                     <div key={msg.id} className={cn("flex gap-4 md:pl-0", isMe ? "justify-end" : "justify-start")}>
                        {!isMe && (
                           <Avatar className="h-8 w-8 md:h-10 md:w-10 mt-1 border-2 border-background shadow-sm">
                              <AvatarImage src={msg.profiles?.avatar_url} />
                              <AvatarFallback className="bg-primary/10 text-primary">SP</AvatarFallback>
                           </Avatar>
                        )}
                        
                        <div className={cn("flex flex-col max-w-[85%] md:max-w-[75%]", isMe ? "items-end" : "items-start")}>
                            <div className={cn(
                               "rounded-2xl px-5 py-3 shadow-sm text-sm relative",
                               isMe 
                               ? "bg-primary text-primary-foreground rounded-br-none" 
                               : "bg-card border rounded-bl-none"
                            )}>
                               <p className="whitespace-pre-wrap">{msg.message}</p>
                               {msg.file_url && (
                                  <a 
                                    href={msg.file_url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className={cn("flex items-center gap-2 mt-3 p-2 rounded-md bg-background/10 border border-current/20 text-xs hover:bg-background/20 transition-colors", isMe ? "text-primary-foreground" : "text-foreground")}
                                  >
                                    <FileText className="h-4 w-4" />
                                    Attachment
                                  </a>
                               )}
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1 px-1">
                               {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                            </span>
                        </div>

                        {isMe && (
                           <Avatar className="h-8 w-8 md:h-10 md:w-10 mt-1 border-2 border-background shadow-sm">
                               <AvatarImage src={user.user_metadata?.avatar_url} />
                               <AvatarFallback>ME</AvatarFallback>
                           </Avatar>
                        )}
                     </div>
                   );
                })}
                <div ref={messagesEndRef} />
            </div>
         </div>
      </div>

      <Separator className="my-6" />

      {/* Reply Section */}
      {ticket.status === 'Closed' ? (
         <div className="bg-muted/50 rounded-xl p-8 text-center border border-dashed">
            <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">This ticket is closed</h3>
            <p className="text-muted-foreground mb-4">You can reopen this ticket if you need further assistance.</p>
            <Button onClick={() => handleStatusChange('Open')} variant="outline">Reopen Ticket</Button>
         </div>
      ) : (
         <div className="pt-2">
            <h3 className="text-lg font-semibold mb-4">Post a Reply</h3>
            <SupportMessageReply onSend={handleReply} loading={replying} />
         </div>
      )}
    </div>
  );
};

export default SupportTicketDetail;