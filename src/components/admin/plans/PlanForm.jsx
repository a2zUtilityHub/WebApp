import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const PlanForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    monthly_price: 0,
    yearly_price: 0,
    currency: 'USD',
    status: 'active',
    visibility: 'public',
    color: '#3b82f6',
    is_featured: false,
    ...initialData
  });

  useEffect(() => {
    if (initialData) {
       setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // Auto-generate slug from name if slug is empty
    if (key === 'name' && !initialData) {
       setFormData(prev => ({ 
          ...prev, 
          slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
       }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-1">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input 
                 id="name" 
                 required 
                 value={formData.name} 
                 onChange={(e) => handleChange('name', e.target.value)}
                 placeholder="e.g. Pro Plan"
              />
           </div>
           <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL friendly)</Label>
              <Input 
                 id="slug" 
                 required 
                 value={formData.slug} 
                 onChange={(e) => handleChange('slug', e.target.value)}
                 placeholder="pro-plan"
              />
           </div>
        </div>

        <div className="space-y-2">
           <Label htmlFor="description">Description</Label>
           <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of the plan..."
              rows={3}
           />
        </div>

        <div className="grid grid-cols-3 gap-4">
           <div className="space-y-2">
              <Label htmlFor="monthly_price">Monthly Price</Label>
              <Input 
                 id="monthly_price" 
                 type="number" 
                 min="0" 
                 step="0.01"
                 value={formData.monthly_price} 
                 onChange={(e) => handleChange('monthly_price', parseFloat(e.target.value))}
              />
           </div>
           <div className="space-y-2">
              <Label htmlFor="yearly_price">Yearly Price</Label>
              <Input 
                 id="yearly_price" 
                 type="number" 
                 min="0" 
                 step="0.01"
                 value={formData.yearly_price} 
                 onChange={(e) => handleChange('yearly_price', parseFloat(e.target.value))}
              />
           </div>
           <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(val) => handleChange('currency', val)}>
                 <SelectTrigger>
                    <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                 </SelectContent>
              </Select>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
                 <SelectTrigger>
                    <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                 </SelectContent>
              </Select>
           </div>
           <div className="space-y-2">
              <Label>Visibility</Label>
              <Select value={formData.visibility} onValueChange={(val) => handleChange('visibility', val)}>
                 <SelectTrigger>
                    <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                 </SelectContent>
              </Select>
           </div>
        </div>

        <div className="flex items-center justify-between border p-3 rounded-lg">
           <div className="space-y-0.5">
              <Label>Featured Plan</Label>
              <p className="text-xs text-muted-foreground">Highlight this plan on the pricing page.</p>
           </div>
           <Switch 
              checked={formData.is_featured} 
              onCheckedChange={(checked) => handleChange('is_featured', checked)} 
           />
        </div>

        <div className="space-y-2">
           <Label>Theme Color</Label>
           <div className="flex items-center gap-2">
              <Input 
                 type="color" 
                 value={formData.color} 
                 onChange={(e) => handleChange('color', e.target.value)}
                 className="w-16 h-10 p-1 cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">{formData.color}</span>
           </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
         <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
         </Button>
         <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" /> Save Plan
         </Button>
      </div>
    </form>
  );
};

export default PlanForm;