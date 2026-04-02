import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, UserMinus, Activity, RefreshCw, Briefcase, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHRManagement } from '@/hooks/useHRManagement';
import { Skeleton } from '@/components/ui/skeleton';
import AddEmployeeQuickAction from './AddEmployeeQuickAction';
import MarkAttendanceQuickAction from './MarkAttendanceQuickAction';
import ReviewLeavesQuickAction from './ReviewLeavesQuickAction';
import ProcessPayrollQuickAction from './ProcessPayrollQuickAction';

const StatCard = ({ title, value, icon: Icon, description, colorClass }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const HRDashboard = () => {
  const { fetchDashboardMetrics, loading } = useHRManagement();
  const [metrics, setMetrics] = useState(null);

  // Quick Action Modal States
  const [modals, setModals] = useState({
    addEmployee: false,
    attendance: false,
    leaves: false,
    payroll: false
  });

  const loadData = async () => {
    const data = await fetchDashboardMetrics();
    if (data) setMetrics(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleModal = (key, value) => {
    setModals(prev => ({ ...prev, [key]: value }));
  };

  if (loading && !metrics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Overview</h3>
        <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={metrics?.totalEmployees || 0}
          icon={Users}
          description="Total registered employees"
          colorClass="text-blue-500"
        />
        <StatCard
          title="Active Employees"
          value={metrics?.activeEmployees || 0}
          icon={UserPlus}
          description="Currently working"
          colorClass="text-green-500"
        />
        <StatCard
          title="Departments"
          value={metrics?.departmentsCount || 0}
          icon={Briefcase}
          description="Active departments"
          colorClass="text-purple-500"
        />
        <StatCard
          title="Pending Leaves"
          value={metrics?.pendingLeaves || 0}
          icon={Calendar}
          description="Awaiting approval"
          colorClass="text-orange-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
             <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
             <p className="text-sm text-muted-foreground w-full mb-2">Access frequently used HR functions quickly.</p>
             <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" className="w-full justify-start" onClick={() => toggleModal('addEmployee', true)}>
                    Add Employee
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => toggleModal('attendance', true)}>
                    Mark Attendance
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => toggleModal('leaves', true)}>
                    Review Leaves
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => toggleModal('payroll', true)}>
                    Process Payroll
                </Button>
             </div>
          </CardContent>
        </Card>

        <Card>
           <CardHeader>
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="space-y-2">
                 <div className="flex justify-between items-center text-sm">
                    <span>Attendance Today</span>
                    <span className="font-bold">{metrics?.todayAttendance || 0} records</span>
                 </div>
                 <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: '65%' }}></div>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Quick Action Modals */}
      <AddEmployeeQuickAction 
        isOpen={modals.addEmployee} 
        onClose={() => toggleModal('addEmployee', false)} 
        onSuccess={() => { loadData(); }}
      />
      
      <MarkAttendanceQuickAction 
        isOpen={modals.attendance} 
        onClose={() => toggleModal('attendance', false)} 
        onSuccess={() => { loadData(); }}
      />
      
      <ReviewLeavesQuickAction 
        isOpen={modals.leaves} 
        onClose={() => toggleModal('leaves', false)} 
        onSuccess={() => { loadData(); }}
      />
      
      <ProcessPayrollQuickAction 
        isOpen={modals.payroll} 
        onClose={() => toggleModal('payroll', false)} 
        onSuccess={() => { loadData(); }}
      />
    </div>
  );
};

export default HRDashboard;