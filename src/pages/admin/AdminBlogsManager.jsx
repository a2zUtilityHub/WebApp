import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Search, Edit2, Trash2, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

const mockBlogs = [
  { id: 1, title: 'Top 10 Productivity Apps for 2026', author: 'Admin Team', status: 'Published', date: 'Oct 12, 2026', category: 'Tech' },
  { id: 2, title: 'How to save money shopping online', author: 'Jane Doe', status: 'Draft', date: 'Oct 10, 2026', category: 'Finance' },
];

const AdminBlogsManager = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const handleAction = () => toast({ title: "Editor Opened", description: "Rich text editor initialization simulating..." });

  const filteredBlogs = mockBlogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900 dark:text-white">
            <BookOpen className="w-8 h-8 text-blue-600" /> Blog Management
          </h1>
        </div>
        <Button className="bg-blue-600 rounded-xl" onClick={handleAction}><Plus className="w-4 h-4 mr-2" /> Write Post</Button>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm bg-card overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-4 px-6 pt-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search articles..." 
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
                <TableHead className="px-6 font-medium text-muted-foreground uppercase tracking-wider text-xs">Article Title</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Author</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Category</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Date</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Status</TableHead>
                <TableHead className="text-right px-6 font-medium text-muted-foreground uppercase tracking-wider text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.length > 0 ? filteredBlogs.map((b) => (
                <TableRow key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                  <TableCell className="px-6 font-medium text-foreground">{b.title}</TableCell>
                  <TableCell className="text-muted-foreground">{b.author}</TableCell>
                  <TableCell><Badge variant="secondary" className="rounded-md font-normal bg-muted text-muted-foreground hover:bg-muted/80">{b.category}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{b.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={b.status === 'Published' ? 'border-primary/20 text-primary bg-primary/10' : 'border-border text-muted-foreground'}>{b.status}</Badge>
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                      <Button variant="ghost" size="icon" onClick={handleAction} className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors rounded-lg h-8 w-8"><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-lg h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-[400px] p-0">
                    <AdminEmptyState 
                      icon={FileText}
                      title="No articles found"
                      description={search ? `No articles match the search term "${search}". Try adjusting your query.` : "You haven't written any blog posts yet. Click 'Write Post' to start publishing."}
                      actionLabel={search ? "Clear Search" : "Write Post"}
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
export default AdminBlogsManager;