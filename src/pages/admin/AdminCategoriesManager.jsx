import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FolderTree, Plus, Search, Edit2, Trash2, AlertTriangle, FolderX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

const mockCategories = [
  { id: 1, name: 'Productivity', slug: 'productivity', type: 'App', items: 45, status: 'Active' },
  { id: 2, name: 'Electronics', slug: 'electronics', type: 'Deal', items: 120, status: 'Active' },
  { id: 3, name: 'Finance', slug: 'finance', type: 'Blog', items: 34, status: 'Active' },
];

const AdminCategoriesManager = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const handleAction = () => toast({ title: "Success", description: "Category taxonomy updated." });

  const filteredCategories = mockCategories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900 dark:text-white">
            <FolderTree className="w-8 h-8 text-blue-600" /> Category Taxonomy
          </h1>
        </div>
        <Button className="bg-blue-600 rounded-xl" onClick={handleAction}><Plus className="w-4 h-4 mr-2" /> Add Category</Button>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm bg-card overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-4 px-6 pt-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search tags/categories..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 rounded-xl bg-muted/50 border-border/50 focus:bg-background transition-colors" 
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border/50">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="px-6 font-medium text-muted-foreground uppercase tracking-wider text-xs">Name</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Slug</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Target Module</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Items Linked</TableHead>
                <TableHead className="text-right px-6 font-medium text-muted-foreground uppercase tracking-wider text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length > 0 ? filteredCategories.map((c) => (
                <TableRow key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                  <TableCell className="px-6 font-medium text-foreground">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">{c.slug}</TableCell>
                  <TableCell className="text-muted-foreground">{c.type}</TableCell>
                  <TableCell className="text-primary font-semibold">{c.items}</TableCell>
                  <TableCell className="px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                    <Button variant="ghost" size="icon" onClick={handleAction} className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors rounded-lg h-8 w-8"><Edit2 className="w-4 h-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-lg h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border-border/50">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-destructive flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Delete Category?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the <strong>{c.name}</strong> category? This may orphan the {c.items} {c.type}s currently linked to it.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl border-border/50 hover:bg-muted">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => toast({ title: "Category Deleted", variant: "destructive" })} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl shadow-sm">
                              Delete Category
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-[400px] p-0">
                    <AdminEmptyState 
                      icon={FolderX}
                      title="No categories found"
                      description={search ? `No taxonomy matches the search term "${search}". Try a different keyword.` : "Your category taxonomy is currently empty. Create your first category to start organizing content."}
                      actionLabel={search ? "Clear Search" : "Add Category"}
                      onAction={() => search ? setSearch('') : handleAction()}
                      className="border-0 bg-transparent rounded-none h-full shadow-none hover:bg-transparent"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminCategoriesManager;