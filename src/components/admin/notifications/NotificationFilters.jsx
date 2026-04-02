import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

const NotificationFilters = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
      <div className="w-full md:w-1/3 relative">
        <Label htmlFor="search" className="sr-only">Search</Label>
        <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
            id="search"
            placeholder="Search by email, title, or message..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="pl-8"
            />
        </div>
      </div>

      <Select value={filters.status || 'all'} onValueChange={(val) => handleChange('status', val)}>
        <SelectTrigger className="w-full md:w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="read">Read</SelectItem>
          <SelectItem value="unread">Unread</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.type || 'all'} onValueChange={(val) => handleChange('type', val)}>
        <SelectTrigger className="w-full md:w-[150px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="alert">Alert</SelectItem>
          <SelectItem value="info">Info</SelectItem>
          <SelectItem value="promotional">Promotional</SelectItem>
        </SelectContent>
      </Select>
      
      <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Date Range
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Filter by Date</h4>
                    <p className="text-sm text-muted-foreground">Show notifications created within range.</p>
                </div>
                <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="from">From</Label>
                        <Input
                            id="from"
                            type="date"
                            className="col-span-2 h-8"
                            value={filters.dateFrom || ''}
                            onChange={(e) => handleChange('dateFrom', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="to">To</Label>
                        <Input
                            id="to"
                            type="date"
                            className="col-span-2 h-8"
                            value={filters.dateTo || ''}
                            onChange={(e) => handleChange('dateTo', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </PopoverContent>
      </Popover>

      <Button variant="ghost" onClick={onReset} className="w-full md:w-auto">
        <X className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  );
};

export default NotificationFilters;