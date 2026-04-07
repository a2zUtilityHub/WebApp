import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import RolePermissionsSelect from '@/components/admin/RolePermissionsSelect';

const EditRoleModal = ({ isOpen, role, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && role) {
      setName(role.name || '');
      setDescription(role.description || '');
      setPermissions(role.permissions || []);
    }
  }, [isOpen, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await onSave({ ...role, name, description, permissions });
      onClose();
    } catch (error) {
      console.error("Failed to save role", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSaving && !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle>Edit Role Permissions</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-role-name">Role Name <span className="text-red-500">*</span></Label>
            <Input 
              id="edit-role-name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Content Manager"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role-desc">Description</Label>
            <Input 
              id="edit-role-desc" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Role description"
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleModal;