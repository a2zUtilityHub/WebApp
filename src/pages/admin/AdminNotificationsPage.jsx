import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Plus, RefreshCw, Send } from 'lucide-react';
import NotificationTypesTable from '@/components/admin/notifications/NotificationTypesTable';
import NotificationRecipientsTable from '@/components/admin/notifications/NotificationRecipientsTable';
import AddRecipientModal from '@/components/admin/notifications/AddRecipientModal';
import NotificationsList from '@/components/admin/notifications/NotificationsList';
import NotificationFilters from '@/components/admin/notifications/NotificationFilters';
import SendNotificationModal from '@/components/admin/notifications/SendNotificationModal';

import { useNotificationRecipients } from '@/hooks/useNotificationRecipients';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { useNotificationManagement } from '@/hooks/useNotificationManagement';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AdminNotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isAddRecipientOpen, setIsAddRecipientOpen] = useState(false);
  const [isSendNotificationOpen, setIsSendNotificationOpen] = useState(false);
  const { toast } = useToast();

  // Custom Hooks
  const { 
    addRecipient, 
    refetch: refetchRecipients, 
    error: recipientsError, 
    loading: recipientsLoading 
  } = useNotificationRecipients();

  const { 
    refetch: refetchSettings, 
    error: settingsError, 
    loading: settingsLoading 
  } = useNotificationSettings();

  const {
    fetchNotifications,
    sendNotification,
    deleteNotification,
    markAsRead,
    markAsUnread,
    bulkDelete,
    bulkMarkAsRead,
    loading: notificationsLoading,
    error: notificationsError
  } = useNotificationManagement();

  // State for Notifications List
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  const loadNotifications = useCallback(async () => {
    if (activeTab !== 'all') return;
    try {
      const { data, count } = await fetchNotifications({ page, limit: 20, filters });
      console.log('Notifications loaded:', data);
      setNotifications(data || []);
      setTotalPages(Math.ceil((count || 0) / 20));
    } catch (e) {
      console.error("Page Load Error for Notifications:", e);
    }
  }, [fetchNotifications, page, filters, activeTab]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleAddRecipient = async (email, settingIds) => {
    const result = await addRecipient(email, settingIds);
    if (result.success) {
        toast({ title: "Success", description: "Recipient added successfully." });
    }
    return result;
  };

  const handleRefresh = () => {
    console.log("Refreshing data for tab:", activeTab);
    if (activeTab === 'all') {
      loadNotifications();
    } else {
      refetchRecipients();
      refetchSettings();
    }
    toast({ title: "Refreshed", description: "Data updated." });
  };

  const handleSendNotification = async (data) => {
    const success = await sendNotification(data);
    if (success) loadNotifications();
    return success;
  };

  // Error handling summary
  const hasError = recipientsError || settingsError || notificationsError;
  const isLoading = (recipientsLoading || settingsLoading) && activeTab !== 'all';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Helmet><title>Notification Settings - Admin</title></Helmet>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
          <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bell className="h-6 w-6 text-primary" />
              </div>
              <div>
                  <h1 className="text-2xl font-bold">Notification Center</h1>
                  <p className="text-muted-foreground">Manage system alerts and user notifications.</p>
              </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={notificationsLoading || isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${notificationsLoading || isLoading ? 'animate-spin' : ''}`} />
                Refresh
            </Button>
            <Button onClick={() => setIsSendNotificationOpen(true)}>
                <Send className="mr-2 h-4 w-4" /> Send Notification
            </Button>
          </div>
      </div>
      
      {hasError && (
           <Alert variant="destructive">
              <AlertTitle>Error Loading Data</AlertTitle>
              <AlertDescription className="flex flex-col gap-1 mt-2">
                  {notificationsError && <span><strong>Notifications:</strong> {notificationsError}</span>}
                  {recipientsError && <span><strong>Recipients:</strong> {recipientsError}</span>}
                  {settingsError && <span><strong>Settings:</strong> {settingsError}</span>}
                  <Button variant="outline" size="sm" onClick={handleRefresh} className="w-fit mt-2 border-red-200 hover:bg-red-100">
                    Try Again
                  </Button>
              </AlertDescription>
           </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
              <TabsTrigger value="all">All Notifications</TabsTrigger>
              <TabsTrigger value="types">Notification Types</TabsTrigger>
              <TabsTrigger value="recipients">Email Recipients</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
              <NotificationFilters 
                filters={filters} 
                onFilterChange={(newFilters) => {
                  setFilters(newFilters);
                  setPage(1); // Reset to page 1 on filter change
                }}
                onReset={() => {
                  setFilters({ status: 'all', type: 'all', search: '', dateFrom: '', dateTo: '' });
                  setPage(1);
                }}
              />
              
              <NotificationsList 
                notifications={notifications}
                loading={notificationsLoading}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                onMarkRead={async (id) => { await markAsRead(id); loadNotifications(); }}
                onMarkUnread={async (id) => { await markAsUnread(id); loadNotifications(); }}
                onDelete={async (id) => { await deleteNotification(id); loadNotifications(); }}
                onBulkRead={bulkMarkAsRead}
                onBulkDelete={bulkDelete}
                refresh={loadNotifications}
              />
          </TabsContent>

          <TabsContent value="types">
              <Card>
                  <CardHeader>
                      <CardTitle>System Triggers</CardTitle>
                      <CardDescription>Manage which system events trigger email notifications to admins.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      {isLoading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
                      ) : (
                        <NotificationTypesTable />
                      )}
                  </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="recipients">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                      <div className="space-y-1">
                          <CardTitle>Recipients</CardTitle>
                          <CardDescription>Who receives system email notifications.</CardDescription>
                      </div>
                      <Button onClick={() => setIsAddRecipientOpen(true)} variant="secondary">
                          <Plus className="mr-2 h-4 w-4" /> Add Recipient
                      </Button>
                  </CardHeader>
                  <CardContent>
                       {isLoading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
                      ) : (
                        <NotificationRecipientsTable />
                      )}
                  </CardContent>
              </Card>
          </TabsContent>
      </Tabs>

      <AddRecipientModal 
          open={isAddRecipientOpen} 
          onOpenChange={setIsAddRecipientOpen}
          onSubmit={handleAddRecipient}
      />

      <SendNotificationModal
          open={isSendNotificationOpen}
          onOpenChange={setIsSendNotificationOpen}
          onSend={handleSendNotification}
      />
    </div>
  );
};

export default AdminNotificationsPage;