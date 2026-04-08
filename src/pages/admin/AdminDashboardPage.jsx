import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseResponsive from '@/components/ads/AdSenseResponsive';
import AdSenseVertical from '@/components/ads/AdSenseVertical';

const StatCard = ({ title, value, icon: Icon, loading, prefix = "" }) => (
  <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 relative overflow-hidden group bg-card">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
      <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</CardTitle>
      <div className="p-2 bg-muted rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      {loading ? (
        <div className="space-y-2 mt-1">
          <Skeleton className="h-8 w-[60%] rounded-lg" />
        </div>
      ) : (
        <div className="text-3xl font-bold tracking-tight">{prefix}{value}</div>
      )}
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
          <Card className="col-span-1 border-border/50 shadow-sm transition-all hover:shadow-md">
            <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
              {loading ? (
                <div className="w-full h-full flex flex-col justify-end space-y-2">
                   <Skeleton className="h-[200px] w-full rounded-xl opacity-50" />
                   <div className="flex justify-between"><Skeleton className="h-4 w-12"/><Skeleton className="h-4 w-12"/></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.75rem', color: 'hsl(var(--card-foreground))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1 border-border/50 shadow-sm transition-all hover:shadow-md">
            <CardHeader><CardTitle>Order Status Breakdown</CardTitle></CardHeader>
            <CardContent className="h-[300px] flex justify-center items-center relative">
              {loading ? (
                <div className="relative flex items-center justify-center w-full h-full">
                   <Skeleton className="w-[200px] h-[200px] rounded-full absolute opacity-20" />
                   <div className="w-[120px] h-[120px] rounded-full bg-card absolute z-10" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.orderStatusBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {data.orderStatusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem', color: 'hsl(var(--card-foreground))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
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