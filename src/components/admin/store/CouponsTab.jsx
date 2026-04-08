
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Ticket, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const MOCK_COUPONS = [
  { id: 1, code: 'WELCOME20', discount: '20%', expiry: '2024-12-31', usage: 145, status: 'Active' },
  { id: 2, code: 'FREESHIP', discount: 'Free Shipping', expiry: '2023-11-30', usage: 89, status: 'Active' },
  { id: 3, code: 'BFCM50', discount: '$50 Fixed', expiry: '2023-11-28', usage: 302, status: 'Expired' },
  { id: 4, code: 'VIPONLY', discount: '15%', expiry: 'No Expiry', usage: 12, status: 'Active' },
];

const CouponsTab = () => {
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
          <h2 className="text-2xl font-bold tracking-tight">Coupons & Discounts</h2>
          <p className="text-muted-foreground">Create and manage promotional codes.</p>
        </div>
        <Button onClick={handleAction}>
          <Plus className="w-4 h-4 mr-2" /> Create Coupon
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>Active Coupons</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search code..."
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
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_COUPONS.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-primary" />
                      <span className="font-mono bg-muted px-2 py-1 rounded">{coupon.code}</span>
                    </TableCell>
                    <TableCell>{coupon.discount}</TableCell>
                    <TableCell className="text-muted-foreground">{coupon.expiry}</TableCell>
                    <TableCell>{coupon.usage} times</TableCell>
                    <TableCell>
                      <Badge variant={coupon.status === 'Active' ? 'success' : 'secondary'}
                             className={coupon.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}>
                        {coupon.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={handleAction}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleAction}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

export default CouponsTab;
