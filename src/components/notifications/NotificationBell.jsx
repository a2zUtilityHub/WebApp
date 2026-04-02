import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, Loader2, WifiOff } from 'lucide-react';
import { useUserNotifications } from '@/hooks/useUserNotifications';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    isOffline,
    markAsRead, 
    markAllAsRead 
  } = useUserNotifications();

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`You have ${unreadCount} unread notifications`}>
          <Bell className="h-5 w-5 text-gray-600 hover:text-gray-900" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 z-[100]">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            Notifications 
            {isOffline && <WifiOff className="h-3 w-3 text-muted-foreground" title="Offline mode" />}
          </span>
          {unreadCount > 0 && (
            <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading && notifications.length === 0 ? (
          <div className="py-4 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary/50" />
          </div>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem disabled className="text-center py-4">No new notifications</DropdownMenuItem>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 5).map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className={`flex items-start gap-3 cursor-pointer p-3 ${!notif.is_read ? 'bg-primary/5' : ''}`}
                onClick={() => {
                  if (!notif.is_read) markAsRead(notif.id);
                }}
              >
                <div className="mt-1 shrink-0">
                  {!notif.is_read && <span className="h-2 w-2 rounded-full bg-primary inline-block mr-2" />}
                  <MessageSquare className="h-4 w-4 text-muted-foreground inline-block" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-2">{notif.title || notif.data?.message || 'New notification'}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notif.created_at ? formatDistanceToNow(new Date(notif.created_at), { addSuffix: true }) : 'Recently'}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer justify-center text-primary font-medium p-2">
          <Link to="/notifications">View all notifications</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;