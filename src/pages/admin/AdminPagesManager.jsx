import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useFooterCMS } from '@/hooks/useFooterCMS';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { Loader2, Plus, Edit, Trash2, Eye, FileText, Search as SearchIcon, EyeOff } from 'lucide-react';
import { generateSlug, formatDate } from '@/utils/seoUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const AdminPagesManager = () => {
    const { fetchPages, savePage, deletePage, loading } = useFooterCMS();
    const { togglePageVisibility } = usePageVisibility();
    const [pages, setPages] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newPage, setNewPage] = useState({ title: '', slug: '', status: 'draft' });
    const navigate = useNavigate();

    const loadPages = async () => {
        const { data } = await fetchPages();
        if (data) setPages(data);
    };

    useEffect(() => { loadPages(); }, []);

    const handleCreate = async () => {
        const { data } = await savePage(newPage);
        if (data) {
            setIsCreateOpen(false);
            setNewPage({ title: '', slug: '', status: 'draft' });
            loadPages();
            navigate(`/admin/pages/${data.slug}/edit`);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure? This cannot be undone.')) {
            await deletePage(id);
            loadPages();
        }
    };

    const handleVisibilityToggle = async (slug, currentStatus) => {
        if (confirm(`Are you sure you want to ${currentStatus ? 'hide' : 'show'} this page?`)) {
            await togglePageVisibility(slug, currentStatus);
            loadPages();
        }
    };

    const filteredPages = pages.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' ? true : filter === 'visible' ? p.is_visible : !p.is_visible;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pages Manager</h1>
                    <p className="text-muted-foreground">Manage footer pages and legal content.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}><Plus className="mr-2 h-4 w-4"/> Create Page</Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                 <div className="relative flex-1 max-w-sm w-full">
                    <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search pages..." 
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter Visibility" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Pages</SelectItem>
                        <SelectItem value="visible">Visible</SelectItem>
                        <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && pages.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="animate-spin h-6 w-6 mx-auto"/></TableCell></TableRow>
                        ) : filteredPages.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No pages found.</TableCell></TableRow>
                        ) : (
                            filteredPages.map(page => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-500"/>
                                        {page.title}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                                    <TableCell>
                                        <Badge variant={page.status === 'published' ? 'success' : 'secondary'}>
                                            {page.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={page.is_visible ? 'success' : 'outline'} className={!page.is_visible ? 'text-muted-foreground' : ''}>
                                                {page.is_visible ? 'Visible' : 'Hidden'}
                                            </Badge>
                                            <Switch 
                                                checked={page.is_visible} 
                                                onCheckedChange={() => handleVisibilityToggle(page.slug, page.is_visible)}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(page.updated_at)}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => window.open(`/${page.slug}`, '_blank')} title="Preview">
                                            <Eye className="h-4 w-4"/>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/pages/${page.slug}/edit`)} title="Edit Content">
                                            <Edit className="h-4 w-4"/>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(page.id)} title="Delete">
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Page</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Page Title</Label>
                            <Input 
                                value={newPage.title} 
                                onChange={(e) => setNewPage({
                                    ...newPage, 
                                    title: e.target.value,
                                    slug: generateSlug(e.target.value)
                                })} 
                                placeholder="e.g. Terms of Service" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>URL Slug</Label>
                            <Input 
                                value={newPage.slug} 
                                onChange={(e) => setNewPage({...newPage, slug: generateSlug(e.target.value)})} 
                                placeholder="terms-of-service" 
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={!newPage.title || loading}>Create Page</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPagesManager;