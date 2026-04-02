import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Trash2 } from 'lucide-react';
import PermissionCategorySelect from '../PermissionCategorySelect';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";

const EditPermissionModal = ({ permission, open, onOpenChange, onSubmit, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    if (permission) {
        setFormData({
            name: permission.name,
            category: permission.category,
            description: permission.description || ''
        });
    }
  }, [permission]);

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
          <DialogTitle>Edit Permission: {permission?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Permission Name <span className="text-red-500">*</span></Label>
                <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
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
                />
            </div>

            {permission?.used_by_count > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-sm text-yellow-800 dark:text-yellow-200">
                    Warning: This permission is currently used by <strong>{permission.used_by_count}</strong> roles.
                </div>
            )}

          <DialogFooter className="flex justify-between sm:justify-between w-full">
             <AlertDialog>
                <AlertDialogTrigger asChild>
                     <Button type="button" variant="destructive" disabled={permission?.used_by_count > 0}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                     </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Permission?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{permission?.name}</strong>? 
                            This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            onDelete(permission.id);
                            onOpenChange(false);
                        }} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPermissionModal;