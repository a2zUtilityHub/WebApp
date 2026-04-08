import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import AdminSupportDashboard from '@/components/admin/support/AdminSupportDashboard';
import AdminTicketsList from '@/components/admin/support/AdminTicketsList';
import AdminTicketDetail from '@/components/admin/support/AdminTicketDetail';
import AdminTicketFilters from '@/components/admin/support/AdminTicketFilters';
import AdminTicketSearch from '@/components/admin/support/AdminTicketSearch';
import AdminMessagingSettingsPage from '@/pages/admin/AdminMessagingSettingsPage';
import { LayoutDashboard, Ticket, Settings2 } from 'lucide-react';

const AdminSupportPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category_id: '',
    sort: 'created_at_desc'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'tickets' && !selectedTicket) {
      fetchTickets();
    }
  }, [activeTab, filters, searchQuery, selectedTicket]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // 1. Fetch Tickets
      let query = supabase.from('support_tickets').select('*');

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.priority) query = query.eq('priority', filters.priority);
      if (filters.category_id) query = query.eq('category_id', filters.category_id);
      
      if (searchQuery) {
        if (!isNaN(searchQuery) && searchQuery.trim() !== '') {
            query = query.or(`subject.ilike.%${searchQuery}%,id.eq.${searchQuery}`);
        } else {
            query = query.ilike('subject', `%${searchQuery}%`);
        }
      }

      // Sorting
      // Fixed: changed 'created' to 'created_at' to match DB column
      const [column, direction] = filters.sort.split('_');
      const isAsc = direction === 'asc';
      
      // Map sort keys if necessary, though 'created_at' usually comes in as such from filter defaults
      let sortCol = column;
      if (column === 'created') sortCol = 'created_at';
      
      if (sortCol) {
         query = query.order(sortCol, { ascending: isAsc });
      }

      const { data: ticketsData, error: ticketError } = await query;
      if (ticketError) throw ticketError;

      if (!ticketsData || ticketsData.length === 0) {
        setTickets([]);
        setLoading(false);
        return;
      }

      // 2. Fetch Users manually to avoid relationship issues
      const userIds = [...new Set(ticketsData.map(t => t.user_id).filter(Boolean))];
      let userMap = {};
      if (userIds.length > 0) {
        const { data: usersData, error: userError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, avatar_url, role_id, created_at')
          .in('id', userIds);
        
        if (userError) throw userError;
        usersData.forEach(u => userMap[u.id] = u);
      }

      // 3. Fetch Categories manually
      const categoryIds = [...new Set(ticketsData.map(t => t.category_id).filter(Boolean))];
      let catMap = {};
      if (categoryIds.length > 0) {
          const { data: catData, error: catError } = await supabase
              .from('support_categories')
              .select('id, name')
              .in('id', categoryIds);
          
          if (catError) throw catError; 
          if (catData) {
              catData.forEach(c => catMap[c.id] = c);
          }
      }

      // 4. Merge Data
      const mergedTickets = ticketsData.map(ticket => ({
        ...ticket,
        profiles: userMap[ticket.user_id] || {},
        support_categories: catMap[ticket.category_id] || { name: 'Uncategorized' }
      }));

      setTickets(mergedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({ title: 'Error loading tickets', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setActiveTab('tickets'); // Keep context
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
    fetchTickets(); // Refresh list to update status changes
  };

  const handleMarkResolved = async (id) => {
    const { error } = await supabase.from('support_tickets').update({ status: 'Resolved' }).eq('id', id);
    if (!error) {
       toast({ title: 'Ticket marked as resolved' });
       fetchTickets();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) return;
    const { error } = await supabase.from('support_tickets').delete().eq('id', id);
    if (!error) {
       toast({ title: 'Ticket deleted successfully' });
       fetchTickets();
       if (selectedTicket?.id === id) setSelectedTicket(null);
    } else {
       toast({ title: 'Error deleting ticket', variant: 'destructive' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Support Center | Admin Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Header Section */}
        {!selectedTicket && (
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                 <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Ticket className="w-8 h-8 text-primary" /> Support Center
                 </h1>
                 <p className="text-muted-foreground mt-1">Manage customer inquiries and support tickets efficiently.</p>
              </div>
           </div>
        )}

        {/* Main Content */}
        {selectedTicket ? (
           <AdminTicketDetail 
              ticket={selectedTicket} 
              onBack={handleBackToList} 
              onUpdate={handleBackToList} 
           />
        ) : (
           <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-muted/50 border border-border/50 p-1 rounded-xl">
                 <TabsTrigger value="overview" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><LayoutDashboard className="h-4 w-4"/> Overview</TabsTrigger>
                 <TabsTrigger value="tickets" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><Ticket className="h-4 w-4"/> All Tickets</TabsTrigger>
                 <TabsTrigger value="settings" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><Settings2 className="h-4 w-4"/> Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
                 <AdminSupportDashboard />
              </TabsContent>

              <TabsContent value="tickets" className="space-y-6 focus-visible:outline-none">
                 <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5 space-y-5 overflow-hidden transition-all">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                       <AdminTicketSearch onSearch={setSearchQuery} />
                       <AdminTicketFilters 
                          filters={filters} 
                          onChange={setFilters} 
                          onReset={() => setFilters({ status: '', priority: '', category_id: '', sort: 'created_at_desc' })} 
                       />
                    </div>
                    <AdminTicketsList 
                       tickets={tickets} 
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

export default AdminSupportPage;