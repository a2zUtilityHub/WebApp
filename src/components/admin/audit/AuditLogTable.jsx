import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import AuditLogDetails from './AuditLogDetails';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const AuditLogTable = ({ logs, loading }) => {
  const [expandedRows, setExpandedRows] = React.useState({});

  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
        <div className="flex justify-center p-8 border rounded-md">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (logs.length === 0) {
    return (
        <div className="text-center p-8 border rounded-md text-muted-foreground">
            No audit logs found matching your filters.
        </div>
    );
  }

  return (
    <div className="border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Admin User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <React.Fragment key={log.id}>
                <TableRow className={expandedRows[log.id] ? "bg-muted/50 border-b-0" : ""}>
                    <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toggleRow(log.id)}>
                            {expandedRows[log.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                        {format(new Date(log.created_at), "MMM d, HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col">
                            <span className="font-medium">{log.profiles?.email || 'System'}</span>
                            <span className="text-xs text-muted-foreground">{log.profiles?.first_name} {log.profiles?.last_name}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">{log.action}</Badge>
                    </TableCell>
                    <TableCell>
                        <span className="capitalize">{log.entity_type || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                            {log.status}
                        </Badge>
                    </TableCell>
                </TableRow>
                {expandedRows[log.id] && (
                    <TableRow>
                        <TableCell colSpan={6} className="p-0 border-t-0">
                            <div className="p-4 bg-muted/20">
                                <AuditLogDetails log={log} />
                            </div>
                        </TableCell>
                    </TableRow>
                )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditLogTable;