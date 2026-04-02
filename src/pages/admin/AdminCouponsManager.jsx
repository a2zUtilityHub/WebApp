import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Ticket, Plus, Search, Edit2, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const mockCoupons = [
  { id: 1, code: 'SUMMER50', discount: '50% OFF', merchant: 'Amazon', status: 'Active', expires: '2026-08-31', usage: 145 },
  { id: 2, code: 'FREESHIP', discount: 'Free Shipping', merchant: 'eBay', status: 'Expired', expires: '2025-01-01', usage: 890 },
];

const AdminCouponsManager = () => {
  const [items, setItems] = useState(mockCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleAction = () => {
    toast({ title: "Action executed", description: "Coupon modifications saved successfully." });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900 dark:text-white">
            <Ticket className="w-8 h-8 text-blue-600" /> Coupons Management
          </h1>
          <p className="text-gray-500 mt-1">Manage promotional codes and merchant discounts.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl p-6 border-0 shadow-2xl bg-white dark:bg-gray-950">
             <DialogHeader><DialogTitle>Create Coupon Code</DialogTitle></DialogHeader>
             <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>Code</Label><Input placeholder="e.g. SAVE20" className="rounded-xl text-gray-900 dark:text-white" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Discount Value</Label><Input placeholder="20% OFF" className="rounded-xl text-gray-900 dark:text-white" /></div>
                  <div className="space-y-2"><Label>Merchant</Label><Input placeholder="Store name" className="rounded-xl text-gray-900 dark:text-white" /></div>
                </div>
             </div>
             <DialogFooter><Button onClick={handleAction} className="rounded-xl bg-blue-600 text-white">Save Coupon</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-white/20 dark:border-gray-800 shadow-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4 pt-5 px-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search codes..." className="pl-9 rounded-xl border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/80 dark:bg-gray-800/80">
              <TableRow className="border-gray-100 dark:border-gray-800">
                <TableHead className="px-6">Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id} className="border-gray-100 dark:border-gray-800">
                  <TableCell className="px-6 font-mono font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-900/50 rounded-md inline-block mt-2 ml-4 border border-dashed border-gray-300 dark:border-gray-700">{c.code}</TableCell>
                  <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">{c.discount}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{c.merchant}</TableCell>
                  <TableCell className="text-gray-500 text-sm flex items-center mt-2"><Calendar className="w-3 h-3 mr-1"/> {c.expires}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("rounded-lg", c.status === 'Active' ? 'border-emerald-200 text-emerald-700' : 'border-gray-200 text-gray-500')}>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(true)} className="h-8 w-8 text-gray-500"><Edit2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="w-4 h-4" /></Button>
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
export default AdminCouponsManager;