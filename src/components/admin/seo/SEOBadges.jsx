import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, Link2, AlertCircle } from 'lucide-react';

export const SEOStatusBadge = ({ status }) => {
  switch (status?.toLowerCase()) {
    case 'good':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Good</Badge>;
    case 'warning':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"><AlertTriangle className="w-3 h-3 mr-1" /> Warning</Badge>;
    case 'issue':
    case 'critical':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Issue</Badge>;
    default:
      return <Badge variant="outline" className="text-muted-foreground"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
  }
};

export const KeywordStatusBadge = ({ status }) => {
    return status === 'active' 
      ? <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"><Activity className="w-3 h-3 mr-1" /> Tracking</Badge>
      : <Badge variant="outline">Inactive</Badge>;
};

export const BacklinkTypeBadge = ({ type }) => {
    const isDofollow = type?.toLowerCase() === 'dofollow';
    return <Badge variant={isDofollow ? "default" : "secondary"} className="capitalize">{type}</Badge>;
};

export const AuditStatusBadge = ({ status }) => {
    if(status === 'completed') return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
    if(status === 'running') return <Badge className="bg-blue-500 animate-pulse">Running</Badge>;
    if(status === 'failed') return <Badge variant="destructive">Failed</Badge>;
    return <Badge variant="outline">{status}</Badge>;
};