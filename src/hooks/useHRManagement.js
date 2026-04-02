import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useHRManagement = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleError = (error, action) => {
    console.error(`Error ${action}:`, error);
    toast({
      title: 'Error',
      description: error.message || `Failed to ${action}`,
      variant: 'destructive',
    });
    setLoading(false);
  };

  const sanitizeData = (data) => {
    const cleaned = { ...data };
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === '') cleaned[key] = null;
      // Convert numeric strings to numbers for specific fields if strictly needed, 
      // but Postgres usually handles clean strings. 
      // The main issue is empty strings "" for numeric/date columns.
    });
    return cleaned;
  };

  const genericFetch = async (table, filters = {}) => {
    setLoading(true);
    try {
      let query = supabase.from(table).select('*');
      
      // Apply filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== '' && filters[key] !== 'all') {
            // Handle date ranges separately if needed, but for now simple equality/ilike
            if (key === 'searchQuery') {
                // Assuming standard search columns
                if (table === 'employees') {
                    query = query.or(`first_name.ilike.%${filters[key]}%,last_name.ilike.%${filters[key]}%,email.ilike.%${filters[key]}%`);
                } else if (table === 'departments') {
                    query = query.ilike('name', `%${filters[key]}%`);
                }
            } else if (key === 'startDate') {
                query = query.gte('created_at', filters[key]);
            } else if (key === 'endDate') {
                query = query.lte('created_at', filters[key]);
            } else {
                query = query.eq(key, filters[key]);
            }
        }
      });

      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (error) {
      handleError(error, `fetch ${table}`);
      return [];
    }
  };

  const genericCreate = async (table, data) => {
    setLoading(true);
    try {
      const cleanedData = sanitizeData(data);
      const { data: result, error } = await supabase.from(table).insert(cleanedData).select().single();
      if (error) throw error;
      toast({ title: 'Success', description: 'Record created successfully' });
      setLoading(false);
      return result;
    } catch (error) {
      handleError(error, `create in ${table}`);
      return null;
    }
  };

  const genericUpdate = async (table, id, data) => {
    setLoading(true);
    try {
      const cleanedData = sanitizeData(data);
      const { data: result, error } = await supabase.from(table).update(cleanedData).eq('id', id).select().single();
      if (error) throw error;
      toast({ title: 'Success', description: 'Record updated successfully' });
      setLoading(false);
      return result;
    } catch (error) {
      handleError(error, `update in ${table}`);
      return null;
    }
  };

  const genericDelete = async (table, id) => {
    setLoading(true);
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Record deleted successfully' });
      setLoading(false);
      return true;
    } catch (error) {
      handleError(error, `delete from ${table}`);
      return false;
    }
  };

  // Specific wrappers
  const fetchEmployees = (filters) => genericFetch('employees', filters);
  const createEmployee = (data) => genericCreate('employees', data);
  const updateEmployee = (id, data) => genericUpdate('employees', id, data);
  const deleteEmployee = (id) => genericDelete('employees', id);
  const getEmployeeById = async (id) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('employees').select('*').eq('id', id).single();
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (error) {
      handleError(error, 'fetch employee details');
      return null;
    }
  };

  const fetchDepartments = (filters) => genericFetch('departments', filters);
  const createDepartment = (data) => genericCreate('departments', data);
  const updateDepartment = (id, data) => genericUpdate('departments', id, data);
  const deleteDepartment = (id) => genericDelete('departments', id);

  const fetchRoles = () => genericFetch('hr_roles');
  const createRole = (data) => genericCreate('hr_roles', data);
  const updateRole = (id, data) => genericUpdate('hr_roles', id, data);
  const deleteRole = (id) => genericDelete('hr_roles', id);

  const fetchAttendance = (filters) => genericFetch('attendance', filters);
  const markAttendance = (data) => genericCreate('attendance', data);
  const bulkMarkAttendance = async (records) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('attendance').insert(records);
      if (error) throw error;
      toast({ title: 'Success', description: `${records.length} records updated` });
      setLoading(false);
      return true;
    } catch (error) {
      handleError(error, 'bulk mark attendance');
      return false;
    }
  };
  const updateAttendance = (id, data) => genericUpdate('attendance', id, data);
  const deleteAttendance = (id) => genericDelete('attendance', id);


  const fetchLeaveRequests = (filters) => genericFetch('leave_requests', filters);
  const createLeaveRequest = (data) => genericCreate('leave_requests', data);
  const approveLeaveRequest = (id, approvedBy) => genericUpdate('leave_requests', id, { status: 'approved', approved_by: approvedBy, approval_date: new Date() });
  const rejectLeaveRequest = (id) => genericUpdate('leave_requests', id, { status: 'rejected' });
  const updateLeaveRequest = (id, data) => genericUpdate('leave_requests', id, data);
  const deleteLeaveRequest = (id) => genericDelete('leave_requests', id);

  const fetchPayroll = (filters) => genericFetch('payroll', filters);
  const createPayroll = (data) => genericCreate('payroll', data);
  const updatePayroll = (id, data) => genericUpdate('payroll', id, data);
  const deletePayroll = (id) => genericDelete('payroll', id);

  const fetchDocuments = (filters) => genericFetch('employee_documents', filters);
  const uploadDocument = (data) => genericCreate('employee_documents', data);
  const deleteDocument = (id) => genericDelete('employee_documents', id);

  
  const fetchDashboardMetrics = async () => {
    setLoading(true);
    try {
      const [
        { count: totalEmployees },
        { count: activeEmployees },
        { count: departmentsCount },
        { count: pendingLeaves },
        { count: todayAttendance }
      ] = await Promise.all([
        supabase.from('employees').select('*', { count: 'exact', head: true }),
        supabase.from('employees').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('departments').select('*', { count: 'exact', head: true }),
        supabase.from('leave_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('date', new Date().toISOString().split('T')[0])
      ]);

      setLoading(false);
      return {
        totalEmployees: totalEmployees || 0,
        activeEmployees: activeEmployees || 0,
        departmentsCount: departmentsCount || 0,
        pendingLeaves: pendingLeaves || 0,
        todayAttendance: todayAttendance || 0
      };
    } catch (error) {
      // Don't toast for dashboard metrics to avoid spamming on load
      console.error('Error fetching metrics', error);
      setLoading(false);
      return null;
    }
  };

  return {
    loading,
    fetchEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployeeById,
    fetchDepartments, createDepartment, updateDepartment, deleteDepartment,
    fetchRoles, createRole, updateRole, deleteRole,
    fetchAttendance, markAttendance, bulkMarkAttendance, updateAttendance, deleteAttendance,
    fetchLeaveRequests, createLeaveRequest, approveLeaveRequest, rejectLeaveRequest, updateLeaveRequest, deleteLeaveRequest,
    fetchPayroll, createPayroll, updatePayroll, deletePayroll,
    fetchDocuments, uploadDocument, deleteDocument,
    fetchDashboardMetrics
  };
};