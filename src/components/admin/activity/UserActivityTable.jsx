import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow, format } from 'date-fns';
import { ShieldAlert, Globe, Monitor, Smartphone, User } from 'lucide-react';

const UserActivityTable = ({ logs, loading }) => {
  if (loading) {
    return (
        <div className="space-y-2 border rounded-md p-4">
            <div className="flex justify-between mb-4">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[100px]" />
            </div>
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
    );
  }

  if (!logs || logs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 border rounded-md bg-muted/10 text-muted-foreground text-center">
            <ShieldAlert className="h-12 w-12 mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No activity logs found</h3>
            <p className="text-sm">Try adjusting your filters or search criteria.</p>
        </div>
      );
  }

  const getDeviceIcon = (deviceInfo) => {
      // Basic heuristic for icon
      if (!deviceInfo) return <Globe className="h-4 w-4" />;
      const os = deviceInfo?.os?.name?.toLowerCase() || '';
      if (os.includes('android') || os.includes('ios')) return <Smartphone className="h-4 w-4" />;
      return <Monitor className="h-4 w-4" />;
  };

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Timestamp</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead className="hidden md:table-cell">Device Info</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="hover:bg-muted/50">
              <TableCell className="whitespace-nowrap flex flex-col">
                  <span className="font-medium">{format(new Date(log.created_at), 'MMM d, yyyy')}</span>
                  <span className="text-xs text-muted-foreground">{format(new Date(log.created_at), 'HH:mm:ss')}</span>
              </TableCell>
              <TableCell>
                  <div className="flex flex-col">
                      <div className="flex items-center gap-1 font-medium">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {log.profiles?.email || 'Unknown User'}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">
                          {log.user_id}
                      </span>
                  </div>
              </TableCell>
              <TableCell>
                  <Badge variant="outline" className="capitalize bg-background">
                    {log.activity_type.replace(/_/g, ' ')}
                  </Badge>
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                  {log.ip_address}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {getDeviceIcon(log.device_info)}
                      <span title={JSON.stringify(log.device_info)}>
                        {log.device_info?.browser?.name || 'Unknown Browser'} on {log.device_info?.os?.name || 'Unknown OS'}
                      </span>
                  </div>
              </TableCell>
              <TableCell className="text-right">
                  <Badge 
                    variant={log.status === 'success' ? 'default' : 'destructive'}
                    className={log.status === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                      {log.status}
                  </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserActivityTable;