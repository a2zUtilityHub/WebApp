import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X } from 'lucide-react';

const AdminTicketFilters = ({ filters, onChange, onReset }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('support_categories').select('id, name');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value === 'all' ? '' : value });
  };

  const hasActiveFilters = filters.status || filters.priority || filters.category_id;

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

      <Select value={filters.category_id || 'all'} onValueChange={(val) => handleChange('category_id', val)}>
        <SelectTrigger className="h-9 w-[130px] text-xs">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
             <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
          ))}
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

export default AdminTicketFilters;