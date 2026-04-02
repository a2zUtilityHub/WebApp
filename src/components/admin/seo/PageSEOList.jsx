import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminSEO } from '@/hooks/useAdminSEO';
import { SEOStatusBadge } from './SEOBadges';
import { Edit, Trash2, Eye, Plus, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PageSEOList = ({ onView, onEdit, onCreate }) => {
    const { fetchSEOPages, deleteSEOPage, loading } = useAdminSEO();
    const [pages, setPages] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const loadPages = async () => {
        const { data } = await fetchSEOPages(); // Fetch all for client-side sort/filter given small likely dataset, or switch to server-side if needed
        setPages(data || []);
    };

    useEffect(() => { loadPages(); }, []);

    const handleDelete = async (id) => {
        if(confirm('Are you sure you want to delete this page SEO record?')) {
            await deleteSEOPage(id);
            loadPages();
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredPages = pages.filter(page => {
        const matchesSearch = page.page_url.toLowerCase().includes(search.toLowerCase()) || 
                              (page.page_title && page.page_title.toLowerCase().includes(search.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sortedPages = [...filteredPages].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedPages.length / itemsPerPage);
    const currentData = sortedPages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search pages..." 
                            className="pl-8" 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="issue">Issue</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={onCreate} className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                    <Plus className="h-4 w-4 mr-2"/> Add Page
                </Button>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="cursor-pointer hover:text-primary" onClick={() => handleSort('page_url')}>
                                Page URL {sortConfig.key === 'page_url' && (sortConfig.direction === 'asc' ? <SortAsc className="inline w-3 h-3"/> : <SortDesc className="inline w-3 h-3"/>)}
                            </TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="cursor-pointer hover:text-primary" onClick={() => handleSort('seo_score')}>
                                Score {sortConfig.key === 'seo_score' && (sortConfig.direction === 'asc' ? <SortAsc className="inline w-3 h-3"/> : <SortDesc className="inline w-3 h-3"/>)}
                            </TableHead>
                            <TableHead className="cursor-pointer hover:text-primary" onClick={() => handleSort('issues_count')}>
                                Issues {sortConfig.key === 'issues_count' && (sortConfig.direction === 'asc' ? <SortAsc className="inline w-3 h-3"/> : <SortDesc className="inline w-3 h-3"/>)}
                            </TableHead>
                            <TableHead className="cursor-pointer hover:text-primary" onClick={() => handleSort('status')}>
                                Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? <SortAsc className="inline w-3 h-3"/> : <SortDesc className="inline w-3 h-3"/>)}
                            </TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-10" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : currentData.length > 0 ? (
                            currentData.map(page => (
                                <TableRow key={page.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-mono text-xs font-medium text-blue-600">{page.page_url}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">{page.page_title || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold ${page.seo_score > 80 ? 'text-green-600' : page.seo_score > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {page.seo_score}
                                            </span>
                                            <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${page.seo_score > 80 ? 'bg-green-500' : page.seo_score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                                    style={{ width: `${page.seo_score}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {page.issues_count > 0 ? 
                                            <Badge variant="destructive" className="rounded-sm">{page.issues_count} Issues</Badge> : 
                                            <span className="text-muted-foreground text-sm flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Clean</span>
                                        }
                                    </TableCell>
                                    <TableCell><SEOStatusBadge status={page.status} /></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button size="icon" variant="ghost" onClick={() => onEdit(page)} title="Edit">
                                                <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => handleDelete(page.id)} title="Delete" className="hover:bg-red-50">
                                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No pages found matching criteria</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                        </PaginationItem>
                        {Array.from({ length: totalPages }).map((_, i) => (
                             <PaginationItem key={i}>
                                <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)} className="cursor-pointer">
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default PageSEOList;