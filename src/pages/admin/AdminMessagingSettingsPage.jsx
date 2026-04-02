import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsAutoReply from '@/components/admin/messaging/settings/SettingsAutoReply';
import SettingsResponseTime from '@/components/admin/messaging/settings/SettingsResponseTime';
import SettingsCategoryManagement from '@/components/admin/messaging/settings/SettingsCategoryManagement';
import SettingsPrioritySettings from '@/components/admin/messaging/settings/SettingsPrioritySettings';
import SettingsStatusSettings from '@/components/admin/messaging/settings/SettingsStatusSettings';
import SettingsNotifications from '@/components/admin/messaging/settings/SettingsNotifications';
import SettingsTeamManagement from '@/components/admin/messaging/settings/SettingsTeamManagement';
import { MessageSquare, Clock, List, Flag, Activity, Bell, Users } from 'lucide-react';

const AdminMessagingSettingsPage = () => {
  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-2xl font-bold tracking-tight">Messaging Settings</h2>
          <p className="text-muted-foreground">Manage automated responses, SLA rules, categories and more.</p>
       </div>

       <Tabs defaultValue="auto-reply" className="w-full space-y-4">
          <TabsList className="flex flex-wrap h-auto p-1 bg-muted/50 gap-1 w-full justify-start overflow-x-auto">
             <TabsTrigger value="auto-reply" className="gap-2"><MessageSquare className="h-4 w-4"/> Auto-Reply</TabsTrigger>
             <TabsTrigger value="sla" className="gap-2"><Clock className="h-4 w-4"/> SLA & Response</TabsTrigger>
             <TabsTrigger value="categories" className="gap-2"><List className="h-4 w-4"/> Categories</TabsTrigger>
             <TabsTrigger value="priorities" className="gap-2"><Flag className="h-4 w-4"/> Priorities</TabsTrigger>
             <TabsTrigger value="statuses" className="gap-2"><Activity className="h-4 w-4"/> Statuses</TabsTrigger>
             <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4"/> Notifications</TabsTrigger>
             <TabsTrigger value="team" className="gap-2"><Users className="h-4 w-4"/> Team</TabsTrigger>
          </TabsList>

          <TabsContent value="auto-reply" className="focus-visible:outline-none">
             <SettingsAutoReply />
          </TabsContent>
          <TabsContent value="sla" className="focus-visible:outline-none">
             <SettingsResponseTime />
          </TabsContent>
          <TabsContent value="categories" className="focus-visible:outline-none">
             <SettingsCategoryManagement />
          </TabsContent>
          <TabsContent value="priorities" className="focus-visible:outline-none">
             <SettingsPrioritySettings />
          </TabsContent>
          <TabsContent value="statuses" className="focus-visible:outline-none">
             <SettingsStatusSettings />
          </TabsContent>
          <TabsContent value="notifications" className="focus-visible:outline-none">
             <SettingsNotifications />
          </TabsContent>
          <TabsContent value="team" className="focus-visible:outline-none">
             <SettingsTeamManagement />
          </TabsContent>
       </Tabs>
    </div>
  );
};

export default AdminMessagingSettingsPage;