import React, { useState, useEffect } from 'react';
import QuickActionModal from './QuickActionModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useHRManagement } from '@/hooks/useHRManagement';
import { Loader2 } from 'lucide-react';

const ProcessPayrollQuickAction = ({ isOpen, onClose, onSuccess }) => {
  const { fetchEmployees, createPayroll, loading: hookLoading } = useHRManagement();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
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
      // Select all by default? Or none? Let's select all active employees
      setSelectedEmployees(new Set(data.map(e => e.id)));
    }
  };

  const toggleSelection = (id) => {
    const newSet = new Set(selectedEmployees);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedEmployees(newSet);
  };

  const toggleAll = (checked) => {
    if (checked) {
      setSelectedEmployees(new Set(employees.map(e => e.id)));
    } else {
      setSelectedEmployees(new Set());
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const [year, monthStr] = month.split('-');
    
    // Batch process sequentially or parallel? Parallel promises.
    // NOTE: Real payroll should probably be a backend transaction. For this frontend-driven task:
    const promises = Array.from(selectedEmployees).map(async (empId) => {
      const emp = employees.find(e => e.id === empId);
      if (!emp) return null;
      
      const salary = Number(emp.salary) || 0;
      // Simple logic: no deductions/bonus auto-calculated here, just base salary
      const payrollData = {
        employee_id: empId,
        month: parseInt(monthStr),
        year: parseInt(year),
        salary: salary,
        deductions: 0,
        bonuses: 0,
        tax: 0,
        net_salary: salary, 
        payment_status: 'pending'
      };
      
      return createPayroll(payrollData);
    });

    await Promise.all(promises);
    setSubmitting(false);
    onSuccess?.();
    onClose();
  };

  return (
    <QuickActionModal
      title="Process Payroll"
      isOpen={isOpen}
      onClose={onClose}
      size="max-w-4xl"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg">
          <div className="flex-1">
             <Label>Payroll Period</Label>
             <Input type="month" value={month} onChange={e => setMonth(e.target.value)} className="mt-1" />
          </div>
          <div className="flex items-end self-end pb-1 text-sm text-muted-foreground">
             Selected: {selectedEmployees.size} / {employees.length}
          </div>
        </div>

        <div className="border rounded-md overflow-hidden max-h-[50vh] overflow-y-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={employees.length > 0 && selectedEmployees.size === employees.length}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Base Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map(emp => (
                <TableRow key={emp.id} onClick={() => toggleSelection(emp.id)} className="cursor-pointer hover:bg-muted/50">
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedEmployees.has(emp.id)}
                      onCheckedChange={() => toggleSelection(emp.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {emp.first_name} {emp.last_name}
                    <div className="text-xs text-muted-foreground">{emp.employee_id}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{emp.department_id || '-'}</TableCell>
                  <TableCell className="text-right font-mono">
                    {emp.currency} {emp.salary}
                  </TableCell>
                </TableRow>
              ))}
              {employees.length === 0 && !hookLoading && (
                <TableRow><TableCell colSpan={4} className="text-center py-4">No eligible employees found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting || selectedEmployees.size === 0}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Payroll ({selectedEmployees.size})
          </Button>
        </div>
      </div>
    </QuickActionModal>
  );
};

export default ProcessPayrollQuickAction;