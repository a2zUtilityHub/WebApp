import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp,
  Users
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const StatsCard = ({ title, value, icon: Icon, description, trend, colorClass = "text-primary" }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`p-2 rounded-full ${colorClass.replace('text-', 'bg-').replace('600', '100')} dark:bg-opacity-20`}>
        <Icon className={`h-4 w-4 ${colorClass}`} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {(description || trend) && (
        <p className="text-xs text-muted-foreground mt-1">
          {trend && <span className="text-green-500 font-medium flex items-center gap-1 inline-flex mr-1"><TrendingUp className="h-3 w-3" />{trend}</span>}
          {description}
        </p>
      )}
    </CardContent>
  </Card>
);

const AdminSupportDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    urgent: 0
  });
  const [priorityData, setPriorityData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Parallel requests for dashboard stats
        const [
          { count: total },
          { count: open },
          { count: inProgress },
          { count: resolved },
          { count: urgent },
          { count: high },
          { count: medium },
          { count: low }
        ] = await Promise.all([
          supabase.from('support_tickets').select('*', { count: 'exact', head: true }),
          supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'Open'),
          supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'In Progress'),
          supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'Resolved'),
          supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('priority', 'Urgent'),
          supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('priority', 'High'),
          supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('priority', 'Medium'),
          supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('priority', 'Low'),
        ]);

        setStats({
          total: total || 0,
          open: open || 0,
          inProgress: inProgress || 0,
          resolved: resolved || 0,
          urgent: urgent || 0
        });

        setPriorityData([
          { name: 'Low', count: low || 0, color: '#22c55e' },
          { name: 'Medium', count: medium || 0, color: '#eab308' },
          { name: 'High', count: high || 0, color: '#f97316' },
          { name: 'Urgent', count: urgent || 0, color: '#ef4444' }
        ]);
        
        setStatusData([
           { name: 'Open', count: open || 0 },
           { name: 'In Progress', count: inProgress || 0 },
           { name: 'Resolved', count: resolved || 0 },
           { name: 'Closed', count: (total || 0) - (open + inProgress + resolved) }
        ]);

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
        <Skeleton className="h-[300px] md:col-span-2 lg:col-span-4 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Tickets" 
          value={stats.total} 
          icon={MessageSquare} 
          description="All time support requests"
          colorClass="text-blue-600"
        />
        <StatsCard 
          title="Open Tickets" 
          value={stats.open} 
          icon={AlertCircle} 
          description="Requires attention"
          colorClass="text-red-600"
        />
        <StatsCard 
          title="In Progress" 
          value={stats.inProgress} 
          icon={Clock} 
          description="Being worked on"
          colorClass="text-yellow-600"
        />
        <StatsCard 
          title="Resolved" 
          value={stats.resolved} 
          icon={CheckCircle2} 
          description="Successfully closed"
          colorClass="text-green-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Priority Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tickets by Priority</CardTitle>
            <CardDescription>Distribution of current ticket priorities</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#88888820" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tickLine={false} 
                    axisLine={false} 
                    width={80}
                    tick={{ fontSize: 12 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ticket Status</CardTitle>
            <CardDescription>Overview of workflow state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      item.name === 'Open' ? 'bg-red-500' :
                      item.name === 'In Progress' ? 'bg-yellow-500' :
                      item.name === 'Resolved' ? 'bg-green-500' : 'bg-slate-500'
                    }`} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{item.count}</span>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                           item.name === 'Open' ? 'bg-red-500' :
                           item.name === 'In Progress' ? 'bg-yellow-500' :
                           item.name === 'Resolved' ? 'bg-green-500' : 'bg-slate-500'
                        }`}
                        style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSupportDashboard;