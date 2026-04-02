import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageSquare, Activity, ThumbsUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { useChatbotManagement } from '@/hooks/useChatbotManagement';

const ChatbotDashboard = () => {
    const { getStats } = useChatbotManagement();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await getStats();
            setStats(data);
            setLoading(false);
        };
        load();
    }, [getStats]);

    if (loading) return <div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Skeleton className="h-32"/><Skeleton className="h-32"/><Skeleton className="h-32"/><Skeleton className="h-32"/></div>;

    const COLORS = ['#10B981', '#EF4444', '#6B7280'];
    const pieData = [
        { name: 'Active', value: stats?.activeChatbots || 0 },
        { name: 'Inactive', value: stats?.inactiveChatbots || 0 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Chatbots</CardTitle>
                        <Bot className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalChatbots}</div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalConversations}</div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.avgResponseTime}s</div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.satisfactionRating}/5.0</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Chatbot Status</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ReTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Messages Volume (Mock)</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{name: 'Bot A', msg: 400}, {name: 'Bot B', msg: 300}, {name: 'Bot C', msg: 200}]}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <ReTooltip />
                                <Bar dataKey="msg" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ChatbotDashboard;