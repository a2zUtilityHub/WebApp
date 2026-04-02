import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Store } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';

const MerchantForm = ({ open, onOpenChange, initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (open) {
      setFormData(initialData || { name: '', website_url: '', logo_url: '', short_description: '', long_description: '', meta_title: '' });
    }
  }, [open, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.name) return;
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-xl">
         <DialogHeader className="p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b">
             <div className="flex items-center gap-3">
                 <Store className="h-6 w-6 text-emerald-600" />
                 <DialogTitle className="text-xl font-bold">{initialData ? 'Edit Merchant' : 'Add Merchant'}</DialogTitle>
             </div>
         </DialogHeader>
         <form onSubmit={handleSubmit} className="p-6 space-y-4">
             <div className="space-y-2">
                 <Label>Merchant Name</Label>
                 <Input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
             </div>
             <div className="space-y-2">
                 <Label>Website URL</Label>
                 <Input value={formData.website_url || ''} onChange={e => setFormData({...formData, website_url: e.target.value})} />
             </div>
             <div className="space-y-2">
                 <Label>Logo URL</Label>
                 <Input value={formData.logo_url || ''} onChange={e => setFormData({...formData, logo_url: e.target.value})} />
             </div>
             <div className="space-y-2">
                 <Label>Short Description</Label>
                 <Textarea value={formData.short_description || ''} onChange={e => setFormData({...formData, short_description: e.target.value})} />
             </div>
             <div className="space-y-2">
                 <Label>Detailed Description</Label>
                 <RichTextEditor value={formData.long_description} onChange={val => setFormData({...formData, long_description: val})} />
             </div>
             <div className="space-y-2 pt-2 border-t">
                 <Label>Meta Title (SEO)</Label>
                 <Input value={formData.meta_title || ''} onChange={e => setFormData({...formData, meta_title: e.target.value})} />
             </div>
             <DialogFooter className="pt-2">
                 <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                 <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Merchant'}</Button>
             </DialogFooter>
         </form>
      </DialogContent>
    </Dialog>
  );
};

export default MerchantForm;