import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import PermissionCategorySelect from '../PermissionCategorySelect';

const AddPermissionModal = ({ open, onOpenChange, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'user_management',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name) return;

    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    onOpenChange(false);
    setFormData({ name: '', category: 'user_management', description: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Permission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Permission Name <span className="text-red-500">*</span></Label>
                <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. manage_users"
                    required
                />
            </div>
            
            <PermissionCategorySelect 
                value={formData.category}
                onChange={val => setFormData({...formData, category: val})}
            />

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    placeholder="Briefly describe what this permission allows..."
                />
            </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Permission
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPermissionModal;