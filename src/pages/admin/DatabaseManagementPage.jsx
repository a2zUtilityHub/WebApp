
import React from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, HardDrive, ShieldAlert, Users, KeyRound, TerminalSquare, Lightbulb } from 'lucide-react';
import DatabaseTab from '@/components/admin/database/DatabaseTab';
import StorageTab from '@/components/admin/database/StorageTab';
import AuthenticationTab from '@/components/admin/database/AuthenticationTab';
import UsersTab from '@/components/admin/database/UsersTab';
import SecretsTab from '@/components/admin/database/SecretsTab';
import LogsTab from '@/components/admin/database/LogsTab';
import SuggestionsTab from '@/components/admin/database/SuggestionsTab';

const DatabaseManagementPage = () => {
  return (
    <div className="flex flex-col w-full h-full space-y-6 p-6">
      <Helmet>
        <title>Database Management | Admin Panel</title>
        <meta name="description" content="Manage database, storage, authentication, and system secrets." />
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Infrastructure Management</h1>
        <p className="text-muted-foreground mt-1">Manage database schema, object storage, and backend configurations.</p>
      </div>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full h-auto p-1 mb-6">
          <TabsTrigger value="database" className="flex items-center gap-2 py-2">
            <Database className="w-4 h-4 hidden sm:block" /> Database
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2 py-2">
            <HardDrive className="w-4 h-4 hidden sm:block" /> Storage
          </TabsTrigger>
          <TabsTrigger value="auth" className="flex items-center gap-2 py-2">
            <ShieldAlert className="w-4 h-4 hidden sm:block" /> Auth
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 py-2">
            <Users className="w-4 h-4 hidden sm:block" /> Users
          </TabsTrigger>
          <TabsTrigger value="secrets" className="flex items-center gap-2 py-2">
            <KeyRound className="w-4 h-4 hidden sm:block" /> Secrets
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2 py-2">
            <TerminalSquare className="w-4 h-4 hidden sm:block" /> Logs
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2 py-2">
            <Lightbulb className="w-4 h-4 hidden sm:block" /> AI Optimizer
          </TabsTrigger>
        </TabsList>

        <div className="bg-card border rounded-xl p-6 shadow-sm min-h-[500px]">
          <TabsContent value="database" className="m-0 border-0 p-0">
            <DatabaseTab />
          </TabsContent>
          <TabsContent value="storage" className="m-0 border-0 p-0">
            <StorageTab />
          </TabsContent>
          <TabsContent value="auth" className="m-0 border-0 p-0">
            <AuthenticationTab />
          </TabsContent>
          <TabsContent value="users" className="m-0 border-0 p-0">
            <UsersTab />
          </TabsContent>
          <TabsContent value="secrets" className="m-0 border-0 p-0">
            <SecretsTab />
          </TabsContent>
          <TabsContent value="logs" className="m-0 border-0 p-0">
            <LogsTab />
          </TabsContent>
          <TabsContent value="suggestions" className="m-0 border-0 p-0">
            <SuggestionsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DatabaseManagementPage;
