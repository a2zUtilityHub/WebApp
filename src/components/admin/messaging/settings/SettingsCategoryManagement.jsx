import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Trash2, Edit2 } from 'lucide-react';

const SettingsCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', slug: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from('support_categories').select('*').order('name');
    if (data) setCategories(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload = {
        name: formData.name,
        description: formData.description,
        slug: slug,
        created_at: new Date()
      };

      let error;
      if (editingCategory) {
        const { error: updateError } = await supabase
          .from('support_categories')
          .update(payload)
          .eq('id', editingCategory.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('support_categories')
          .insert(payload);
        error = insertError;
      }

      if (error) throw error;

      toast({ title: editingCategory ? 'Category updated' : 'Category created' });
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', slug: '' });
      fetchCategories();

    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure? This might affect existing tickets linked to this category.')) return;
    try {
      const { error } = await supabase.from('support_categories').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Category deleted' });
      fetchCategories();
    } catch (error) {
      toast({ title: 'Error deleting category', variant: 'destructive' });
    }
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '', slug: cat.slug || '' });
    setIsModalOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>Manage support ticket categories.</CardDescription>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingCategory(null); setFormData({ name: '', description: '', slug: '' }); }}>
              <Plus className="h-4 w-4 mr-2" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'New Category'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <Label>Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
               </div>
               <div className="space-y-2">
                  <Label>Description</Label>
                  <Input 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  />
               </div>
               <div className="space-y-2">
                  <Label>Slug (Optional)</Label>
                  <Input 
                    value={formData.slug} 
                    onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                    placeholder="auto-generated-from-name"
                  />
               </div>
               <DialogFooter>
                  <Button type="submit">Save</Button>
               </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(cat.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No categories found. Create one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SettingsCategoryManagement;