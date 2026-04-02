import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Loader2, Ticket } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { format } from 'date-fns';

const CouponForm = ({ open, onOpenChange, initialData, onSubmit, loading, categories, merchants }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
            ...initialData,
            title: initialData.title || initialData.translations?.en?.title || '',
            description: initialData.description || initialData.translations?.en?.description || '',
            expires_at: initialData.expires_at ? format(new Date(initialData.expires_at), "yyyy-MM-dd'T'HH:mm") : ''
        });
      } else {
        setFormData({
            title: '', description: '', code: '', deal_link: '', merchant_id: '', category_id: '',
            discount_value: '', type: 'coupon', status: 'published', is_verified: false, is_active: true,
            expires_at: ''
        });
      }
    }
  }, [open, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-xl">
         <DialogHeader className="p-6 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-b">
            <div className="flex items-center gap-3">
                <Ticket className="h-6 w-6 text-pink-600" />
                <DialogTitle className="text-xl font-bold">{initialData ? 'Edit Coupon' : 'New Coupon'}</DialogTitle>
            </div>
         </DialogHeader>
         <form onSubmit={handleSubmit} className="p-6 space-y-4">
             <div className="space-y-2">
                 <Label>Title *</Label>
                 <Input value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required />
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                     <Label>Merchant</Label>
                     <Select value={String(formData.merchant_id || '')} onValueChange={val => setFormData({...formData, merchant_id: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Merchant" /></SelectTrigger>
                        <SelectContent>
                            {merchants.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                        </SelectContent>
                     </Select>
                 </div>
                 <div className="space-y-2">
                     <Label>Category</Label>
                     <Select value={String(formData.category_id || '')} onValueChange={val => setFormData({...formData, category_id: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                        <SelectContent>
                            {categories.filter(c => c.type === 'Coupon').map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                        </SelectContent>
                     </Select>
                 </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                     <Label>Type</Label>
                     <Select value={formData.type} onValueChange={val => setFormData({...formData, type: val})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="coupon">Coupon Code</SelectItem>
                            <SelectItem value="deal">Direct Deal</SelectItem>
                        </SelectContent>
                     </Select>
                 </div>
                 <div className="space-y-2">
                     <Label>Discount (e.g. 50% OFF)</Label>
                     <Input value={formData.discount_value || ''} onChange={e => setFormData({...formData, discount_value: e.target.value})} />
                 </div>
             </div>
             {formData.type === 'coupon' && (
                 <div className="space-y-2">
                     <Label>Coupon Code</Label>
                     <Input value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="font-mono bg-muted/30" />
                 </div>
             )}
             {formData.type === 'deal' && (
                 <div className="space-y-2">
                     <Label>Deal Link</Label>
                     <Input value={formData.deal_link || ''} onChange={e => setFormData({...formData, deal_link: e.target.value})} />
                 </div>
             )}
             <div className="space-y-2">
                 <Label>Description</Label>
                 <RichTextEditor value={formData.description} onChange={val => setFormData({...formData, description: val})} />
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                     <Label>Expires At</Label>
                     <Input type="datetime-local" value={formData.expires_at || ''} onChange={e => setFormData({...formData, expires_at: e.target.value})} />
                 </div>
                 <div className="flex flex-col gap-2 pt-6">
                     <div className="flex items-center gap-2">
                         <Switch checked={formData.is_active} onCheckedChange={c => setFormData({...formData, is_active: c})} />
                         <Label>Active</Label>
                     </div>
                     <div className="flex items-center gap-2">
                         <Switch checked={formData.is_verified} onCheckedChange={c => setFormData({...formData, is_verified: c})} />
                         <Label>Verified</Label>
                     </div>
                 </div>
             </div>
             <DialogFooter className="pt-2">
                 <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                 <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Coupon'}</Button>
             </DialogFooter>
         </form>
      </DialogContent>
    </Dialog>
  );
};

export default CouponForm;