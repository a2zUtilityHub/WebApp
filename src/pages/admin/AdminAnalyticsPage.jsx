import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { useUserMetrics } from '@/hooks/useUserMetrics';
import { useActivityMetrics } from '@/hooks/useActivityMetrics';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Loader2, RefreshCcw, Users, UserPlus, Activity, TrendingUp, AlertCircle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

// Components
const StatCard = ({ title, value, icon: Icon, description, loading, color }) => (
  <Card className="border-l-4" style={{ borderLeftColor: color || 'hsl(var(--primary))' }}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={`p-2 rounded-full bg-opacity-10`} style={{ backgroundColor: color ? `${color}20` : '' }}>
         <Icon className="h-4 w-4" style={{ color: color || 'inherit' }} />
      </div>
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-24 mb-1" />
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </>
      )}
    </CardContent>
  </Card>
);

const AdminAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('30days');
  const { 
    users, 
    activityLogs, 
    dailySignups, 
    loading, 
    error, 
    refetch 
  } = useAnalyticsData();
  
  const userMetrics = useUserMetrics(users, activityLogs);
  const activityMetrics = useActivityMetrics(activityLogs);
  const { toast } = useToast();

  useEffect(() => {
    refetch(dateRange);
  }, [dateRange, refetch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Analytics Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6 p-1 animate-in fade-in duration-500">
      <Helmet><title>Analytics Dashboard | Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
           <p className="text-muted-foreground">Monitor user growth, engagement, and platform activity.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select Range" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => refetch(dateRange)} disabled={loading}>
                <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>
            {error}. Check your internet connection or permissions.
            <Button variant="link" onClick={() => refetch(dateRange)} className="p-0 h-auto ml-2 text-destructive-foreground underline">Retry</Button>
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Total Users" 
            value={userMetrics.totalUsers.toLocaleString()} 
            icon={Users} 
            loading={loading}
            color="#3b82f6" // Blue
        />
        <StatCard 
            title="Active Users (7d)" 
            value={userMetrics.activeUsers.toLocaleString()} 
            icon={Activity} 
            loading={loading}
            description={`${((userMetrics.activeUsers / userMetrics.totalUsers || 0) * 100).toFixed(1)}% of total`}
            color="#10b981" // Green
        />
        <StatCard 
            title="New Signups" 
            value={userMetrics.newUsers.toLocaleString()} 
            icon={UserPlus} 
            loading={loading}
            description={`+${userMetrics.growthRate}% growth`}
            color="#8b5cf6" // Purple
        />
        <StatCard 
            title="Total Activities" 
            value={activityMetrics.totalActivities.toLocaleString()} 
            icon={TrendingUp} 
            loading={loading}
            color="#f59e0b" // Orange
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
         {/* Daily Signups Chart */}
         <Card className="col-span-1">
             <CardHeader>
                 <CardTitle>User Acquisition</CardTitle>
                 <CardDescription>Daily signups over selected period</CardDescription>
             </CardHeader>
             <CardContent>
                 <div className="h-[300px] w-full">
                     {loading ? (
                         <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
                     ) : dailySignups.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={dailySignups}>
                                 <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                 <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                 <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                 <Bar dataKey="count" name="Signups" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                             </BarChart>
                         </ResponsiveContainer>
                     ) : (
                         <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                     )}
                 </div>
             </CardContent>
         </Card>

         {/* Activity Trends */}
         <Card className="col-span-1">
             <CardHeader>
                 <CardTitle>Activity Trends</CardTitle>
                 <CardDescription>User actions over time</CardDescription>
             </CardHeader>
             <CardContent>
                 <div className="h-[300px] w-full">
                     {loading ? (
                         <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
                     ) : activityMetrics.recentTrends.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={activityMetrics.recentTrends}>
                                 <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                 <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                 <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                 <Tooltip />
                                 <Line type="monotone" dataKey="count" name="Activities" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                             </LineChart>
                         </ResponsiveContainer>
                     ) : (
                         <div className="h-full flex items-center justify-center text-muted-foreground">No activity data</div>
                     )}
                 </div>
             </CardContent>
         </Card>

         {/* Activity Distribution */}
         <Card className="col-span-1 md:col-span-1">
             <CardHeader>
                 <CardTitle>Activity by Type</CardTitle>
                 <CardDescription>What users are doing most</CardDescription>
             </CardHeader>
             <CardContent>
                 <div className="h-[300px] w-full">
                     {loading ? (
                          <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
                     ) : activityMetrics.activitiesByType.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                 <Pie
                                     data={activityMetrics.activitiesByType}
                                     cx="50%"
                                     cy="50%"
                                     innerRadius={60}
                                     outerRadius={80}
                                     paddingAngle={5}
                                     dataKey="value"
                                 >
                                     {activityMetrics.activitiesByType.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                     ))}
                                 </Pie>
                                 <Tooltip />
                             </PieChart>
                         </ResponsiveContainer>
                     ) : (
                         <div className="h-full flex items-center justify-center text-muted-foreground">No activity types found</div>
                     )}
                 </div>
                 {/* Legend */}
                 <div className="flex flex-wrap gap-2 justify-center mt-4">
                     {activityMetrics.activitiesByType.map((entry, index) => (
                         <div key={index} className="flex items-center text-xs">
                             <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                             {entry.name} ({entry.value})
                         </div>
                     ))}
                 </div>
             </CardContent>
         </Card>
         
          {/* Peak Times */}
         <Card className="col-span-1 md:col-span-1">
            <CardHeader>
                 <CardTitle>Peak Activity Times</CardTitle>
                 <CardDescription>When users are most active (Hour of Day)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    {loading ? (
                         <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
                    ) : activityMetrics.peakTimes.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityMetrics.peakTimes}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="hour" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Bar dataKey="count" name="Actions" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">No peak time data</div>
                    )}
                </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;