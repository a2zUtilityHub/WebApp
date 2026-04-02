import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FolderTree } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';

const CategoryForm = ({ open, onOpenChange, initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({ name: '', slug: '', type: 'App', description: '' });
  
  useEffect(() => {
    if(open) {
        if(initialData) {
            setFormData({
                ...initialData,
                name: initialData.name || initialData.translations?.en?.name || '',
                description: initialData.description || initialData.translations?.en?.description || ''
            });
        } else {
            setFormData({ name: '', slug: '', type: 'App', description: '' });
        }
    }
  }, [open, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-xl">
         <DialogHeader className="p-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 border-b rounded-t-xl">
             <div className="flex items-center gap-3">
                 <FolderTree className="h-6 w-6 text-foreground" />
                 <DialogTitle className="text-xl font-bold">Category Manager</DialogTitle>
             </div>
         </DialogHeader>
         <form onSubmit={handleSubmit} className="p-6 space-y-4">
             <div className="space-y-2">
                <Label>Category Name</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
             </div>
             <div className="space-y-2">
                 <Label>Type</Label>
                 <Select value={formData.type} onValueChange={val => setFormData({...formData, type: val})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="App">App Category</SelectItem>
                        <SelectItem value="Blog">Blog Category</SelectItem>
                        <SelectItem value="Coupon">Coupon Category</SelectItem>
                    </SelectContent>
                 </Select>
             </div>
             <div className="space-y-2">
                 <Label>Slug</Label>
                 <Input value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="auto-generated" />
             </div>
             <div className="space-y-2">
                 <Label>Description</Label>
                 <RichTextEditor value={formData.description} onChange={val => setFormData({...formData, description: val})} />
             </div>
             <DialogFooter className="pt-2">
                 <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                 <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Category'}</Button>
             </DialogFooter>
         </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;