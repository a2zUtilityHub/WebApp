import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';

const AddUserModal = ({ open, onOpenChange, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role_id: '',
    first_name: '',
    last_name: ''
  });

  useEffect(() => {
    if (open) {
        // Fetch roles
        const fetchRoles = async () => {
            const { data } = await supabase.from('roles').select('id, name').eq('is_enabled', true);
            setRoles(data || []);
        };
        fetchRoles();
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    onOpenChange(false);
    setFormData({ email: '', password: '', role_id: '', first_name: '', last_name: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select required onValueChange={val => setFormData({...formData, role_id: val})}>
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
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;