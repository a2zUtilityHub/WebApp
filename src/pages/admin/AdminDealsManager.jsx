import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const mockDeals = [
  { id: 1, title: 'MacBook Pro M3 - $200 Off', price: '$1299', oldPrice: '$1499', store: 'Apple', status: 'Active', category: 'Electronics' },
  { id: 2, title: 'Sony WH-1000XM5 Headphones', price: '$298', oldPrice: '$398', store: 'Amazon', status: 'Active', category: 'Audio' },
];

const AdminDealsManager = () => {
  const { toast } = useToast();
  const handleAction = () => toast({ title: "Success", description: "Operation simulated successfully." });

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

      <Card className="rounded-2xl border border-white/20 dark:border-gray-800 shadow-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4 px-6 pt-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search hot deals..." className="pl-9 rounded-xl border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableHead className="px-6">Product / Deal Title</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDeals.map((d) => (
                <TableRow key={d.id} className="border-gray-100 dark:border-gray-800">
                  <TableCell className="px-6">
                    <div className="font-medium text-gray-900 dark:text-white">{d.title}</div>
                    <div className="text-xs text-gray-500">{d.category}</div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{d.store}</TableCell>
                  <TableCell>
                    <span className="font-bold text-rose-600 dark:text-rose-400 text-lg">{d.price}</span>
                    <span className="text-xs line-through text-gray-400 ml-2">{d.oldPrice}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20">{d.status}</Badge>
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
export default AdminDealsManager;