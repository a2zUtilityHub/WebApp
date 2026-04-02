import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Plus, Edit2, Trash2, Search, Check, DollarSign } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const mockPlans = [
  { id: 1, name: 'Basic Free', price: '0', period: 'forever', status: 'Active', features: ['1 User', 'Basic Apps'] },
  { id: 2, name: 'Pro Monthly', price: '19.99', period: 'month', status: 'Active', features: ['5 Users', 'All Apps', 'Priority Support'] },
  { id: 3, name: 'Enterprise', price: '99.99', period: 'year', status: 'Draft', features: ['Unlimited', 'Custom APIs'] },
];

const AdminPlansPage = () => {
  const [plans, setPlans] = useState(mockPlans);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const { toast } = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      id: editingPlan ? editingPlan.id : Date.now(),
      name: formData.get('name'),
      price: formData.get('price'),
      period: formData.get('period'),
      status: formData.get('status'),
      features: editingPlan ? editingPlan.features : ['New Feature'],
    };

    if (editingPlan) {
      setPlans(plans.map(p => p.id === data.id ? data : p));
      toast({ title: "Plan updated", description: `${data.name} has been updated.` });
    } else {
      setPlans([data, ...plans]);
      toast({ title: "Plan created", description: `${data.name} pricing tier created.` });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setPlans(plans.filter(p => p.id !== id));
    toast({ title: "Plan deleted", description: "The subscription plan was removed.", variant: "destructive" });
  };

  const openModal = (plan = null) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-blue-600" /> Subscription Plans
          </h1>
          <p className="text-gray-500 mt-1">Manage pricing tiers and feature access for users.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 border-0 shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <DialogTitle className="text-lg font-semibold">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5 bg-white dark:bg-gray-950">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input id="name" name="name" defaultValue={editingPlan?.name} required className="rounded-xl text-gray-900 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="price" name="price" type="number" step="0.01" defaultValue={editingPlan?.price} required className="pl-9 rounded-xl text-gray-900 dark:text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="period">Billing Period</Label>
                    <Select name="period" defaultValue={editingPlan?.period || 'month'}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                        <SelectItem value="forever">Lifetime / Free</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={editingPlan?.status || 'Active'}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active (Public)</SelectItem>
                      <SelectItem value="Draft">Draft (Hidden)</SelectItem>
                      <SelectItem value="Legacy">Legacy (No new signups)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
                <Button type="submit" className="rounded-xl bg-blue-600 text-white">Save Plan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-white/20 dark:border-gray-800 shadow-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/80 dark:bg-gray-800/80">
              <TableRow className="border-gray-100 dark:border-gray-800">
                <TableHead className="px-6 py-4">Plan Name</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Top Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id} className="border-gray-100 dark:border-gray-800">
                  <TableCell className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-gray-900 dark:text-white">${plan.price} <span className="text-xs font-normal text-gray-500">/{plan.period}</span></div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {plan.features.slice(0,2).map(f => (
                        <span key={f} className="text-xs text-gray-600 dark:text-gray-400 flex items-center"><Check className="w-3 h-3 mr-1 text-emerald-500"/>{f}</span>
                      ))}
                      {plan.features.length > 2 && <span className="text-xs text-gray-400">+{plan.features.length - 2} more</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("rounded-lg px-2.5 py-0.5", plan.status === 'Active' ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-gray-200 text-gray-600")}>
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openModal(plan)} className="h-8 w-8 text-gray-500 hover:text-blue-600 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.id)} className="h-8 w-8 text-gray-400 hover:text-red-600 rounded-lg ml-1">
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default AdminPlansPage;