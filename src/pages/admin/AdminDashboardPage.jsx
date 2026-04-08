import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, ShoppingCart, Activity, AlertCircle, Database, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseResponsive from '@/components/ads/AdSenseResponsive';
import AdSenseVertical from '@/components/ads/AdSenseVertical';

const StatCard = ({ title, value, icon: Icon, loading, prefix = "" }) => (
  <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/50 backdrop-blur-sm border-brand-primary/10 overflow-hidden relative group">
    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="p-2 bg-brand-primary/10 rounded-full transition-transform duration-300 group-hover:scale-110">
         <Icon className="h-4 w-4 text-brand-primary" />
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold text-gray-900">{prefix}{value}</div>}
    </CardContent>
  </Card>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7'];

const AdminDashboardPage = () => {
  const { adminUser } = useAuth();
  const [days, setDays] = useState("30");
  const { data, loading, refetch } = useDashboardData(parseInt(days));
  const [isProcessing, setIsProcessing] = useState(false);

  const isDataEmpty = !loading && data && data.totalOrders === 0 && data.totalUsers === 0;

  const handleInsertMockData = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc('admin_insert_mock_dashboard_data');
      if (error) throw error;
      alert("Mock data inserted successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to insert mock data", error);
      alert("Failed to insert mock data. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetData = async () => {
    if(!window.confirm("⚠️ Are you sure you want to clear all mock payments and temporary profiles?")) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc('admin_reset_mock_dashboard_data');
      if (error) throw error;
      alert("Mock data removed successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to reset mock data", error);
      alert("Failed to clear data.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 p-4 sm:p-6 flex flex-col xl:flex-row gap-6 w-full max-w-[100vw] overflow-x-hidden">
      <div className="flex-1 space-y-6 sm:space-y-8 min-w-0">
        <Helmet><title>Analytics Dashboard - Admin | A2Z Utility Hub</title></Helmet>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-brand-primary/10 via-transparent to-transparent p-6 rounded-xl border border-brand-primary/20 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">Performance overview and business metrics.</p>
          </div>
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-[180px] bg-white shadow-sm">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isDataEmpty && (
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800 shadow-sm animate-in slide-in-from-top-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="font-semibold text-red-800">Database Empty</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
              <span className="text-sm">There is currently no transaction data. Use the controls to populate mock data.</span>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" className="bg-red-600 text-white hover:bg-red-700 shadow-sm transition-all" onClick={handleInsertMockData} disabled={isProcessing}>
                  <Database className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : "Insert Mock Data"}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Revenue" value={data.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} prefix="$" icon={DollarSign} loading={loading} />
          <StatCard title="Total Payments" value={data.totalOrders} icon={ShoppingCart} loading={loading} />
          <StatCard title="Total Users" value={data.totalUsers} icon={Users} loading={loading} />
          <StatCard title="Active Sessions" value={Math.floor(data.totalUsers * 0.15)} icon={Activity} loading={loading} />
        </div>

        <AdSenseContainer className="min-h-[90px] w-full flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-md overflow-hidden">
          <AdSenseResponsive slot="admin_dashboard_mid" />
        </AdSenseContainer>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow duration-300 border-brand-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900">Revenue Trend</CardTitle>
              {!isDataEmpty && (
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100 opacity-50 hover:opacity-100" title="Reset Mock Data" onClick={handleResetData} disabled={isProcessing}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="h-[300px] w-full mt-4">
              {loading ? <Skeleton className="w-full h-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow duration-300 border-brand-primary/10">
            <CardHeader>
               <CardTitle className="text-lg font-semibold text-gray-900">Payment Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex justify-center w-full mt-4">
              {loading ? <Skeleton className="w-full h-full rounded-full" /> : (
                data.orderStatusBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.orderStatusBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                        {data.orderStatusBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                   <div className="flex items-center justify-center h-full text-muted-foreground">No distribution data available</div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="hidden xl:block w-[300px] shrink-0 pt-8">
         <AdSenseContainer className="sticky top-24 min-h-[600px] bg-gray-50 border border-dashed border-gray-200 rounded-md overflow-hidden flex items-center justify-center">
            <AdSenseVertical slot="admin_dashboard_sidebar" />
         </AdSenseContainer>
      </div>
    </div>
  );
};

export default AdminDashboardPage;