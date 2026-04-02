import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

const TaskFilters = ({ filters, onChange, onClear }) => {
    // In a real app, options like Assignees and Projects would be dynamic props
    return (
        <div className="flex flex-wrap gap-2 items-center mb-4">
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={filters.status || 'all'} onValueChange={(v) => onChange('status', v === 'all' ? null : [v])}>
                <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>

            <Select value={filters.priority || 'all'} onValueChange={(v) => onChange('priority', v === 'all' ? null : [v])}>
                <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                </SelectContent>
            </Select>

             <Select value={filters.dueDate || 'all'} onValueChange={(v) => onChange('dueDate', v === 'all' ? null : v)}>
                <SelectTrigger className="h-8 w-[150px]">
                    <SelectValue placeholder="Due Date" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Any Date</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
            </Select>
            
            {(filters.status || filters.priority || filters.dueDate) && (
                <Button variant="ghost" size="sm" onClick={onClear} className="h-8 px-2">
                    <X className="h-4 w-4 mr-1" /> Clear
                </Button>
            )}
        </div>
    );
};

export default TaskFilters;