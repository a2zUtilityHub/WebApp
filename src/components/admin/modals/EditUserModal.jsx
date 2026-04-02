import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';

const EditUserModal = ({ user, open, onOpenChange, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    role_id: '',
    is_active: true
  });

  useEffect(() => {
    if (user) {
        setFormData({
            role_id: String(user.role_id || ''),
            is_active: user.is_active
        });
    }
    if (open) {
         const fetchRoles = async () => {
            const { data } = await supabase.from('roles').select('id, name');
            setRoles(data || []);
        };
        fetchRoles();
    }
  }, [user, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User: {user.email}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={formData.role_id} onValueChange={val => setFormData({...formData, role_id: val})}>
                <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                    {roles.map(role => (
                        <SelectItem key={role.id} value={String(role.id)}>{role.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label>Account Active</Label>
            <Switch 
                checked={formData.is_active} 
                onCheckedChange={val => setFormData({...formData, is_active: val})} 
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;