
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Users, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager';

export const RoleManagement = () => {
  const { toast } = useToast();
  const { pushEvent } = useGoogleTagManager();

  const roles = [
    { name: 'Admin', desc: 'Full access to all settings, billing, and team management.', perms: { create: true, edit: true, delete: true, manageTeam: true } },
    { name: 'Manager', desc: 'Can manage tasks and projects, but cannot alter billing.', perms: { create: true, edit: true, delete: true, manageTeam: false } },
    { name: 'Member', desc: 'Standard access to assigned tasks and public projects.', perms: { create: true, edit: true, delete: false, manageTeam: false } },
    { name: 'Viewer', desc: 'Read-only access to specific projects.', perms: { create: false, edit: false, delete: false, manageTeam: false } },
  ];

  const handleEditRole = (roleName) => {
    pushEvent('role_edit_initiated', { role_name: roleName });
    toast({title: "Edit Role", description: `Editing permissions for ${roleName}`});
  };

  const handleCreateRole = () => {
    pushEvent('role_create_initiated');
    toast({title: "🚧 New Role", description: "Custom role creation modal opening..."});
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-teal-600" />
            Roles & Permissions
          </h1>
          <p className="text-muted-foreground mt-2">Manage access control and define granular permissions for your workspace.</p>
        </div>
        <Button onClick={handleCreateRole}>
          Create Custom Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <Card key={role.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {role.name}
                <Users className="w-5 h-5 text-muted-foreground" />
              </CardTitle>
              <CardDescription>{role.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between text-sm border-b pb-2">
                  <span>Create Tasks</span>
                  {role.perms.create ? <Check className="w-4 h-4 text-green-500"/> : <X className="w-4 h-4 text-red-500"/>}
                </div>
                <div className="flex items-center justify-between text-sm border-b pb-2">
                  <span>Edit Projects</span>
                  {role.perms.edit ? <Check className="w-4 h-4 text-green-500"/> : <X className="w-4 h-4 text-red-500"/>}
                </div>
                <div className="flex items-center justify-between text-sm border-b pb-2">
                  <span>Delete Data</span>
                  {role.perms.delete ? <Check className="w-4 h-4 text-green-500"/> : <X className="w-4 h-4 text-red-500"/>}
                </div>
                <div className="flex items-center justify-between text-sm pb-2">
                  <span>Manage Team</span>
                  {role.perms.manageTeam ? <Check className="w-4 h-4 text-green-500"/> : <X className="w-4 h-4 text-red-500"/>}
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => handleEditRole(role.name)}>Edit Permissions</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
