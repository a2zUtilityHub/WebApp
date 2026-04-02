import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, AlertCircle, Calendar, FileText } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase() || 'inactive';
  const styles = {
    active: "bg-green-100 text-green-800 border-green-200",
    inactive: "bg-gray-100 text-gray-800 border-gray-200",
    terminated: "bg-red-100 text-red-800 border-red-200",
    "on-leave": "bg-yellow-100 text-yellow-800 border-yellow-200"
  };
  
  return (
    <Badge variant="outline" className={cn("capitalize", styles[normalized])}>
      {status}
    </Badge>
  );
};

export const LeaveStatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase() || 'pending';
  const styles = {
    approved: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    cancelled: "bg-gray-100 text-gray-800 border-gray-200"
  };
  
  const icons = {
    approved: CheckCircle,
    pending: Clock,
    rejected: XCircle,
    cancelled: XCircle
  };
  const Icon = icons[normalized] || Clock;

  return (
    <Badge variant="outline" className={cn("capitalize gap-1", styles[normalized])}>
      <Icon className="w-3 h-3" /> {status}
    </Badge>
  );
};

export const AttendanceStatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase() || 'absent';
  const styles = {
    present: "bg-green-100 text-green-800 border-green-200",
    absent: "bg-red-100 text-red-800 border-red-200",
    late: "bg-orange-100 text-orange-800 border-orange-200",
    "half-day": "bg-blue-100 text-blue-800 border-blue-200",
    holiday: "bg-purple-100 text-purple-800 border-purple-200"
  };

  return (
    <Badge variant="outline" className={cn("capitalize", styles[normalized])}>
      {status}
    </Badge>
  );
};

export const DocumentStatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase() || 'valid';
  const styles = {
    valid: "bg-green-100 text-green-800",
    expired: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800"
  };

  return (
    <Badge variant="outline" className={cn("capitalize", styles[normalized])}>
      {status}
    </Badge>
  );
};