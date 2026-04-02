import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Ban, 
  Circle,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || 'open';
  
  const styles = {
    open: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    unread: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
    replied: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    'in progress': "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    resolved: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    closed: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    read: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  };

  const icons = {
    open: AlertCircle,
    unread: AlertCircle,
    pending: Clock,
    replied: MessageSquare,
    'in progress': Clock,
    resolved: CheckCircle2,
    closed: Ban,
    read: Circle
  };

  const Icon = icons[normalizedStatus] || Circle;

  return (
    <Badge variant="outline" className={cn("flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium capitalize whitespace-nowrap", styles[normalizedStatus])}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </Badge>
  );
};

export const PriorityBadge = ({ priority }) => {
  const normalizedPriority = priority?.toLowerCase() || 'low';

  const styles = {
    low: "bg-green-50 text-green-700 border-green-100 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-900",
    high: "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900",
    urgent: "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
  };

  const icons = {
    low: Circle,
    medium: Clock,
    high: AlertTriangle,
    urgent: AlertCircle
  };

  const Icon = icons[normalizedPriority] || Circle;

  return (
    <Badge variant="secondary" className={cn("flex items-center gap-1.5 px-2.5 py-0.5 capitalize font-normal whitespace-nowrap", styles[normalizedPriority])}>
      <Icon className="w-3 h-3 opacity-70" />
      {priority}
    </Badge>
  );
};