import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trash2, MailOpen, Mail, MoreHorizontal, ChevronLeft, ChevronRight 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const NotificationsList = ({ 
  notifications, 
  loading, 
  page, 
  totalPages, 
  onPageChange,
  onMarkRead,
  onMarkUnread,
  onDelete,
  onBulkRead,
  onBulkDelete,
  refresh
}) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(notifications.map(n => n.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const executeBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    
    if (action === 'read') {
      await onBulkRead(selectedIds);
    } else if (action === 'delete') {
      await onBulkDelete(selectedIds);
    }
    setSelectedIds([]);
    refresh();
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-muted p-2 rounded-md flex items-center justify-between px-4 animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium">{selectedIds.length} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => executeBulkAction('read')}>
              <MailOpen className="mr-2 h-4 w-4" /> Mark Read
            </Button>
            <Button size="sm" variant="destructive" onClick={() => executeBulkAction('delete')}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={notifications.length > 0 && selectedIds.length === notifications.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Notification</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                  No notifications found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((notification) => (
                <TableRow key={notification.id} className={cn(!notification.is_read && "bg-muted/30")}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedIds.includes(notification.id)}
                      onCheckedChange={(checked) => handleSelectOne(notification.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{notification.user?.email || 'Unknown'}</span>
                      <span className="text-xs text-muted-foreground">{notification.user?.first_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="flex flex-col gap-1">
                      <span className={cn("text-sm", !notification.is_read ? "font-bold" : "font-medium")}>
                        {notification.title}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">{notification.message}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{notification.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(notification.created_at), 'MMM d, HH:mm')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {notification.is_read ? (
                          <DropdownMenuItem onClick={() => onMarkUnread(notification.id)}>
                            <Mail className="mr-2 h-4 w-4" /> Mark Unread
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => onMarkRead(notification.id)}>
                            <MailOpen className="mr-2 h-4 w-4" /> Mark Read
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(notification.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm font-medium">
                Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;