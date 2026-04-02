import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import MessagingDashboard from '@/components/admin/messaging/MessagingDashboard';
import MessagesList from '@/components/admin/messaging/MessagesList';
import MessageDetail from '@/components/admin/messaging/MessageDetail';
import MessageFilters from '@/components/admin/messaging/MessageFilters';
import MessageSearch from '@/components/admin/messaging/MessageSearch';
import AdminMessagingSettingsPage from '@/pages/admin/AdminMessagingSettingsPage';
import { LayoutDashboard, MessageSquare, Settings } from 'lucide-react';

const AdminMessagingPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'messages' && !selectedTicket) {
      fetchMessages();
    }
  }, [activeTab, filters, searchQuery, selectedTicket]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      // 1. Fetch Tickets
      // Fixed: changed 'created' to 'created_at' in order clause
      let query = supabase.from('support_tickets').select('*').order('created_at', { ascending: false });

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.priority) query = query.eq('priority', filters.priority);
      
      if (searchQuery) {
        if (!isNaN(searchQuery) && searchQuery.trim() !== '') {
            query = query.or(`subject.ilike.%${searchQuery}%,id.eq.${searchQuery}`);
        } else {
            query = query.ilike('subject', `%${searchQuery}%`);
        }
      }

      const { data: ticketsData, error: ticketsError } = await query;
      if (ticketsError) throw ticketsError;

      if (!ticketsData || ticketsData.length === 0) {
        setMessages([]);
        setLoading(false);
        return;
      }

      // 2. Fetch Users
      const userIds = [...new Set(ticketsData.map(t => t.user_id).filter(Boolean))];
      let userMap = {};
      if (userIds.length > 0) {
         const { data: userData } = await supabase.from('profiles').select('id, first_name, last_name, email, avatar_url, role_id').in('id', userIds);
         if (userData) {
            userData.forEach(u => userMap[u.id] = u);
         }
      }

      // 3. Fetch Categories
      const catIds = [...new Set(ticketsData.map(t => t.category_id).filter(Boolean))];
      let catMap = {};
      if (catIds.length > 0) {
         const { data: catData } = await supabase.from('support_categories').select('id, name').in('id', catIds);
         if (catData) {
            catData.forEach(c => catMap[c.id] = c);
         }
      }

      // 4. Merge
      const merged = ticketsData.map(t => ({
         ...t,
         profiles: userMap[t.user_id] || {},
         support_categories: catMap[t.category_id] || { name: 'General' }
      }));

      setMessages(merged);

    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({ title: 'Error loading messages', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setActiveTab('messages'); // Ensure we stay on messages tab context visually
  };

  const handleBackToSafeList = () => {
    setSelectedTicket(null);
    fetchMessages(); // Refresh list to update status changes
  };

  const handleMarkResolved = async (id) => {
    const { error } = await supabase.from('support_tickets').update({ status: 'Resolved' }).eq('id', id);
    if (!error) {
       toast({ title: 'Ticket marked as resolved' });
       fetchMessages();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;
    const { error } = await supabase.from('support_tickets').delete().eq('id', id);
    if (!error) {
       toast({ title: 'Ticket deleted' });
       fetchMessages();
    } else {
       toast({ title: 'Error deleting ticket', variant: 'destructive' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Messaging Center | Admin Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Header Section */}
        {!selectedTicket && (
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                 <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                    Messaging Center
                 </h1>
                 <p className="text-muted-foreground mt-1">Manage support tickets and customer communications.</p>
              </div>
           </div>
        )}

        {/* Main Content */}
        {selectedTicket ? (
           <MessageDetail 
              ticket={selectedTicket} 
              onBack={handleBackToSafeList} 
              onUpdate={handleBackToSafeList} 
           />
        ) : (
           <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-card border p-1 rounded-lg">
                 <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="h-4 w-4"/> Overview</TabsTrigger>
                 <TabsTrigger value="messages" className="gap-2"><MessageSquare className="h-4 w-4"/> Messages</TabsTrigger>
                 <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4"/> Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
                 <MessagingDashboard />
              </TabsContent>

              <TabsContent value="messages" className="space-y-6 focus-visible:outline-none">
                 <div className="bg-card border rounded-xl p-4 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                       <MessageSearch onSearch={setSearchQuery} />
                       <MessageFilters 
                          filters={filters} 
                          onChange={setFilters} 
                          onReset={() => setFilters({ status: '', priority: '', category: '' })} 
                       />
                    </div>
                    <MessagesList 
                       messages={messages} 
                       loading={loading} 
                       onSelect={handleTicketSelect}
                       onMarkAsResolved={handleMarkResolved}
                       onDelete={handleDelete}
                    />
                 </div>
              </TabsContent>

              <TabsContent value="settings" className="focus-visible:outline-none">
                 <AdminMessagingSettingsPage />
              </TabsContent>
           </Tabs>
        )}
      </div>
    </>
  );
};

export default AdminMessagingPage;