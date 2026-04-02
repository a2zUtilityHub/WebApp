import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Archive, Globe, Lock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || 'inactive';

  const styles = {
    active: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    inactive: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    archived: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
  };

  const icons = {
    active: CheckCircle,
    inactive: XCircle,
    archived: Archive
  };

  const Icon = icons[normalizedStatus] || XCircle;

  return (
    <Badge variant="outline" className={cn("flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium capitalize", styles[normalizedStatus])}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </Badge>
  );
};

export const VisibilityBadge = ({ visibility }) => {
  const normalizedVisibility = visibility?.toLowerCase() || 'private';

  const styles = {
    public: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    private: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800"
  };

  const icons = {
    public: Globe,
    private: Lock
  };

  const Icon = icons[normalizedVisibility] || Lock;

  return (
    <Badge variant="secondary" className={cn("flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium capitalize", styles[normalizedVisibility])}>
      <Icon className="w-3.5 h-3.5" />
      {visibility}
    </Badge>
  );
};

export const FeaturedBadge = ({ isFeatured }) => {
  if (!isFeatured) return null;
  
  return (
    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800 flex items-center gap-1">
      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> Featured
    </Badge>
  );
};