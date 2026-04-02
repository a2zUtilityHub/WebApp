import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge, PriorityBadge } from './MessageBadges';
import MessageReplyForm from './MessageReplyForm';
import AdminNotes from './AdminNotes';
import { format } from 'date-fns';
import { ArrowLeft, MoreHorizontal, User, Mail, Calendar, FileText, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const MessageDetail = ({ ticket, onBack, onUpdate }) => {
  const { user: adminUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, [ticket.id]);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('support_messages')
      .select(`
        *,
        profiles:user_id (first_name, last_name, avatar_url, role_id)
      `)
      .eq('ticket_id', ticket.id)
      .order('created_at', { ascending: true });
    
    setMessages(data || []);
    setLoading(false);
  };

  const handleStatusChange = async (newStatus) => {
     await supabase.from('support_tickets').update({ status: newStatus }).eq('id', ticket.id);
     if (onUpdate) onUpdate();
  };

  const handlePriorityChange = async (newPriority) => {
     await supabase.from('support_tickets').update({ priority: newPriority }).eq('id', ticket.id);
     if (onUpdate) onUpdate();
  };

  const user = ticket.profiles || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Left Column: Conversation */}
      <div className="lg:col-span-2 flex flex-col h-full bg-card border rounded-xl overflow-hidden shadow-sm">
         {/* Header */}
         <div className="p-4 border-b flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
               <Button variant="ghost" size="icon" onClick={onBack}>
                  <ArrowLeft className="h-5 w-5" />
               </Button>
               <div>
                  <h2 className="font-semibold text-lg line-clamp-1">{ticket.subject}</h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                     <span>#{ticket.id}</span>
                     <span>•</span>
                     <span>{format(new Date(ticket.created_at), 'PPP p')}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Messages Area */}
         <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar" ref={scrollRef}>
            {/* Original Request */}
            <div className="flex gap-4">
               <Avatar className="h-10 w-10 border">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>{user.first_name?.[0]}</AvatarFallback>
               </Avatar>
               <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                     <span className="font-semibold text-sm">{user.first_name} {user.last_name}</span>
                     <span className="text-xs text-muted-foreground">Original Request</span>
                  </div>
                  <div 
                    className="prose dark:prose-invert text-sm max-w-none bg-muted/30 p-4 rounded-lg border" 
                    dangerouslySetInnerHTML={{ __html: ticket.description }} 
                  />
               </div>
            </div>

            <Separator />

            {/* Thread */}
            {messages.map((msg) => {
               const isAdmin = msg.profiles?.role_id !== user.role_id; // Simple check, ideally check role name
               return (
                  <div key={msg.id} className={cn("flex gap-4", isAdmin ? "flex-row-reverse" : "")}>
                     <Avatar className="h-10 w-10 border">
                        <AvatarImage src={msg.profiles?.avatar_url} />
                        <AvatarFallback>{msg.profiles?.first_name?.[0]}</AvatarFallback>
                     </Avatar>
                     <div className={cn("flex-1 space-y-1 max-w-[85%]", isAdmin ? "items-end text-right" : "")}>
                        <div className={cn("flex items-center gap-2", isAdmin ? "flex-row-reverse" : "")}>
                           <span className="font-semibold text-sm">
                              {msg.profiles?.first_name} {msg.profiles?.last_name}
                           </span>
                           <span className="text-xs text-muted-foreground">
                              {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                           </span>
                        </div>
                        <div 
                          className={cn(
                             "text-sm p-3 rounded-lg inline-block text-left whitespace-pre-wrap", 
                             isAdmin 
                                ? "bg-primary text-primary-foreground rounded-tr-none" 
                                : "bg-muted border rounded-tl-none"
                          )}
                        >
                           <div dangerouslySetInnerHTML={{ __html: msg.message }} />
                           {msg.file_url && (
                              <a 
                                 href={msg.file_url} 
                                 target="_blank" 
                                 rel="noreferrer"
                                 className={cn("flex items-center gap-2 mt-2 p-2 rounded bg-background/20 text-xs border border-white/20 hover:bg-background/30 transition", isAdmin ? "text-white" : "text-foreground")}
                              >
                                 <FileText className="h-3 w-3" /> Attachment
                              </a>
                           )}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>

         {/* Reply Area */}
         <div className="p-4 border-t bg-background">
            <MessageReplyForm 
               ticketId={ticket.id} 
               userId={adminUser.id} 
               onReplySent={() => {
                  fetchMessages();
                  if (scrollRef.current) {
                     scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                  }
               }} 
            />
         </div>
      </div>

      {/* Right Column: Meta & Actions */}
      <div className="space-y-6 overflow-y-auto pr-1">
         {/* Controls */}
         <div className="bg-card border rounded-xl p-4 shadow-sm space-y-4">
            <h3 className="font-semibold text-sm">Ticket Controls</h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <Select value={ticket.status} onValueChange={handleStatusChange}>
                     <SelectTrigger>
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Priority</label>
                  <Select value={ticket.priority} onValueChange={handlePriorityChange}>
                     <SelectTrigger>
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            </div>
            
            {ticket.status !== 'Resolved' && (
               <Button className="w-full" variant="outline" onClick={() => handleStatusChange('Resolved')}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Mark as Resolved
               </Button>
            )}
         </div>

         {/* User Info */}
         <div className="bg-card border rounded-xl p-4 shadow-sm space-y-4">
            <h3 className="font-semibold text-sm">Customer Details</h3>
            <div className="flex items-center gap-3">
               <Avatar className="h-12 w-12 border">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>{user.first_name?.[0]}</AvatarFallback>
               </Avatar>
               <div>
                  <div className="font-medium">{user.first_name} {user.last_name}</div>
                  <div className="text-xs text-muted-foreground">Customer</div>
               </div>
            </div>
            <div className="space-y-2 text-sm">
               <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{user.email || 'No email visible'}</span>
               </div>
               <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {format(new Date(user.created_at || new Date()), 'MMM yyyy')}</span>
               </div>
            </div>
            <Button variant="secondary" size="sm" className="w-full">View Full Profile</Button>
         </div>

         {/* Internal Notes */}
         <AdminNotes ticketId={ticket.id} />
      </div>
    </div>
  );
};

export default MessageDetail;