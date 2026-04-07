import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AddRoleModal from '@/components/admin/modals/AddRoleModal';
import EditRoleModal from '@/components/admin/modals/EditRoleModal';

const mockRoles = [
  { id: 1, name: 'Super Admin', description: 'Unrestricted access to all modules and settings.', users: 2, permissions: ['*'] },
  { id: 2, name: 'Admin', description: 'Full access except role management.', users: 5, permissions: ['manage:users', 'manage:content', 'manage:settings'] },
  { id: 3, name: 'Content Editor', description: 'Can manage apps, blogs, coupons.', users: 12, permissions: ['manage:content'] },
  { id: 4, name: 'Support Agent', description: 'Can view and reply to tickets.', users: 8, permissions: ['manage:support'] },
];

const AdminRolesPage = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [search, setSearch] = useState('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  
  const { toast } = useToast();

  const handleCreateRole = async (formData) => {
    const newRole = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      users: 0,
      permissions: formData.permission_ids || []
    };
    setRoles([...roles, newRole]);
    toast({ title: "Role created", description: `New role ${newRole.name} added successfully.` });
  };

  const handleSavePermissions = async (updatedRole) => {
    setRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
    toast({ title: "Role updated", description: `${updatedRole.name} permissions updated successfully.` });
  };

  const handleEditClick = (role) => {
    setEditingRole(role);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    const role = roles.find(r => r.id === id);
    if(role.name === 'Super Admin') {
        toast({ title: "Action Denied", description: "Cannot delete system default role.", variant: "destructive" });
        return;
    }
    setRoles(roles.filter(r => r.id !== id));
    toast({ title: "Role deleted", description: "The role has been permanently removed." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" /> Role Management
          </h1>
          <p className="text-muted-foreground mt-1">Define roles and granular permissions for staff.</p>
        </div>
        
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Create Custom Role
        </Button>
      </div>

      <Card className="border border-border shadow-sm overflow-hidden rounded-2xl bg-card">
        <CardHeader className="border-b pb-4 pt-5 px-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search roles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50 border-b">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-6 py-4 font-semibold">Role Name</TableHead>
                <TableHead className="py-4 font-semibold">Users</TableHead>
                <TableHead className="py-4 font-semibold w-1/2">Permissions</TableHead>
                <TableHead className="px-6 py-4 text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map((role) => (
                <TableRow key={role.id} className="border-b">
                  <TableCell className="px-6 py-4">
                    <div className="font-semibold text-foreground">{role.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{role.description}</div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="secondary" className="rounded-lg">{role.users}</Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {role.permissions.map(p => (
                        <span key={p} className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                          {p === '*' ? 'ALL PERMISSIONS' : p}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(role)} className="h-8 w-8 text-muted-foreground hover:text-blue-600 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(role.id)} className="h-8 w-8 text-muted-foreground hover:text-red-600 rounded-lg ml-1">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddRoleModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleCreateRole} 
      />

      <EditRoleModal
        isOpen={isEditModalOpen}
        role={editingRole}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSavePermissions}
      />
    </div>
  );
};

export default AdminRolesPage;