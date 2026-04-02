import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Loader2, User, Shield, Key, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RecentActivityFeed = () => {
  const { logs, fetchAuditLogs, loading } = useAuditLogs();
  
  useEffect(() => {
    fetchAuditLogs({}, 1, 5); // Fetch latest 5
  }, [fetchAuditLogs]);

  const getIcon = (type) => {
    if (type.includes('user')) return <User className="h-4 w-4" />;
    if (type.includes('role')) return <Shield className="h-4 w-4" />;
    if (type.includes('permission')) return <Key className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Admin Actions</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
        ) : (
            <div className="space-y-8">
                {logs.map((log) => (
                    <div key={log.id} className="flex items-start">
                        <div className="mt-1 mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted border">
                            {getIcon(log.action)}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {log.action.replace(/_/g, ' ')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                by <span className="font-semibold">{log.profiles?.email || 'System'}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                ))}
                {logs.length === 0 && <p className="text-sm text-muted-foreground">No recent activity.</p>}
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityFeed;