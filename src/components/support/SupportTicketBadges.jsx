import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle, Ban, Circle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || 'open';
  
  const styles = {
    open: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    'in progress': "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
    closed: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
  };

  const icons = {
    open: Circle,
    'in progress': Clock,
    resolved: CheckCircle2,
    closed: Ban
  };

  const Icon = icons[normalizedStatus] || Circle;

  return (
    <Badge variant="outline" className={cn("flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium capitalize", styles[normalizedStatus])}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </Badge>
  );
};

export const PriorityBadge = ({ priority }) => {
  const normalizedPriority = priority?.toLowerCase() || 'low';

  const styles = {
    low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-transparent",
    medium: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-100 dark:border-blue-900",
    high: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-100 dark:border-orange-900",
    urgent: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-100 dark:border-red-900"
  };

  return (
    <Badge variant="secondary" className={cn("capitalize font-normal", styles[normalizedPriority])}>
      {priority}
    </Badge>
  );
};