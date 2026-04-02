import React, { useState, useEffect } from 'react';
import QuickActionModal from './QuickActionModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useHRManagement } from '@/hooks/useHRManagement';
import { Loader2, CheckSquare, Square } from 'lucide-react';
import { format } from 'date-fns';

const MarkAttendanceQuickAction = ({ isOpen, onClose, onSuccess }) => {
  const { fetchEmployees, bulkMarkAttendance, loading: hookLoading } = useHRManagement();
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMap, setAttendanceMap] = useState({}); // { employeeId: status }
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

  const loadEmployees = async () => {
    const data = await fetchEmployees({ status: 'active' });
    if (data) {
      setEmployees(data);
      // Initialize all as present by default or empty? Let's say present is a good default for bulk
      const initialMap = {};
      data.forEach(emp => {
        initialMap[emp.id] = 'present';
      });
      setAttendanceMap(initialMap);
    }
  };

  const handleStatusChange = (employeeId, status) => {
    setAttendanceMap(prev => ({ ...prev, [employeeId]: status }));
  };

  const markAll = (status) => {
    const newMap = {};
    employees.forEach(emp => {
      newMap[emp.id] = status;
    });
    setAttendanceMap(newMap);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const records = employees.map(emp => ({
      employee_id: emp.id,
      date: date,
      status: attendanceMap[emp.id],
      check_in_time: attendanceMap[emp.id] === 'present' || attendanceMap[emp.id] === 'late' ? '09:00' : null,
      check_out_time: attendanceMap[emp.id] === 'present' || attendanceMap[emp.id] === 'late' ? '17:00' : null,
      notes: 'Bulk entry'
    }));

    const success = await bulkMarkAttendance(records);
    setSubmitting(false);
    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <QuickActionModal
      title="Mark Daily Attendance"
      isOpen={isOpen}
      onClose={onClose}
      size="max-w-4xl"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg">
          <div className="flex-1">
            <Label>Select Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1" />
          </div>
          <div className="flex items-end gap-2">
             <Button variant="outline" size="sm" onClick={() => markAll('present')}>Mark All Present</Button>
             <Button variant="outline" size="sm" onClick={() => markAll('absent')}>Mark All Absent</Button>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden max-h-[50vh] overflow-y-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map(emp => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">
                    {emp.first_name} {emp.last_name}
                    <div className="text-xs text-muted-foreground">{emp.employee_id}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{emp.department_id || '-'}</TableCell>
                  <TableCell>
                    <Select 
                      value={attendanceMap[emp.id]} 
                      onValueChange={(val) => handleStatusChange(emp.id, val)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="leave">On Leave</SelectItem>
                        <SelectItem value="half-day">Half Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {employees.length === 0 && !hookLoading && (
                <TableRow><TableCell colSpan={3} className="text-center py-4">No active employees found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting || employees.length === 0}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Attendance
          </Button>
        </div>
      </div>
    </QuickActionModal>
  );
};

export default MarkAttendanceQuickAction;