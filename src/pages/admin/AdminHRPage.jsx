import React from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Users, Building2, UserCog, CalendarClock, Briefcase, Calculator, FileText } from 'lucide-react';
import HRDashboard from '@/components/admin/hr/HRDashboard';
import EmployeesList from '@/components/admin/hr/EmployeesList';
import DepartmentManagement from '@/components/admin/hr/DepartmentManagement';
import AttendanceManagement from '@/components/admin/hr/AttendanceManagement';
import LeaveManagement from '@/components/admin/hr/LeaveManagement';
import PayrollManagement from '@/components/admin/hr/PayrollManagement';
import DocumentsManagement from '@/components/admin/hr/DocumentsManagement';

const AdminHRPage = () => {
  return (
    <>
      <Helmet>
        <title>HR Management | Admin Dashboard</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Management</h1>
          <p className="text-muted-foreground">Manage employees, departments, payroll, and more.</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 flex flex-wrap h-auto gap-1">
            <TabsTrigger value="dashboard" className="gap-2"><LayoutDashboard className="h-4 w-4"/> Dashboard</TabsTrigger>
            <TabsTrigger value="employees" className="gap-2"><Users className="h-4 w-4"/> Employees</TabsTrigger>
            <TabsTrigger value="departments" className="gap-2"><Building2 className="h-4 w-4"/> Departments</TabsTrigger>
            <TabsTrigger value="attendance" className="gap-2"><CalendarClock className="h-4 w-4"/> Attendance</TabsTrigger>
            <TabsTrigger value="leave" className="gap-2"><Briefcase className="h-4 w-4"/> Leave</TabsTrigger>
            <TabsTrigger value="payroll" className="gap-2"><Calculator className="h-4 w-4"/> Payroll</TabsTrigger>
            <TabsTrigger value="documents" className="gap-2"><FileText className="h-4 w-4"/> Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="focus-visible:outline-none">
            <HRDashboard />
          </TabsContent>
          <TabsContent value="employees" className="focus-visible:outline-none">
            <EmployeesList />
          </TabsContent>
          <TabsContent value="departments" className="focus-visible:outline-none">
            <DepartmentManagement />
          </TabsContent>
          <TabsContent value="attendance" className="focus-visible:outline-none">
            <AttendanceManagement />
          </TabsContent>
          <TabsContent value="leave" className="focus-visible:outline-none">
            <LeaveManagement />
          </TabsContent>
          <TabsContent value="payroll" className="focus-visible:outline-none">
            <PayrollManagement />
          </TabsContent>
          <TabsContent value="documents" className="focus-visible:outline-none">
             <DocumentsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminHRPage;