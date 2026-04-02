import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useHRManagement } from '@/hooks/useHRManagement';
import { AttendanceStatusBadge } from './HRBadges';
import { Loader2, Plus, Download, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const AttendanceManagement = () => {
  const { fetchAttendance, markAttendance, fetchEmployees, loading } = useHRManagement();
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    check_in_time: '09:00',
    check_out_time: '17:00',
    notes: ''
  });

  const loadData = async () => {
    const data = await fetchAttendance({ date: dateFilter });
    setAttendance(data || []);
    const emps = await fetchEmployees();
    setEmployees(emps || []);
  };

  useEffect(() => {
    loadData();
  }, [dateFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await markAttendance(formData);
    setIsModalOpen(false);
    loadData();
  };

  const exportCSV = () => {
    const headers = ['Date', 'Employee ID', 'Name', 'Status', 'Check In', 'Check Out'];
    const rows = attendance.map(a => {
        const emp = employees.find(e => e.id === a.employee_id);
        return [
            a.date,
            emp?.employee_id || '-',
            emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown',
            a.status,
            a.check_in_time,
            a.check_out_time
        ].join(',');
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_${dateFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4 flex-wrap">
         <div className="flex items-center gap-2">
            <Input 
                type="date" 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)} 
                className="w-40"
            />
            <Button variant="outline" size="icon" onClick={loadData} title="Refresh">
                <CalendarIcon className="h-4 w-4" />
            </Button>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
            <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Mark Attendance</Button>
         </div>
      </div>

      <div className="border rounded-md bg-card">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Notes</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {attendance.map(record => {
                  const emp = employees.find(e => e.id === record.employee_id);
                  return (
                     <TableRow key={record.id}>
                        <TableCell>
                            <div className="font-medium">{emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground">{emp?.employee_id}</div>
                        </TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell><AttendanceStatusBadge status={record.status} /></TableCell>
                        <TableCell className="text-sm">
                           In: {record.check_in_time || '-'}<br/>
                           Out: {record.check_out_time || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{record.notes}</TableCell>
                     </TableRow>
                  );
               })}
               {attendance.length === 0 && !loading && <TableRow><TableCell colSpan={5} className="text-center py-8">No records found for this date</TableCell></TableRow>}
               {loading && <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow>}
            </TableBody>
         </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogContent>
            <DialogHeader><DialogTitle>Mark Attendance</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <Label>Employee</Label>
                  <Select value={formData.employee_id} onValueChange={val => setFormData({...formData, employee_id: val})}>
                     <SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger>
                     <SelectContent>
                        {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_id})</SelectItem>)}
                     </SelectContent>
                  </Select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2"><Label>Date</Label><Input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                   <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={formData.status} onValueChange={val => setFormData({...formData, status: val})}>
                         <SelectTrigger><SelectValue /></SelectTrigger>
                         <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                            <SelectItem value="half-day">Half Day</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2"><Label>Check In</Label><Input type="time" value={formData.check_in_time} onChange={e => setFormData({...formData, check_in_time: e.target.value})} /></div>
                   <div className="space-y-2"><Label>Check Out</Label><Input type="time" value={formData.check_out_time} onChange={e => setFormData({...formData, check_out_time: e.target.value})} /></div>
               </div>
               <div className="space-y-2"><Label>Notes</Label><Input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} /></div>
               <DialogFooter><Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button></DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendanceManagement;