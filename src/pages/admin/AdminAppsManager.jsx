import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppWindow, Plus, Edit2, Trash2, Search, Image as ImageIcon, Link as LinkIcon, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

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
            <form onSubmit={handleSave} className="p-6 space-y-5 bg-white dark:bg-gray-950">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">App Name</Label>
                  <Input id="name" name="name" defaultValue={editingApp?.name} required className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue={editingApp?.category || 'Productivity'}>
                      <SelectTrigger className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Productivity">Productivity</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Tools">Tools</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={editingApp?.status || 'Draft'}>
                      <SelectTrigger className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">App Route / URL</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="url" name="url" defaultValue={editingApp?.url} placeholder="/apps/your-app" className="pl-9 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white" />
                  </div>
                </div>
                <div className="pt-2">
                  <Label className="mb-2 block">App Icon</Label>
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm font-medium">Click to upload icon</span>
                    <span className="text-xs opacity-70">SVG, PNG, JPG (max 2MB)</span>
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
                <Button type="submit" className="rounded-xl bg-blue-600 text-white hover:bg-blue-700">Save App</Button>
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
            <TableHeader className="bg-gray-50/80 dark:bg-gray-800/80">
              <TableRow className="border-gray-100 dark:border-gray-800">
                <TableHead className="px-6 py-4">App Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Analytics</TableHead>
                <TableHead className="px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.map((app) => (
                <TableRow key={app.id} className="border-gray-100 dark:border-gray-800">
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
                    <Button variant="ghost" size="icon" onClick={() => openModal(app)} className="h-8 w-8 text-gray-500 hover:text-blue-600 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(app.id)} className="h-8 w-8 text-gray-400 hover:text-red-600 rounded-lg ml-1">
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default AdminAppsManager;