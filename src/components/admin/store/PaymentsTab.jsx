
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, Settings, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const MOCK_TRANSACTIONS = [
  { id: 'TRX-9982', date: '2023-10-25 10:30', amount: '$124.50', method: 'Visa •••• 4242', status: 'Succeeded', customer: 'Alice Smith' },
  { id: 'TRX-9981', date: '2023-10-24 14:15', amount: '$89.99', method: 'PayPal', status: 'Succeeded', customer: 'Bob Johnson' },
  { id: 'TRX-9980', date: '2023-10-24 09:00', amount: '$210.00', method: 'Mastercard •••• 5555', status: 'Failed', customer: 'Charlie Davis' },
  { id: 'TRX-9979', date: '2023-10-23 16:45', amount: '$45.00', method: 'Amex •••• 1234', status: 'Succeeded', customer: 'Diana Miller' },
];

const PaymentsTab = () => {
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: "Action triggered",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">Manage transactions and payment gateways.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAction}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button onClick={handleAction}>
            <Settings className="w-4 h-4 mr-2" /> Gateways
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (30d)</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450.00</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Successful Transactions</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground">98.5% success rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Refunds</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$340.50</div>
            <p className="text-xs text-muted-foreground">12 transactions refunded</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>A list of recent payment attempts across all gateways.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_TRANSACTIONS.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell className="font-medium font-mono text-xs">{trx.id}</TableCell>
                    <TableCell className="text-muted-foreground">{trx.date}</TableCell>
                    <TableCell>{trx.customer}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        {trx.method}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{trx.amount}</TableCell>
                    <TableCell>
                      <Badge variant={trx.status === 'Succeeded' ? 'success' : 'destructive'} 
                             className={trx.status === 'Succeeded' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}>
                        {trx.status}
                      </Badge>
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

export default PaymentsTab;
