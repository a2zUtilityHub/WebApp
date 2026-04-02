import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NotificationFilters = ({ filter, setFilter, type, setType }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 p-1 bg-muted/30 rounded-lg">
      <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'ghost'} 
            onClick={() => setFilter('all')}
            size="sm"
            className="rounded-md"
          >
            All Notifications
          </Button>
          <Button 
            variant={filter === 'unread' ? 'default' : 'ghost'} 
            onClick={() => setFilter('unread')}
            size="sm"
            className="rounded-md"
          >
            Unread Only
          </Button>
      </div>
      
      <div className="flex-1 sm:max-w-[200px]">
          <Select 
            value={type || "all"} 
            onValueChange={(val) => {
                setType(val === 'all' ? null : val);
                if(val !== 'all') setFilter('by_type');
            }}
          >
            <SelectTrigger className="h-9">
                <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="user_created">User Created</SelectItem>
                <SelectItem value="role_updated">Role Updated</SelectItem>
                <SelectItem value="permission_deleted">Permission Deleted</SelectItem>
                <SelectItem value="system_alert">System Alert</SelectItem>
            </SelectContent>
          </Select>
      </div>
    </div>
  );
};

export default NotificationFilters;