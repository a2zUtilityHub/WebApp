import React, { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Task Assigned', message: 'You were assigned to "Design DB schema"', read: false },
    { id: 2, title: 'Comment Mention', message: 'Alice mentioned you in "API Setup"', read: false }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 min-w-[18px] h-[18px] text-[10px] flex items-center justify-center rounded-full">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
              <Check className="w-3 h-3" /> Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`p-4 border-b border-border/50 text-sm hover:bg-muted/50 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-medium text-foreground mb-1">{n.title}</h5>
                    <p className="text-muted-foreground text-xs leading-relaxed">{n.message}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};