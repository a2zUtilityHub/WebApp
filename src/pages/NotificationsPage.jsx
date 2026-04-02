import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useUserNotifications } from '@/hooks/useUserNotifications';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import NotificationsList from '@/components/notifications/NotificationsList';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCheck, Trash2, Loader2, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const { authReady, user } = useAuth();
  
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    totalCount, 
    isOffline,
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    deleteAllNotifications
  } = useUserNotifications();

  useEffect(() => {
    if (authReady && user) {
        fetchNotifications(page, filter);
    }
  }, [fetchNotifications, page, filter, authReady, user]);

  if (!authReady) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] w-full">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
    );
  }

  if (!user) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] gap-4 w-full px-4 text-left">
             <div className="space-y-2 max-w-md">
                <h2 className="text-gray-900">Sign in required</h2>
                <p className="text-gray-600">Please sign in to view your notifications.</p>
             </div>
             <Button asChild className="bg-brand-primary text-white hover:bg-brand-secondary">
                <Link to="/auth?mode=login">Sign In</Link>
             </Button>
        </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet>
        <title>Notifications - a2z Utility Hub</title>
      </Helmet>
      
      <div className="w-full bg-[#F9FAFB] border-b border-gray-200 py-16 px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="content-container text-left">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h1 className="flex items-center gap-3 text-[#1F2937]">
                Your Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-brand-primary text-white rounded-full px-2 py-0.5 text-xs">
                    {unreadCount} New
                  </Badge>
                )}
              </h1>
              <p className="text-[#4B5563] mt-2 text-lg">
                Stay updated with important alerts and activities.
              </p>
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                onClick={markAllAsRead} 
                disabled={unreadCount === 0 || loading || isOffline}
              >
                <CheckCheck className="mr-2 h-4 w-4" /> Mark all read
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white text-red-600 border-gray-300 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                onClick={deleteAllNotifications}
                disabled={(!notifications || notifications.length === 0) || loading || isOffline}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear all
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="full-width-section bg-white min-h-[50vh]">
        <div className="content-container max-w-4xl mx-0 lg:mx-auto">
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                 <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                   <Filter className="h-4 w-4" />
                   Filter by:
                 </div>
                 <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-[150px] bg-white text-gray-900 border-gray-300">
                      <SelectValue placeholder="All Notifications" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="unread">Unread Only</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              
              <div className="text-gray-800">
                <NotificationsList 
                  notifications={notifications}
                  loading={loading}
                  error={error}
                  isOffline={isOffline}
                  onMarkRead={markAsRead}
                  onDelete={deleteNotification}
                  onRetry={() => fetchNotifications(page, filter)}
                  page={page}
                  setPage={setPage}
                  totalCount={totalCount}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationsPage;