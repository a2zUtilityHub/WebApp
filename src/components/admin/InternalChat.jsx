import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const InternalChat = () => {
  const { adminUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('internal_chat')
        .select('*, admin:admin_users(username)')
        .order('created_at', { ascending: true })
        .limit(100);
      if (!error) {
        setMessages(data);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel('internal-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'admin_schema', table: 'internal_chat' }, async (payload) => {
        const { data: adminData, error } = await supabase.from('admin_users').select('username').eq('id', payload.new.admin_id).single();
        if (!error) {
            setMessages((prev) => [...prev, { ...payload.new, admin: adminData }]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !adminUser) return;

    const { error } = await supabase
      .from('internal_chat')
      .insert({ admin_id: adminUser.id, message: newMessage });

    if (!error) {
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Team Chat</h3>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.admin_id === adminUser.id ? 'justify-end' : ''}`}>
              {msg.admin_id !== adminUser.id && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{msg.admin?.username?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg p-3 max-w-xs ${msg.admin_id === adminUser.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${msg.admin_id === adminUser.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {msg.admin?.username} - {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                </p>
              </div>
              {msg.admin_id === adminUser.id && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{adminUser.username?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default InternalChat;