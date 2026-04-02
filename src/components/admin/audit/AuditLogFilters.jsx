import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subDays } from 'date-fns';
import { CalendarPlus as CalendarIcon, RotateCcw, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';

const AuditLogFilters = ({ onFilterChange, className }) => {
  const [filters, setFilters] = useState({
    search: '',
    action_type: 'all',
    entity_type: 'all',
    user_id: 'all',
    date_from: undefined,
    date_to: undefined
  });
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // Fetch admins for filter
    const fetchAdmins = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, roles!inner(name)')
        .in('roles.name', ['Super Admin', 'Admin']);
      setAdmins(data || []);
    };
    fetchAdmins();
  }, []);

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDatePreset = (preset) => {
    const today = new Date();
    let from;
    switch(preset) {
        case '24h': from = subDays(today, 1); break;
        case '7d': from = subDays(today, 7); break;
        case '30d': from = subDays(today, 30); break;
        default: from = undefined;
    }
    const newFilters = { ...filters, date_from: from, date_to: today };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaults = {
        search: '',
        action_type: 'all',
        entity_type: 'all',
        user_id: 'all',
        date_from: undefined,
        date_to: undefined
    };
    setFilters(defaults);
    onFilterChange(defaults);
  };

  return (
    <div className={cn("grid gap-4 p-4 border rounded-lg bg-card", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
            <Label>Search</Label>
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search details..." 
                    className="pl-8"
                    value={filters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                />
            </div>
        </div>

        {/* Action Type */}
        <div className="space-y-2">
            <Label>Action Type</Label>
            <Select value={filters.action_type} onValueChange={(val) => handleChange('action_type', val)}>
                <SelectTrigger>
                    <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="create_user">Create User</SelectItem>
                    <SelectItem value="update_user">Update User</SelectItem>
                    <SelectItem value="delete_user">Delete User</SelectItem>
                    <SelectItem value="create_role">Create Role</SelectItem>
                    <SelectItem value="update_role">Update Role</SelectItem>
                    <SelectItem value="delete_role">Delete Role</SelectItem>
                    <SelectItem value="create_permission">Create Permission</SelectItem>
                    <SelectItem value="update_permission">Update Permission</SelectItem>
                    <SelectItem value="delete_permission">Delete Permission</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* User */}
        <div className="space-y-2">
            <Label>Admin User</Label>
            <Select value={filters.user_id} onValueChange={(val) => handleChange('user_id', val)}>
                <SelectTrigger>
                    <SelectValue placeholder="All Admins" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Admins</SelectItem>
                    {admins.map(admin => (
                        <SelectItem key={admin.id} value={admin.id}>
                            {admin.email}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {/* Entity Type */}
        <div className="space-y-2">
            <Label>Entity Type</Label>
            <Select value={filters.entity_type} onValueChange={(val) => handleChange('entity_type', val)}>
                <SelectTrigger>
                    <SelectValue placeholder="All Entities" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="role">Role</SelectItem>
                    <SelectItem value="permission">Permission</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* Date Range Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="space-y-2 flex-1">
            <Label>Date Range</Label>
            <div className="flex gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !filters.date_from && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.date_from ? format(filters.date_from, "PPP") : <span>Pick start date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={filters.date_from} onSelect={(date) => handleChange('date_from', date)} initialFocus />
                    </PopoverContent>
                </Popover>
                <span className="self-center">to</span>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !filters.date_to && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.date_to ? format(filters.date_to, "PPP") : <span>Pick end date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={filters.date_to} onSelect={(date) => handleChange('date_to', date)} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleDatePreset('24h')}>Last 24h</Button>
            <Button variant="outline" size="sm" onClick={() => handleDatePreset('7d')}>Last 7d</Button>
            <Button variant="outline" size="sm" onClick={() => handleDatePreset('30d')}>Last 30d</Button>
            <Button variant="ghost" size="icon" onClick={resetFilters} title="Reset Filters">
                <RotateCcw className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogFilters;