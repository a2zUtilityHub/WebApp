import React from 'react';
import NotificationItem from './NotificationItem';
import EmptyNotificationsState from './EmptyNotificationsState';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NotificationsList = ({ 
  notifications, 
  loading, 
  error, 
  isOffline,
  onMarkRead, 
  onDelete, 
  onRetry,
  page,
  setPage,
  totalCount
}) => {
  if (loading && (!notifications || notifications.length === 0)) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 p-4 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-3 py-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && (!notifications || notifications.length === 0)) {
    return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Notifications</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-3 items-start">
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={onRetry}>Try Again</Button>
          </AlertDescription>
        </Alert>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <>
        {isOffline && (
          <div className="mb-4 flex items-center justify-center p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm border border-yellow-200">
            <WifiOff className="h-4 w-4 mr-2" /> You are currently offline.
          </div>
        )}
        <EmptyNotificationsState />
      </>
    );
  }

  const totalPages = Math.ceil(totalCount / 20) || 1;

  return (
    <div className="space-y-4">
      {isOffline && (
        <div className="mb-4 flex items-center justify-center p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm border border-yellow-200">
          <WifiOff className="h-4 w-4 mr-2" /> You are currently offline. Showing cached notifications.
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
            <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkRead={onMarkRead}
                onDelete={onDelete}
            />
        ))}
      </AnimatePresence>
      
      {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p-1))} 
                disabled={page === 1 || loading}
              >
                  Previous
              </Button>
              <span className="flex items-center text-sm text-muted-foreground px-2">
                  Page {page} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.min(totalPages, p+1))} 
                disabled={page === totalPages || loading}
              >
                  Next
              </Button>
          </div>
      )}
    </div>
  );
};

export default NotificationsList;