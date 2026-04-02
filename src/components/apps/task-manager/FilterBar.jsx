
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager';

const FilterBar = ({ filters, setFilters, clearFilters }) => {
  const { trackFilterApplied } = useGoogleTagManager();
  const activeCount = filters.status.length + filters.priority.length + (filters.dueDate !== 'all' ? 1 : 0);

  const toggleArrayItem = (array, item) => {
    if (array.includes(item)) return array.filter(i => i !== item);
    return [...array, item];
  };

  const handleStatusChange = (status) => {
    trackFilterApplied({ filter_type: 'status', filter_value: status });
    setFilters(prev => ({ ...prev, status: toggleArrayItem(prev.status, status) }));
  };

  const handlePriorityChange = (pri) => {
    trackFilterApplied({ filter_type: 'priority', filter_value: pri });
    setFilters(prev => ({ ...prev, priority: toggleArrayItem(prev.priority, pri) }));
  };

  const handleDueDateChange = (val) => {
    trackFilterApplied({ filter_type: 'due_date', filter_value: val });
    setFilters(prev => ({ ...prev, dueDate: val }));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 border-muted shadow-sm gap-2 relative">
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeCount > 0 && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground ml-1 px-1.5 py-0 min-w-[20px] justify-center">
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <h4 className="font-semibold text-sm">Filters</h4>
            {activeCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-1 text-xs text-muted-foreground">
                <X className="w-3 h-3 mr-1" /> Clear
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-semibold uppercase">Status</Label>
            <div className="flex flex-col gap-2 mt-2">
              {['todo', 'inprogress', 'completed'].map(status => (
                <label key={status} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox 
                    checked={filters.status.includes(status)} 
                    onCheckedChange={() => handleStatusChange(status)}
                  />
                  {status === 'todo' ? 'To Do' : status === 'inprogress' ? 'In Progress' : 'Done'}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-semibold uppercase">Priority</Label>
            <div className="flex flex-col gap-2 mt-2">
              {['high', 'medium', 'low'].map(pri => (
                <label key={pri} className="flex items-center gap-2 text-sm cursor-pointer capitalize">
                  <Checkbox 
                    checked={filters.priority.includes(pri)} 
                    onCheckedChange={() => handlePriorityChange(pri)}
                  />
                  {pri}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-semibold uppercase">Due Date</Label>
            <Select value={filters.dueDate} onValueChange={handleDueDateChange}>
              <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Any time" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterBar;
