
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

      <div className="bg-gradient-to-r from-brand-primary/10 via-transparent to-transparent p-6 rounded-xl border border-brand-primary/20 shadow-sm transition-all hover:shadow-md">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Infrastructure Management</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-2xl">Manage database schema, object storage, authentication mechanisms, and core backend configurations securely.</p>
      </div>

      <Tabs defaultValue="database" className="w-full">
        {/* Responsive wrapper for horizontal scroll on mobile */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="inline-flex min-w-full sm:grid sm:grid-cols-4 lg:grid-cols-7 h-auto p-1 mb-4 bg-muted/50 rounded-lg">
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
          <TabsTrigger value="suggestions" className="flex items-center gap-2 py-2 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
            <Lightbulb className="w-4 h-4 hidden sm:block text-yellow-500" /> AI Optimizer
          </TabsTrigger>
          </TabsList>
        </div>

        <div className="bg-card border-brand-primary/10 border rounded-xl p-4 sm:p-6 shadow-sm min-h-[500px] transition-shadow duration-300 hover:shadow-md">
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
