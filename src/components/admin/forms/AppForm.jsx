import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Loader2, Rocket } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { Badge } from '@/components/ui/badge';

const AppForm = ({ open, onOpenChange, initialData, onSubmit, loading, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    long_description: '',
    icon: '',
    url: '',
    status: 'Development',
    is_featured: false,
    selectedCategories: []
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
            ...initialData,
            name: initialData.name || initialData.translations?.en?.name || '',
            description: initialData.description || initialData.translations?.en?.description || '',
            long_description: initialData.long_description || initialData.translations?.en?.long_description || '',
            selectedCategories: initialData.categories?.map(c => c.id) || []
        });
      } else {
        setFormData({
          name: '',
          slug: '',
          description: '',
          long_description: '',
          icon: '',
          url: '',
          status: 'Development',
          is_featured: false,
          selectedCategories: []
        });
      }
      setErrors({});
    }
  }, [open, initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "App name is required";
    if (!formData.description) newErrors.description = "Short description is required";
    if (formData.status === 'Production' && !formData.url) newErrors.url = "URL is required for Production apps";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const toggleCategory = (catId) => {
    setFormData(prev => {
        const current = prev.selectedCategories || [];
        if (current.includes(catId)) {
            return { ...prev, selectedCategories: current.filter(id => id !== catId) };
        } else {
            return { ...prev, selectedCategories: [...current, catId] };
        }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-xl">
        <DialogHeader className="p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Rocket className="h-6 w-6" />
             </div>
             <DialogTitle className="text-2xl font-bold text-foreground">
                {initialData ? 'Edit Application' : 'Create New Application'}
             </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">App Name *</Label>
                    <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className={errors.name ? "border-destructive" : ""}
                        placeholder="e.g. QR Code Generator"
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug">Slug (Auto-generated if empty)</Label>
                    <Input 
                        id="slug" 
                        value={formData.slug || ''} 
                        onChange={e => setFormData({...formData, slug: e.target.value})}
                        placeholder="qr-code-generator"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief overview of the app..."
                    className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>

            <div className="space-y-2">
                <Label>Long Description (Rich Text)</Label>
                <RichTextEditor 
                    value={formData.long_description} 
                    onChange={content => setFormData({...formData, long_description: content})}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="icon">Icon Name (Lucide)</Label>
                    <Input 
                        id="icon" 
                        value={formData.icon || ''} 
                        onChange={e => setFormData({...formData, icon: e.target.value})}
                        placeholder="e.g. QrCode"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="url">App URL</Label>
                    <Input 
                        id="url" 
                        value={formData.url || ''} 
                        onChange={e => setFormData({...formData, url: e.target.value})}
                        className={errors.url ? "border-destructive" : ""}
                        placeholder="/apps/qr-code"
                    />
                    {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={val => setFormData({...formData, status: val})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Development">Development</SelectItem>
                            <SelectItem value="Production">Production</SelectItem>
                            <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-3 border p-3 rounded-lg bg-muted/20">
                    <Switch 
                        id="featured" 
                        checked={formData.is_featured} 
                        onCheckedChange={checked => setFormData({...formData, is_featured: checked})}
                    />
                    <div>
                        <Label htmlFor="featured" className="cursor-pointer font-semibold">Featured App</Label>
                        <p className="text-xs text-muted-foreground">Display prominently on home page</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/10 min-h-[60px]">
                    {categories.filter(c => c.type === 'App').map(cat => (
                        <Badge 
                            key={cat.id} 
                            variant={formData.selectedCategories?.includes(cat.id) ? "default" : "outline"}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => toggleCategory(cat.id)}
                        >
                            {cat.name}
                        </Badge>
                    ))}
                    {categories.filter(c => c.type === 'App').length === 0 && <span className="text-xs text-muted-foreground italic">No app categories found.</span>}
                </div>
            </div>

            <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-primary">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Update App' : 'Create App'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppForm;