import React, { useState, useEffect } from 'react';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Eye, EyeOff, Edit, Trash2, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const AdminPageVisibilityManager = () => {
    const { getAllPages, togglePageVisibility, loading: hookLoading } = usePageVisibility();
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();
    const { toast } = useToast();

    const loadData = async () => {
        setLoading(true);
        const data = await getAllPages();
        if (data) setPages(data);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [getAllPages]);

    const handleToggle = async (slug, currentStatus) => {
        const success = await togglePageVisibility(slug, currentStatus);
        if (success) {
            setPages(prev => prev.map(p => p.slug === slug ? { ...p, is_visible: !currentStatus } : p));
        }
    };

    const handleRefresh = () => {
        loadData();
        toast({ title: "Refreshed", description: "Page list updated." });
    };

    const filteredPages = pages.filter(page => {
        const matchesSearch = page.title.toLowerCase().includes(search.toLowerCase()) || page.slug.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' 
            ? true 
            : filter === 'visible' 
                ? page.is_visible 
                : !page.is_visible;
        return matchesSearch && matchesFilter;
    });

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Page Visibility</CardTitle>
                    <CardDescription>Control public access to your site's pages.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                    <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
                    <div className="flex-1 space-y-2 w-full">
                         <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search pages..." 
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-[200px]">
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Pages</SelectItem>
                                <SelectItem value="visible">Visible</SelectItem>
                                <SelectItem value="hidden">Hidden</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Page Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Visibility</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredPages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No pages found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPages.map((page) => (
                                    <TableRow key={page.id}>
                                        <TableCell className="font-medium">{page.title}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm font-mono">/{page.slug}</TableCell>
                                        <TableCell>
                                            <Badge variant={page.is_visible ? "success" : "secondary"}>
                                                {page.is_visible ? "Visible" : "Hidden"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {page.is_visible ? <Eye className="h-4 w-4 text-green-500"/> : <EyeOff className="h-4 w-4 text-muted-foreground"/>}
                                                <Switch 
                                                    checked={page.is_visible} 
                                                    onCheckedChange={() => handleToggle(page.slug, page.is_visible)}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => navigate(`/admin/pages/${page.slug}/edit`)}
                                                    title="Edit Content"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminPageVisibilityManager;