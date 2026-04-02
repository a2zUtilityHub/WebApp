import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useTaskManagement } from '@/hooks/useTaskManagement';
import { Skeleton } from '@/components/ui/skeleton';

const TasksDashboard = () => {
    const { fetchTaskStats } = useTaskManagement();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        overdue: 0,
        statusData: [],
        priorityData: []
    });

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            const tasks = await fetchTaskStats();
            
            // Calculate Stats
            const total = tasks.length;
            const completed = tasks.filter(t => t.status === 'completed').length;
            const now = new Date();
            const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < now && t.status !== 'completed').length;
            
            // Completion Rate
            const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

            // Status Distribution
            const statusCounts = tasks.reduce((acc, t) => {
                acc[t.status] = (acc[t.status] || 0) + 1;
                return acc;
            }, {});
            
            const statusData = [
                { name: 'Pending', value: statusCounts['pending'] || 0 },
                { name: 'In Progress', value: statusCounts['in_progress'] || 0 },
                { name: 'Completed', value: statusCounts['completed'] || 0 },
                { name: 'Cancelled', value: statusCounts['cancelled'] || 0 },
            ].filter(d => d.value > 0);

            // Priority Distribution
            const priorityCounts = tasks.reduce((acc, t) => {
                const p = t.priority || 'medium'; // Default to medium if missing
                acc[p] = (acc[p] || 0) + 1;
                return acc;
            }, {});
            
            const priorityData = [
                { name: 'High', count: priorityCounts['high'] || 0 },
                { name: 'Medium', count: priorityCounts['medium'] || 0 },
                { name: 'Low', count: priorityCounts['low'] || 0 },
            ];

            setStats({
                total,
                completed,
                overdue,
                completionRate,
                statusData,
                priorityData
            });
            setLoading(false);
        };

        loadStats();
    }, [fetchTaskStats]);

    const COLORS = ['#FBBF24', '#3B82F6', '#10B981', '#9CA3AF'];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-[350px] rounded-xl" />
                    <Skeleton className="h-[350px] rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">Active in database</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completionRate}%</div>
                        <p className="text-xs text-muted-foreground">{stats.completed} tasks completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overdue}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Tasks by Status</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        {stats.statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={stats.statusData} 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={60} 
                                        outerRadius={80} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                    >
                                        {stats.statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Tasks by Priority</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                         {stats.priorityData.reduce((a, b) => a + b.count, 0) > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.priorityData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                         ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                         )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TasksDashboard;