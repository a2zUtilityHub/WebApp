import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit2, Trash2, Eye, Filter, Loader2 } from 'lucide-react';
import { useHRManagement } from '@/hooks/useHRManagement';
import { StatusBadge } from './HRBadges';
import EmployeeForm from './EmployeeForm';
import EmployeeDetail from './EmployeeDetail';
import { useToast } from '@/components/ui/use-toast';

const EmployeesList = () => {
  const { fetchEmployees, deleteEmployee, fetchDepartments, loading } = useHRManagement();
  const { toast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  // Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const loadData = async () => {
    const data = await fetchEmployees();
    setEmployees(data || []);
    const depts = await fetchDepartments();
    setDepartments(depts || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      await deleteEmployee(id);
      loadData();
    }
  };

  const filtered = employees.filter(emp => {
    const matchesSearch = 
      emp.first_name?.toLowerCase().includes(search.toLowerCase()) || 
      emp.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_id?.toLowerCase().includes(search.toLowerCase());
    
    const matchesDept = deptFilter === 'all' || String(emp.department_id) === deptFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-1">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
               placeholder="Search employees..." 
               className="pl-8" 
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
           </div>
           
           <Select value={deptFilter} onValueChange={setDeptFilter}>
               <SelectTrigger className="w-[180px]">
                   <Filter className="w-4 h-4 mr-2" />
                   <SelectValue placeholder="Department" />
               </SelectTrigger>
               <SelectContent>
                   <SelectItem value="all">All Departments</SelectItem>
                   {departments.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
               </SelectContent>
           </Select>

           <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="w-[150px]">
                   <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent>
                   <SelectItem value="all">All Status</SelectItem>
                   <SelectItem value="active">Active</SelectItem>
                   <SelectItem value="inactive">Inactive</SelectItem>
                   <SelectItem value="terminated">Terminated</SelectItem>
                   <SelectItem value="on-leave">On Leave</SelectItem>
               </SelectContent>
           </Select>
        </div>
        
        <Button onClick={() => { setSelectedEmployee(null); setIsFormOpen(true); }}>
           <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(employee => (
              <TableRow key={employee.id} className="hover:bg-muted/50">
                <TableCell className="font-mono text-xs">{employee.employee_id}</TableCell>
                <TableCell className="font-medium">
                    <div className="flex flex-col">
                        <span>{employee.first_name} {employee.last_name}</span>
                        <span className="text-xs text-muted-foreground">{employee.role_id ? 'Role ' + employee.role_id : ''}</span>
                    </div>
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.employment_type}</TableCell>
                <TableCell><StatusBadge status={employee.status} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" title="View Profile" onClick={() => { setSelectedEmployee(employee); setIsDetailOpen(true); }}>
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Edit" onClick={() => { setSelectedEmployee(employee); setIsFormOpen(true); }}>
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete" className="text-destructive hover:text-destructive" onClick={() => handleDelete(employee.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && !loading && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No employees found matching your criteria</TableCell></TableRow>
            )}
            {loading && (
              <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isFormOpen && (
        <EmployeeForm 
           open={isFormOpen} 
           onClose={() => setIsFormOpen(false)} 
           initialData={selectedEmployee}
           onSuccess={loadData}
        />
      )}

      {isDetailOpen && selectedEmployee && (
        <EmployeeDetail 
            open={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            employee={selectedEmployee}
            onEdit={() => { setIsDetailOpen(false); setIsFormOpen(true); }}
        />
      )}
    </div>
  );
};

export default EmployeesList;