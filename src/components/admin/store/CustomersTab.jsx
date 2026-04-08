
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, UserPlus, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const MOCK_CUSTOMERS = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', orders: 12, spent: '$1,245.50', lastActive: '2023-10-25' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', orders: 3, spent: '$289.99', lastActive: '2023-10-24' },
  { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', orders: 8, spent: '$810.00', lastActive: '2023-10-20' },
  { id: 4, name: 'Diana Miller', email: 'diana@example.com', orders: 1, spent: '$45.00', lastActive: '2023-10-23' },
  { id: 5, name: 'Evan Wilson', email: 'evan@example.com', orders: 5, spent: '$650.75', lastActive: '2023-10-15' },
];

const CustomersTab = () => {
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
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">Manage your store customers and view purchase history.</p>
        </div>
        <Button onClick={handleAction}>
          <UserPlus className="w-4 h-4 mr-2" /> Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>Customer List</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_CUSTOMERS.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary">{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell className="font-medium">{customer.spent}</TableCell>
                    <TableCell>{new Date(customer.lastActive).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={handleAction}>
                        <MoreHorizontal className="w-4 h-4" />
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

export default CustomersTab;
