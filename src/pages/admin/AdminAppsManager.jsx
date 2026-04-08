import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppWindow, Plus, Edit2, Trash2, Search, Image as ImageIcon, Link as LinkIcon, Globe, PackageX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

const mockApps = [
  { id: 1, name: 'Task Manager Pro', category: 'Productivity', status: 'Published', views: 1240, url: '/apps/task-manager' },
  { id: 2, name: 'Image Resizer', category: 'Utilities', status: 'Draft', views: 0, url: '/apps/image-resizer' },
  { id: 3, name: 'QR Generator', category: 'Tools', status: 'Published', views: 3450, url: '/apps/qr-generator' },
];

const AdminAppsManager = () => {
  const [apps, setApps] = useState(mockApps);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const { toast } = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      id: editingApp ? editingApp.id : Date.now(),
      name: formData.get('name'),
      category: formData.get('category'),
      status: formData.get('status'),
      url: formData.get('url'),
      views: editingApp ? editingApp.views : 0,
    };

    if (editingApp) {
      setApps(apps.map(a => a.id === data.id ? data : a));
      toast({ title: "App updated", description: `${data.name} has been updated.` });
    } else {
      setApps([data, ...apps]);
      toast({ title: "App created", description: `${data.name} is now in ${data.status} state.` });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setApps(apps.filter(a => a.id !== id));
    toast({ title: "App deleted", description: "The application entry was removed.", variant: "destructive" });
  };

  const openModal = (app = null) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const filteredApps = apps.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <AppWindow className="w-8 h-8 text-blue-600" /> App Directory
          </h1>
          <p className="text-gray-500 mt-1">Manage software tools and applications listed on the platform.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Add App
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] rounded-2xl p-0 border-0 shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <DialogTitle className="text-lg font-semibold">{editingApp ? 'Edit Application' : 'Create Application Listing'}</DialogTitle>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6 bg-card">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">App Name</Label>
                  <Input id="name" name="name" defaultValue={editingApp?.name} required className="h-11 rounded-xl bg-muted/50 border-border/50 focus:bg-background transition-colors" placeholder="e.g. Task Manager Pro" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-sm font-medium text-foreground">Category</Label>
                    <Select name="category" defaultValue={editingApp?.category || 'Productivity'}>
                      <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50 focus:bg-background transition-colors">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/50 shadow-xl">
                        <SelectItem value="Productivity">Productivity</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Tools">Tools</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-sm font-medium text-foreground">Status</Label>
                    <Select name="status" defaultValue={editingApp?.status || 'Draft'}>
                      <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50 focus:bg-background transition-colors">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/50 shadow-xl">
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="url" className="text-sm font-medium text-foreground">App Route / URL</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="url" name="url" defaultValue={editingApp?.url} placeholder="/apps/your-app" className="h-11 pl-9 rounded-xl bg-muted/50 border-border/50 focus:bg-background transition-colors" />
                  </div>
                </div>
                <div className="pt-2">
                  <Label className="mb-2 block text-sm font-medium text-foreground">App Icon</Label>
                  <div className="border-2 border-dashed border-border/60 bg-muted/30 rounded-xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-primary/30 cursor-pointer transition-all duration-200">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm font-medium text-foreground">Click to upload icon</span>
                    <span className="text-xs opacity-70">SVG, PNG, JPG (max 2MB)</span>
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-6 border-t border-border/50 flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl w-full sm:w-auto hover:bg-muted">Cancel</Button>
                <Button type="submit" className="rounded-xl w-full sm:w-auto bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all">Save App</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-white/20 dark:border-gray-800 shadow-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4 pt-5 px-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search apps..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-950/80 text-gray-900 dark:text-white"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border/50">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">App Details</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Category</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Status</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Analytics</TableHead>
                <TableHead className="px-6 text-right font-medium text-muted-foreground uppercase tracking-wider text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.length > 0 ? filteredApps.map((app) => (
                <TableRow key={app.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{app.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{app.url}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{app.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "rounded-lg border-transparent px-2.5 py-0.5 font-medium",
                      app.status === 'Published' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : 
                      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    )}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">{app.views.toLocaleString()} views</TableCell>
                  <TableCell className="px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                      <Button variant="ghost" size="icon" onClick={() => openModal(app)} className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(app.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-[400px] p-0">
                    <AdminEmptyState 
                      icon={PackageX}
                      title="No apps found"
                      description={search ? `We couldn't find any applications matching "${search}". Try adjusting your filters.` : "There are no applications listed yet. Click 'Add App' to get started."}
                      actionLabel={search ? "Clear Search" : "Add New App"}
                      onAction={() => search ? setSearch('') : openModal()}
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

export default AdminAppsManager;