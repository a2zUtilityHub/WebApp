import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CheckCircle2, XCircle } from 'lucide-react';

const AuditLogDetails = ({ log }) => {
  const { changes, error_message, user_agent, ip_address } = log;

  return (
    <div className="p-4 bg-muted/30 rounded-md space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
            <span className="font-semibold text-muted-foreground">Log ID:</span> {log.id}
        </div>
        <div>
            <span className="font-semibold text-muted-foreground">Target ID:</span> {log.target_id || 'N/A'}
        </div>
        <div>
            <span className="font-semibold text-muted-foreground">IP Address:</span> {ip_address}
        </div>
        <div>
             <span className="font-semibold text-muted-foreground">User Agent:</span> <span className="truncate block" title={user_agent}>{user_agent}</span>
        </div>
        <div className="col-span-2">
             <span className="font-semibold text-muted-foreground">Status:</span> 
             <span className={`ml-2 inline-flex items-center ${log.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {log.status === 'success' ? <CheckCircle2 className="h-4 w-4 mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
                {log.status.toUpperCase()}
             </span>
        </div>
        {error_message && (
            <div className="col-span-2 bg-red-50 text-red-700 p-2 rounded border border-red-200">
                <strong>Error:</strong> {error_message}
            </div>
        )}
      </div>

      {changes && Object.keys(changes).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Changes Payload</h4>
            <div className="bg-slate-950 text-slate-50 p-3 rounded-md overflow-x-auto text-xs font-mono">
                <pre>{JSON.stringify(changes, null, 2)}</pre>
            </div>
          </div>
      )}
    </div>
  );
};

export default AuditLogDetails;