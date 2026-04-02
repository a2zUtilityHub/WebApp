import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useHRManagement } from '@/hooks/useHRManagement';
import { useToast } from '@/components/ui/use-toast';

const EmployeeForm = ({ open, onClose, initialData, onSuccess }) => {
  const { createEmployee, updateEmployee, fetchDepartments, fetchRoles, loading } = useHRManagement();
  const { toast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    employee_id: '',
    department_id: '',
    role_id: '',
    manager_id: '',
    hire_date: new Date().toISOString().split('T')[0],
    employment_type: 'Full-time',
    salary: '',
    currency: 'USD',
    status: 'active'
  });

  useEffect(() => {
    if (open) {
      loadDependencies();
      if (initialData) {
        setFormData(prev => ({ ...prev, ...initialData }));
      } else {
        // Reset form for new entry
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            dob: '',
            gender: '',
            address: '',
            city: '',
            state: '',
            country: '',
            postal_code: '',
            employee_id: '',
            department_id: '',
            role_id: '',
            manager_id: '',
            hire_date: new Date().toISOString().split('T')[0],
            employment_type: 'Full-time',
            salary: '',
            currency: 'USD',
            status: 'active'
        });
      }
    }
  }, [open, initialData]);

  const loadDependencies = async () => {
    const depts = await fetchDepartments();
    const hrRoles = await fetchRoles();
    if(depts) setDepartments(depts);
    if(hrRoles) setRoles(hrRoles);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.employee_id) {
      toast({ title: "Validation Error", description: "Please fill in all required fields (Name, Email, Employee ID).", variant: "destructive" });
      return false;
    }
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        toast({ title: "Validation Error", description: "Please enter a valid email address.", variant: "destructive" });
        return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let result;
    if (initialData?.id) {
      result = await updateEmployee(initialData.id, formData);
    } else {
      result = await createEmployee(formData);
    }

    if (result) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Personal Info */}
             <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Personal Details</Label>
                <Input placeholder="First Name *" required value={formData.first_name} onChange={e => handleChange('first_name', e.target.value)} />
                <Input placeholder="Last Name *" required value={formData.last_name} onChange={e => handleChange('last_name', e.target.value)} />
                <Input placeholder="Email *" type="email" required value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                <Input placeholder="Phone" value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="DOB" value={formData.dob || ''} onChange={e => handleChange('dob', e.target.value)} />
                    <Select value={formData.gender || ''} onValueChange={val => handleChange('gender', val)}>
                        <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
             </div>

             {/* Address */}
             <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Address</Label>
                <Input placeholder="Address" value={formData.address || ''} onChange={e => handleChange('address', e.target.value)} />
                <Input placeholder="City" value={formData.city || ''} onChange={e => handleChange('city', e.target.value)} />
                <Input placeholder="State" value={formData.state || ''} onChange={e => handleChange('state', e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Country" value={formData.country || ''} onChange={e => handleChange('country', e.target.value)} />
                    <Input placeholder="Postal Code" value={formData.postal_code || ''} onChange={e => handleChange('postal_code', e.target.value)} />
                </div>
             </div>

             {/* Employment Info */}
             <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Employment</Label>
                <Input placeholder="Employee ID *" required value={formData.employee_id} onChange={e => handleChange('employee_id', e.target.value)} />
                
                <Select value={formData.department_id ? String(formData.department_id) : ''} onValueChange={val => handleChange('department_id', val)}>
                   <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                   <SelectContent>
                      {departments.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                   </SelectContent>
                </Select>

                <Select value={formData.role_id ? String(formData.role_id) : ''} onValueChange={val => handleChange('role_id', val)}>
                   <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                   <SelectContent>
                      {roles.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}
                   </SelectContent>
                </Select>

                <Select value={formData.employment_type} onValueChange={val => handleChange('employment_type', val)}>
                   <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                   <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Intern">Intern</SelectItem>
                   </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="Hire Date" required value={formData.hire_date} onChange={e => handleChange('hire_date', e.target.value)} />
                    <Select value={formData.status} onValueChange={val => handleChange('status', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                        <SelectItem value="on-leave">On Leave</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Salary" type="number" value={formData.salary || ''} onChange={e => handleChange('salary', e.target.value)} />
                    <Input placeholder="Currency" value={formData.currency || 'USD'} onChange={e => handleChange('currency', e.target.value)} />
                </div>
             </div>
          </div>
          
          <DialogFooter>
             <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
             <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? 'Update Employee' : 'Create Employee'}
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeForm;