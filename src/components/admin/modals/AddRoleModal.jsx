import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import RolePermissionsSelect from '@/components/admin/RolePermissionsSelect';

const AddRoleModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setPermissions([]);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await onSave({ name, description, permission_ids: permissions });
      onClose();
    } catch (error) {
      console.error("Failed to create role", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSaving && !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="add-role-name">Role Name <span className="text-red-500">*</span></Label>
            <Input 
              id="add-role-name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Editor"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-role-desc">Description</Label>
            <Input 
              id="add-role-desc" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Brief description of the role's purpose"
            />
          </div>

          <div className="space-y-2 pt-2">
            <Label>Permissions</Label>
            <RolePermissionsSelect 
              selectedPermissions={permissions} 
              onChange={setPermissions} 
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving || !name.trim()}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleModal;