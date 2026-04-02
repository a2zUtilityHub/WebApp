import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useHRManagement } from '@/hooks/useHRManagement';
import { LeaveStatusBadge } from './HRBadges';
import { Loader2, Plus, Check, X as XIcon } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const LeaveManagement = () => {
  const { fetchLeaveRequests, createLeaveRequest, approveLeaveRequest, rejectLeaveRequest, fetchEmployees, loading } = useHRManagement();
  const { user } = useAuth(); // Assuming logged in admin approves
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    leave_type: 'Annual',
    start_date: '',
    end_date: '',
    days: 1,
    reason: '',
    status: 'pending'
  });

  const loadData = async () => {
    const data = await fetchLeaveRequests();
    setLeaves(data || []);
    const emps = await fetchEmployees();
    setEmployees(emps || []);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createLeaveRequest(formData);
    setIsModalOpen(false);
    loadData();
  };

  const handleApprove = async (id) => {
    if(!user?.id) return; // Guard clause
    await approveLeaveRequest(id, user.id); 
    loadData();
  };

  const handleReject = async (id) => {
    await rejectLeaveRequest(id);
    loadData();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
         <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> New Leave Request</Button>
      </div>

      <div className="border rounded-md bg-card">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {leaves.map(leave => {
                  const emp = employees.find(e => e.id === leave.employee_id);
                  return (
                     <TableRow key={leave.id}>
                        <TableCell>
                            <div className="font-medium">{emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown'}</div>
                        </TableCell>
                        <TableCell>{leave.leave_type}</TableCell>
                        <TableCell className="text-sm">
                           {leave.start_date} to {leave.end_date}
                        </TableCell>
                        <TableCell>{leave.days}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{leave.reason}</TableCell>
                        <TableCell><LeaveStatusBadge status={leave.status} /></TableCell>
                        <TableCell className="text-right space-x-1">
                            {leave.status === 'pending' && (
                                <>
                                    <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApprove(leave.id)}>
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleReject(leave.id)}>
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </TableCell>
                     </TableRow>
                  );
               })}
               {leaves.length === 0 && !loading && <TableRow><TableCell colSpan={7} className="text-center py-8">No leave requests found</TableCell></TableRow>}
            </TableBody>
         </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogContent>
            <DialogHeader><DialogTitle>New Leave Request</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <Label>Employee</Label>
                  <Select value={formData.employee_id} onValueChange={val => setFormData({...formData, employee_id: val})}>
                     <SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger>
                     <SelectContent>
                        {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</SelectItem>)}
                     </SelectContent>
                  </Select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={formData.leave_type} onValueChange={val => setFormData({...formData, leave_type: val})}>
                         <SelectTrigger><SelectValue /></SelectTrigger>
                         <SelectContent>
                            <SelectItem value="Annual">Annual</SelectItem>
                            <SelectItem value="Sick">Sick</SelectItem>
                            <SelectItem value="Casual">Casual</SelectItem>
                            <SelectItem value="Maternity">Maternity</SelectItem>
                            <SelectItem value="Paternity">Paternity</SelectItem>
                            <SelectItem value="Unpaid">Unpaid</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2"><Label>Days</Label><Input type="number" min="0.5" step="0.5" value={formData.days} onChange={e => setFormData({...formData, days: e.target.value})} /></div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2"><Label>Start Date</Label><Input type="date" required value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} /></div>
                   <div className="space-y-2"><Label>End Date</Label><Input type="date" required value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} /></div>
               </div>
               <div className="space-y-2"><Label>Reason</Label><Textarea value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} /></div>
               <DialogFooter><Button type="submit" disabled={loading}>Submit Request</Button></DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveManagement;