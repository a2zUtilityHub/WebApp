import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useHRManagement } from '@/hooks/useHRManagement';
import { Loader2, Plus, Download } from 'lucide-react';

const PayrollManagement = () => {
  const { fetchPayroll, createPayroll, deletePayroll, fetchEmployees, loading } = useHRManagement();
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    salary: 0,
    bonuses: 0,
    deductions: 0,
    tax: 0,
    net_salary: 0,
    payment_status: 'pending'
  });

  const loadData = async () => {
    const data = await fetchPayroll();
    setPayrolls(data || []);
    const emps = await fetchEmployees();
    setEmployees(emps || []);
  };

  useEffect(() => { loadData(); }, []);

  // Auto calculate net salary
  useEffect(() => {
    const net = (Number(formData.salary) + Number(formData.bonuses)) - (Number(formData.deductions) + Number(formData.tax));
    setFormData(prev => ({ ...prev, net_salary: net }));
  }, [formData.salary, formData.bonuses, formData.deductions, formData.tax]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPayroll(formData);
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if(confirm('Delete this payroll record?')) {
        await deletePayroll(id);
        loadData();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
         <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Generate Payroll</Button>
      </div>

      <div className="border rounded-md bg-card">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Base Salary</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {payrolls.map(record => {
                  const emp = employees.find(e => e.id === record.employee_id);
                  return (
                     <TableRow key={record.id}>
                        <TableCell>
                            <div className="font-medium">{emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown'}</div>
                        </TableCell>
                        <TableCell>{record.month}/{record.year}</TableCell>
                        <TableCell>{record.salary}</TableCell>
                        <TableCell className="font-bold">{record.net_salary}</TableCell>
                        <TableCell className="capitalize">{record.payment_status}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(record.id)}>Delete</Button>
                        </TableCell>
                     </TableRow>
                  );
               })}
               {payrolls.length === 0 && !loading && <TableRow><TableCell colSpan={6} className="text-center py-8">No payroll records</TableCell></TableRow>}
            </TableBody>
         </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Generate Payroll</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label>Employee</Label>
                      <Select value={formData.employee_id} onValueChange={val => {
                         const emp = employees.find(e => e.id === val);
                         setFormData({...formData, employee_id: val, salary: emp?.salary || 0 });
                      }}>
                         <SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger>
                         <SelectContent>
                            {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</SelectItem>)}
                         </SelectContent>
                      </Select>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                       <div className="space-y-2"><Label>Month</Label><Input type="number" min="1" max="12" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} /></div>
                       <div className="space-y-2"><Label>Year</Label><Input type="number" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} /></div>
                   </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2"><Label>Base Salary</Label><Input type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} /></div>
                   <div className="space-y-2"><Label>Bonuses</Label><Input type="number" value={formData.bonuses} onChange={e => setFormData({...formData, bonuses: e.target.value})} /></div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2"><Label>Deductions</Label><Input type="number" value={formData.deductions} onChange={e => setFormData({...formData, deductions: e.target.value})} /></div>
                   <div className="space-y-2"><Label>Tax</Label><Input type="number" value={formData.tax} onChange={e => setFormData({...formData, tax: e.target.value})} /></div>
               </div>

               <div className="p-4 bg-muted rounded-md flex justify-between items-center">
                   <span className="font-semibold">Net Salary:</span>
                   <span className="text-xl font-bold">{formData.net_salary}</span>
               </div>
               
               <div className="space-y-2">
                  <Label>Payment Status</Label>
                  <Select value={formData.payment_status} onValueChange={val => setFormData({...formData, payment_status: val})}>
                     <SelectTrigger><SelectValue /></SelectTrigger>
                     <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               <DialogFooter><Button type="submit" disabled={loading}>Generate</Button></DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayrollManagement;