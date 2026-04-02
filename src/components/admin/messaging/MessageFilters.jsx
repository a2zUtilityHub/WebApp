import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X } from 'lucide-react';

const MessageFilters = ({ filters, onChange, onReset }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value === 'all' ? '' : value });
  };

  const hasActiveFilters = filters.status || filters.priority || filters.category;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 mr-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filters:</span>
      </div>

      <Select value={filters.status || 'all'} onValueChange={(val) => handleChange('status', val)}>
        <SelectTrigger className="h-9 w-[130px] text-xs">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="Open">Open</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Resolved">Resolved</SelectItem>
          <SelectItem value="Closed">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.priority || 'all'} onValueChange={(val) => handleChange('priority', val)}>
        <SelectTrigger className="h-9 w-[130px] text-xs">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.category || 'all'} onValueChange={(val) => handleChange('category', val)}>
        <SelectTrigger className="h-9 w-[130px] text-xs">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="general">General</SelectItem>
          <SelectItem value="bug">Bug Report</SelectItem>
          <SelectItem value="feature">Feature Request</SelectItem>
          <SelectItem value="billing">Billing</SelectItem>
          <SelectItem value="account">Account</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="h-9 px-2 lg:px-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5 mr-2" />
          Reset
        </Button>
      )}
    </div>
  );
};

export default MessageFilters;