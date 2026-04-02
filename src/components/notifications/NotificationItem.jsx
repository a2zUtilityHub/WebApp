import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Check, Trash2, AlertTriangle, Shield, User, Info, MailOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const getIcon = (type) => {
  switch (type) {
    case 'user_created': return <User className="h-5 w-5 text-blue-500" />;
    case 'role_updated': return <Shield className="h-5 w-5 text-purple-500" />;
    case 'permission_deleted': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case 'system_alert': return <AlertTriangle className="h-5 w-5 text-red-500" />;
    default: return <Info className="h-5 w-5 text-gray-500" />;
  }
};

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  if (!notification || !notification.id) {
    return (
      <div className="flex items-center gap-2 p-4 text-red-500 bg-red-50 rounded-lg border border-red-100 mb-3">
        <AlertCircle className="h-5 w-5" />
        <span className="text-sm">Notification data unavailable.</span>
      </div>
    );
  }

  const title = notification.title || notification.data?.title || 'System Notification';
  const message = notification.message || notification.data?.message || 'No additional details provided.';
  const type = notification.type || notification.data?.type || 'info';
  const createdDate = notification.created_at ? new Date(notification.created_at) : new Date();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={cn(
        "group flex items-start gap-4 p-4 rounded-lg border mb-3 transition-all hover:shadow-md",
        notification.is_read ? "bg-card border-border/50" : "bg-primary/5 border-primary/20"
      )}
    >
      <div className={cn(
          "p-2 rounded-full shrink-0", 
          notification.is_read ? "bg-muted" : "bg-background shadow-sm"
      )}>
        {getIcon(type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
            <h4 className={cn("text-sm font-semibold truncate", !notification.is_read && "text-primary")}>
                {title}
            </h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(createdDate, { addSuffix: true })}
            </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{message}</p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity self-center sm:self-start">
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => onMarkRead(notification.id)}
            title={notification.is_read ? "Mark as unread" : "Mark as read"}
        >
            {notification.is_read ? <MailOpen className="h-4 w-4" /> : <Check className="h-4 w-4" />}
        </Button>
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(notification.id)}
            title="Delete"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default NotificationItem;