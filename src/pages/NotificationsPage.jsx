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
        <div className="min-h-screen flex items-center justify-center bg-background w-full">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  if (!user) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden gap-6 w-full px-4 text-center">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
             <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-3xl p-10 shadow-2xl relative z-10 max-w-md w-full">
               <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-sm">
                  <Filter className="h-10 w-10 text-primary" />
               </div>
               <h2 className="text-3xl font-extrabold text-foreground mb-3">Sign in required</h2>
               <p className="text-muted-foreground text-lg mb-8">Please sign in to view and manage your account notifications securely.</p>
               <Button asChild className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-bold text-lg">
                  <Link to="/auth?mode=login">Sign In Now</Link>
               </Button>
             </div>
        </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-background pb-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <Helmet>
        <title>Notifications - a2z Utility Hub</title>
      </Helmet>
      
      <div className="w-full bg-gradient-to-b from-muted/30 to-background border-b border-border/50 py-16 px-4 md:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="content-container text-left">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h1 className="flex items-center gap-4 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                Your Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-[14px] shadow-sm animate-pulse">
                    {unreadCount} New
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground mt-3 text-lg font-medium">
                Stay updated with important alerts and activities.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 px-6 rounded-xl border-border/50 bg-background/60 backdrop-blur-sm text-foreground hover:bg-muted shadow-sm font-semibold"
                onClick={markAllAsRead} 
                disabled={unreadCount === 0 || loading || isOffline}
              >
                <CheckCheck className="mr-2 h-5 w-5" /> Mark all read
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 px-6 rounded-xl border-destructive/30 bg-destructive/5 backdrop-blur-sm text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 shadow-sm font-semibold"
                onClick={deleteAllNotifications}
                disabled={(!notifications || notifications.length === 0) || loading || isOffline}
              >
                <Trash2 className="mr-2 h-5 w-5" /> Clear all
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-12 relative z-10">
        <div className="content-container max-w-5xl mx-auto px-4">
          <Card className="border border-border/50 shadow-xl bg-background/60 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/40 to-primary"></div>
            <CardContent className="p-6 md:p-10 pt-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-border/50 gap-4">
                 <div className="flex items-center gap-3 text-[15px] text-foreground font-bold bg-muted/50 px-4 py-2 rounded-xl border border-border/50 shadow-sm">
                   <Filter className="h-5 w-5 text-primary" />
                   Filter by:
                 </div>
                 <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-full sm:w-[200px] h-12 bg-background/80 border-input text-foreground focus:ring-4 focus:ring-primary/10 hover:border-primary/50 shadow-sm rounded-xl transition-all font-semibold">
                      <SelectValue placeholder="All Notifications" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/50 bg-background/80 backdrop-blur-xl shadow-xl">
                      <SelectItem value="all" className="rounded-xl font-medium">All Notifications</SelectItem>
                      <SelectItem value="unread" className="rounded-xl font-medium">Unread Only</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              
              <div className="text-foreground">
              
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