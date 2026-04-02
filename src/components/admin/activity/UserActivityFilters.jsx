import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RotateCcw, Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';

const UserActivityFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    activity_type: 'all',
    search: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
        activity_type: 'all',
        search: '',
        startDate: '',
        endDate: '',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="flex flex-col gap-4 mb-6 p-4 border rounded-lg bg-card shadow-sm">
       <div className="flex flex-col md:flex-row gap-4">
           <div className="flex-1 space-y-2">
                <Label htmlFor="search-logs">Search</Label>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="search-logs"
                        placeholder="Search IP Address..." 
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        className="pl-8"
                    />
                </div>
           </div>
           
           <div className="w-full md:w-[200px] space-y-2">
                <Label>Activity Type</Label>
                <Select value={filters.activity_type} onValueChange={(val) => handleChange('activity_type', val)}>
                    <SelectTrigger><SelectValue placeholder="All Activities" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Activities</SelectItem>
                        <SelectItem value="login">Login</SelectItem>
                        <SelectItem value="logout">Logout</SelectItem>
                        <SelectItem value="failed_login">Failed Login</SelectItem>
                        <SelectItem value="password_change">Password Change</SelectItem>
                        <SelectItem value="update_profile">Profile Update</SelectItem>
                    </SelectContent>
                </Select>
           </div>
       </div>

       <div className="flex flex-col md:flex-row gap-4 items-end">
           <div className="space-y-2 flex-1">
                <Label>Start Date</Label>
                <Input 
                    type="date" 
                    value={filters.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                />
           </div>
           <div className="space-y-2 flex-1">
                <Label>End Date</Label>
                <Input 
                    type="date" 
                    value={filters.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                />
           </div>
           <Button variant="outline" onClick={handleReset} className="mb-[2px]">
               <RotateCcw className="h-4 w-4 mr-2" /> Reset
           </Button>
       </div>
    </div>
  );
};

export default UserActivityFilters;