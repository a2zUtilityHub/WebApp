import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, PenTool } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { format } from 'date-fns';

const BlogForm = ({ open, onOpenChange, initialData, onSubmit, loading, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft',
    category_id: '',
    language: 'en',
    meta_title: '',
    meta_description: '',
    published_at: format(new Date(), "yyyy-MM-dd'T'HH:mm")
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
            ...initialData,
            title: initialData.title || initialData.translations?.en?.title || '',
            content: initialData.content || initialData.translations?.en?.content || '',
            published_at: initialData.published_at ? format(new Date(initialData.published_at), "yyyy-MM-dd'T'HH:mm") : ''
        });
      } else {
        setFormData({
          title: '',
          slug: '',
          content: '',
          status: 'draft',
          category_id: '',
          language: 'en',
          meta_title: '',
          meta_description: '',
          published_at: format(new Date(), "yyyy-MM-dd'T'HH:mm")
        });
      }
      setErrors({});
    }
  }, [open, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) { setErrors({title: 'Title is required'}); return; }
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 rounded-xl">
        <DialogHeader className="p-6 bg-gradient-to-r from-green-600/10 to-teal-600/10 border-b">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                <PenTool className="h-6 w-6" />
             </div>
             <DialogTitle className="text-2xl font-bold">
                {initialData ? 'Edit Blog Post' : 'New Blog Post'}
             </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input 
                        id="title" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug">Slug (Optional)</Label>
                    <Input id="slug" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Content (Rich Text)</Label>
                <RichTextEditor 
                    value={formData.content} 
                    onChange={content => setFormData({...formData, content: content})}
                    className="min-h-[300px]"
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={String(formData.category_id || '')} onValueChange={val => setFormData({...formData, category_id: val})}>
                        <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                        <SelectContent>
                            {categories.filter(c => c.type === 'Blog').map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={val => setFormData({...formData, status: val})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Publish Date</Label>
                    <Input 
                        type="datetime-local" 
                        value={formData.published_at} 
                        onChange={e => setFormData({...formData, published_at: e.target.value})}
                    />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">SEO Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label>Meta Title</Label>
                        <Input value={formData.meta_title || ''} onChange={e => setFormData({...formData, meta_title: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                        <Label>Meta Description</Label>
                        <Input value={formData.meta_description || ''} onChange={e => setFormData({...formData, meta_description: e.target.value})} />
                     </div>
                </div>
            </div>

            <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Post
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogForm;