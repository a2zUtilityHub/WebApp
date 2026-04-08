
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Truck, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const MOCK_SHIPPING = [
  { id: 1, name: 'Standard Shipping', cost: '$5.00', time: '3-5 business days', active: true, zones: 'Domestic' },
  { id: 2, name: 'Express Shipping', cost: '$15.00', time: '1-2 business days', active: true, zones: 'Domestic' },
  { id: 3, name: 'Free Shipping (Orders > $50)', cost: '$0.00', time: '3-5 business days', active: true, zones: 'Domestic' },
  { id: 4, name: 'International Standard', cost: '$25.00', time: '7-14 business days', active: false, zones: 'Global' },
];

const ShippingTab = () => {
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
          <h2 className="text-2xl font-bold tracking-tight">Shipping</h2>
          <p className="text-muted-foreground">Configure shipping methods, zones, and rates.</p>
        </div>
        <Button onClick={handleAction}>
          <Plus className="w-4 h-4 mr-2" /> Add Method
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Shipping Methods</CardTitle>
            <CardDescription>Available delivery options for your customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method Name</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Estimated Time</TableHead>
                    <TableHead>Zones</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_SHIPPING.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        {method.name}
                      </TableCell>
                      <TableCell>{method.cost}</TableCell>
                      <TableCell className="text-muted-foreground">{method.time}</TableCell>
                      <TableCell><Badge variant="outline">{method.zones}</Badge></TableCell>
                      <TableCell>
                        <Switch checked={method.active} onCheckedChange={handleAction} />
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

        <Card>
          <CardHeader>
            <CardTitle>Carrier Integrations</CardTitle>
            <CardDescription>Connect with external shipping providers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center font-bold text-xs">UPS</div>
                <div>
                  <p className="font-medium text-sm">UPS Live Rates</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleAction}>Manage</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center font-bold text-xs">FDX</div>
                <div>
                  <p className="font-medium text-sm">FedEx</p>
                  <p className="text-xs text-muted-foreground">Not connected</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleAction}>Connect</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShippingTab;
