import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const mockBlogs = [
  { id: 1, title: 'Top 10 Productivity Apps for 2026', author: 'Admin Team', status: 'Published', date: 'Oct 12, 2026', category: 'Tech' },
  { id: 2, title: 'How to save money shopping online', author: 'Jane Doe', status: 'Draft', date: 'Oct 10, 2026', category: 'Finance' },
];

const AdminBlogsManager = () => {
  const { toast } = useToast();
  const handleAction = () => toast({ title: "Editor Opened", description: "Rich text editor initialization simulating..." });

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

      <Card className="rounded-2xl border border-white/20 dark:border-gray-800 shadow-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4 px-6 pt-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search articles..." className="pl-9 rounded-xl border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableHead className="px-6">Article Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBlogs.map((b) => (
                <TableRow key={b.id} className="border-gray-100 dark:border-gray-800">
                  <TableCell className="px-6 font-medium text-gray-900 dark:text-white">{b.title}</TableCell>
                  <TableCell className="text-gray-500">{b.author}</TableCell>
                  <TableCell><Badge variant="secondary" className="rounded-md font-normal">{b.category}</Badge></TableCell>
                  <TableCell className="text-gray-500 text-sm">{b.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={b.status === 'Published' ? 'border-blue-200 text-blue-700 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 text-gray-600'}>{b.status}</Badge>
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <Button variant="ghost" size="icon" onClick={handleAction} className="text-gray-500 hover:text-blue-600"><Edit2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
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
export default AdminBlogsManager;