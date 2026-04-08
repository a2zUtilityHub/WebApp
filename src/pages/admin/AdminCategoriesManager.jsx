import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FolderTree, Plus, Search, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const mockCategories = [
  { id: 1, name: 'Productivity', slug: 'productivity', type: 'App', items: 45, status: 'Active' },
  { id: 2, name: 'Electronics', slug: 'electronics', type: 'Deal', items: 120, status: 'Active' },
  { id: 3, name: 'Finance', slug: 'finance', type: 'Blog', items: 34, status: 'Active' },
];

const AdminCategoriesManager = () => {
  const { toast } = useToast();
  const handleAction = () => toast({ title: "Success", description: "Category taxonomy updated." });

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

      <Card className="rounded-2xl border border-white/20 dark:border-gray-800 shadow-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4 px-6 pt-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search tags/categories..." className="pl-9 rounded-xl border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableHead className="px-6">Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Target Module</TableHead>
                <TableHead>Items Linked</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCategories.map((c) => (
                <TableRow key={c.id} className="border-gray-100 dark:border-gray-800">
                  <TableCell className="px-6 font-medium text-gray-900 dark:text-white">{c.name}</TableCell>
                  <TableCell className="text-gray-500 font-mono text-sm">{c.slug}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{c.type}</TableCell>
                  <TableCell className="text-blue-600 font-semibold">{c.items}</TableCell>
                  <TableCell className="px-6 text-right">
                    <Button variant="ghost" size="icon" onClick={handleAction} className="text-gray-500 hover:text-blue-600 rounded-lg"><Edit2 className="w-4 h-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-600 dark:text-red-500 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Delete Category?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the <strong>{c.name}</strong> category? This may orphan the {c.items} {c.type}s currently linked to it.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => toast({ title: "Category Deleted", variant: "destructive" })} className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
                            Delete Category
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminCategoriesManager;