import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge, PriorityBadge } from './AdminTicketBadges';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, MessageSquare, Check, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

const AdminTicketsList = ({ tickets, onSelect, loading, onMarkAsResolved, onDelete }) => {
  if (loading) {
     return <div className="p-8 text-center text-muted-foreground">Loading tickets...</div>;
  }

  if (tickets.length === 0) {
    return <div className="p-16 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">No tickets found matching your criteria.</div>;
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[300px]">User & Subject</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => {
            const user = ticket.profiles || {};
            const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U';

            return (
              <TableRow 
                key={ticket.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors group"
                onClick={() => onSelect(ticket)}
              >
                <TableCell>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 mt-0.5 border">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                       <span className="font-medium text-sm text-foreground">
                         {user.first_name ? `${user.first_name} ${user.last_name}` : 'Unknown User'}
                       </span>
                       <span className="text-xs font-semibold text-primary/80 line-clamp-1">
                          {ticket.subject}
                       </span>
                       <span className="text-xs text-muted-foreground line-clamp-1">
                          #{ticket.id}
                       </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                   {ticket.support_categories?.name || 'General'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={ticket.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={ticket.priority} />
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                   {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                   <br />
                   {format(new Date(ticket.created_at), 'h:mm a')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelect(ticket)}>
                          <MessageSquare className="mr-2 h-4 w-4" /> View & Reply
                        </DropdownMenuItem>
                        {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                           <DropdownMenuItem onClick={() => onMarkAsResolved(ticket.id)}>
                              <Check className="mr-2 h-4 w-4" /> Mark Resolved
                           </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(ticket.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Ticket
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminTicketsList;