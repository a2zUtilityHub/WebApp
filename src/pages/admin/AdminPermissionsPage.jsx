import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Search, Edit2, Key, AlertTriangle } from 'lucide-react';
import AddPermissionModal from '@/components/admin/modals/AddPermissionModal';
import EditPermissionModal from '@/components/admin/modals/EditPermissionModal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminPermissionsPage = () => {
  const { permissions, loading, error, fetchPermissions, createPermission, updatePermission, deletePermission } = useAdminPermissions();
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPerm, setEditingPerm] = useState(null);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const filteredPermissions = permissions.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet><title>Permission Management - Admin</title></Helmet>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Key className="h-6 w-6" /> Permission Management
          </h1>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Permission
          </Button>
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error}
                    <Button variant="link" className="p-0 h-auto font-normal text-white ml-2 underline" onClick={fetchPermissions}>
                        Try Again
                    </Button>
                </AlertDescription>
            </Alert>
        )}

        <div className="flex items-center gap-2 max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search permissions..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && permissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredPermissions.length === 0 && !error ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">No permissions found.</TableCell>
                </TableRow>
              ) : (
                filteredPermissions.map((perm) => (
                  <TableRow key={perm.id}>
                    <TableCell className="font-mono text-sm font-medium">{perm.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {perm.category?.replace(/_/g, ' ') || 'Uncategorized'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm truncate max-w-[200px]" title={perm.description}>
                        {perm.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setEditingPerm(perm)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <AddPermissionModal 
            open={isAddOpen} 
            onOpenChange={setIsAddOpen} 
            onSubmit={createPermission} 
        />
        
        {editingPerm && (
            <EditPermissionModal 
                permission={editingPerm} 
                open={!!editingPerm} 
                onOpenChange={(open) => !open && setEditingPerm(null)}
                onSubmit={(data) => updatePermission(editingPerm.id, data)}
                onDelete={deletePermission}
            />
        )}
      </div>
    </>
  );
};

export default AdminPermissionsPage;