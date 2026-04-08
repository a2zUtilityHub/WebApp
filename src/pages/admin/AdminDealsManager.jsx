import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Plus, Search, Edit2, Trash2, Tag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

const mockDeals = [
  { id: 1, title: 'MacBook Pro M3 - $200 Off', price: '$1299', oldPrice: '$1499', store: 'Apple', status: 'Active', category: 'Electronics' },
  { id: 2, title: 'Sony WH-1000XM5 Headphones', price: '$298', oldPrice: '$398', store: 'Amazon', status: 'Active', category: 'Audio' },
];

const AdminDealsManager = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const handleAction = () => toast({ title: "Success", description: "Operation simulated successfully." });

  const filteredDeals = mockDeals.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.store.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900 dark:text-white">
            <ShoppingBag className="w-8 h-8 text-blue-600" /> Deals Management
          </h1>
        </div>
        <Button className="bg-blue-600 rounded-xl" onClick={handleAction}><Plus className="w-4 h-4 mr-2" /> Add Deal</Button>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm bg-card overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-4 px-6 pt-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search hot deals..." 
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
                <TableHead className="px-6 font-medium text-muted-foreground uppercase tracking-wider text-xs">Product / Deal Title</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Store</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Pricing</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Status</TableHead>
                <TableHead className="text-right px-6 font-medium text-muted-foreground uppercase tracking-wider text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.length > 0 ? filteredDeals.map((d) => (
                <TableRow key={d.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                  <TableCell className="px-6">
                    <div className="font-medium text-foreground">{d.title}</div>
                    <div className="text-xs text-muted-foreground">{d.category}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d.store}</TableCell>
                  <TableCell>
                    <span className="font-bold text-destructive text-lg">{d.price}</span>
                    <span className="text-xs line-through text-muted-foreground ml-2">{d.oldPrice}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 bg-emerald-500/10">{d.status}</Badge>
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
                  <TableCell colSpan={5} className="h-[400px] p-0">
                    <AdminEmptyState 
                      icon={Tag}
                      title="No deals found"
                      description={search ? `No deals match the search term "${search}". Try adjusting your query.` : "You haven't added any deals yet. Click 'Add Deal' to start promoting offers."}
                      actionLabel={search ? "Clear Search" : "Add Deal"}
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
export default AdminDealsManager;