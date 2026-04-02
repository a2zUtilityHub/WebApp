
import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager';

const SortOptions = ({ sortBy, setSortBy }) => {
  const { pushEvent } = useGoogleTagManager();

  const handleSortChange = (val) => {
    pushEvent('sort_changed', { sort_value: val });
    setSortBy(val);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[160px] h-10 bg-card shadow-sm border-muted text-sm">
          <ArrowUpDown className="w-4 h-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default (Custom)</SelectItem>
          <SelectItem value="dueDate_asc">Due Date (Soonest)</SelectItem>
          <SelectItem value="dueDate_desc">Due Date (Latest)</SelectItem>
          <SelectItem value="priority_desc">Priority (High to Low)</SelectItem>
          <SelectItem value="title_asc">Title (A-Z)</SelectItem>
          <SelectItem value="created_desc">Newest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortOptions;
