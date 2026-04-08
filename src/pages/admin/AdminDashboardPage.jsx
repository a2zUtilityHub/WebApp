import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseResponsive from '@/components/ads/AdSenseResponsive';
import AdSenseVertical from '@/components/ads/AdSenseVertical';

const StatCard = ({ title, value, icon: Icon, loading, prefix = "" }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{prefix}{value}</div>}
    </CardContent>
  </Card>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7'];

const AdminDashboardPage = () => {
  const { adminUser } = useAuth();
  const [days, setDays] = useState("30");
  const { data, loading } = useDashboardData(parseInt(days));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 p-6 flex flex-col xl:flex-row gap-6">
      <div className="flex-1 space-y-8">
        <Helmet><title>Analytics Dashboard - Admin</title></Helmet>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-brand-primary/10 to-transparent p-6 rounded-xl border border-brand-primary/20">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">Performance overview and business metrics.</p>
          </div>
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Revenue" value={data.totalRevenue.toLocaleString()} prefix="$" icon={DollarSign} loading={loading} />
          <StatCard title="Total Orders" value={data.totalOrders} icon={ShoppingCart} loading={loading} />
          <StatCard title="Total Users" value={data.totalUsers} icon={Users} loading={loading} />
          <StatCard title="Active Sessions" value={Math.floor(data.totalUsers * 0.15)} icon={Activity} loading={loading} />
        </div>

        <AdSenseContainer>
          <AdSenseResponsive slot="admin_dashboard_mid" />
        </AdSenseContainer>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
              {loading ? <Skeleton className="w-full h-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader><CardTitle>Order Status Breakdown</CardTitle></CardHeader>
            <CardContent className="h-[300px] flex justify-center">
              {loading ? <Skeleton className="w-full h-full rounded-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.orderStatusBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {data.orderStatusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="hidden xl:block w-[300px] shrink-0 pt-8">
         <AdSenseContainer className="sticky top-24">
            <AdSenseVertical slot="admin_dashboard_sidebar" />
         </AdSenseContainer>
      </div>
    </div>
  );
};

export default AdminDashboardPage;