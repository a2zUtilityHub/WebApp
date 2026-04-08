
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const MOCK_INVENTORY = [
  { id: 'SKU-001', name: 'Wireless Headphones', stock: 145, reorder: 20, location: 'Warehouse A' },
  { id: 'SKU-002', name: 'Smart Watch Series 5', stock: 12, reorder: 15, location: 'Warehouse B', lowStock: true },
  { id: 'SKU-003', name: 'Mechanical Keyboard', stock: 0, reorder: 10, location: 'Warehouse A', outOfStock: true },
  { id: 'SKU-004', name: 'USB-C Hub Multiport', stock: 89, reorder: 30, location: 'Warehouse C' },
  { id: 'SKU-005', name: 'Laptop Stand Aluminum', stock: 45, reorder: 25, location: 'Warehouse A' },
];

const InventoryTab = () => {
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: "Action triggered",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">Track stock levels and manage warehousing.</p>
        </div>
        <Button onClick={handleAction}>
          <ArrowUpDown className="w-4 h-4 mr-2" /> Adjust Stock
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>Stock Levels</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search SKU or name..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Reorder Level</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_INVENTORY.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium font-mono text-sm">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      {item.outOfStock ? (
                        <Badge variant="destructive">Out of Stock</Badge>
                      ) : item.lowStock ? (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200">
                          In Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className={`text-right font-bold ${item.outOfStock ? 'text-destructive' : item.lowStock ? 'text-amber-500' : ''}`}>
                      {item.stock}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.reorder}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={handleAction}>Update</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryTab;
