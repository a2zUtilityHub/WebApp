import React, { useState, useEffect } from 'react';
import { useSupport } from '@/hooks/useSupport';
import { StatusBadge, PriorityBadge } from './SupportTicketBadges';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Loader2, ArrowUpDown, Filter, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const SupportTicketsList = ({ onTicketSelect }) => {
  const { getTickets, loading } = useSupport();
  const [tickets, setTickets] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    searchQuery: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const fetchTickets = async () => {
    const { tickets, count } = await getTickets({ ...filters, page });
    setTickets(tickets || []);
    setTotalCount(count || 0);
  };

  useEffect(() => {
    const timeout = setTimeout(fetchTickets, 300);
    return () => clearTimeout(timeout);
  }, [filters, page]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
     setFilters({
        status: 'all',
        priority: 'all',
        searchQuery: '',
        sortBy: 'created_at',
        sortOrder: 'desc'
     });
     setPage(1);
  };

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by subject or ID..." 
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        
        <Select value={filters.status} onValueChange={(val) => handleFilterChange('status', val)}>
          <SelectTrigger className="bg-background">
             <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
             </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.priority} onValueChange={(val) => handleFilterChange('priority', val)}>
          <SelectTrigger className="bg-background">
             <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden min-h-[400px]">
         {loading && tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
               <p className="text-muted-foreground">Loading tickets...</p>
            </div>
         ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center p-8">
               <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                  <Search className="h-6 w-6 text-muted-foreground" />
               </div>
               <div>
                  <h3 className="text-lg font-medium">No tickets found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or create a new ticket.</p>
               </div>
               <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <Table>
                  <TableHeader>
                     <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead className="min-w-[200px]">Subject</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="text-right">Created</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {tickets.map((ticket) => (
                        <TableRow 
                           key={ticket.id} 
                           className="cursor-pointer hover:bg-muted/50 transition-colors"
                           onClick={() => onTicketSelect(ticket.id)}
                        >
                           <TableCell className="font-mono text-xs text-muted-foreground">#{ticket.id}</TableCell>
                           <TableCell className="font-medium text-foreground">{ticket.subject}</TableCell>
                           <TableCell>{ticket.support_categories?.name || 'General'}</TableCell>
                           <TableCell><StatusBadge status={ticket.status} /></TableCell>
                           <TableCell><PriorityBadge priority={ticket.priority} /></TableCell>
                           <TableCell className="text-right text-muted-foreground text-sm">
                              {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
         <Pagination>
            <PaginationContent>
               <PaginationItem>
                  <PaginationPrevious 
                     onClick={() => setPage(p => Math.max(1, p - 1))} 
                     className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
               </PaginationItem>
               {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                     <PaginationLink 
                        isActive={page === i + 1}
                        onClick={() => setPage(i + 1)}
                        className="cursor-pointer"
                     >
                        {i + 1}
                     </PaginationLink>
                  </PaginationItem>
               ))}
               <PaginationItem>
                  <PaginationNext 
                     onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                     className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
               </PaginationItem>
            </PaginationContent>
         </Pagination>
      )}
    </div>
  );
};

export default SupportTicketsList;