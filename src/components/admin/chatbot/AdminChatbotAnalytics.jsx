import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { useChatbotAdmin } from '@/hooks/useChatbotAdmin';
import { Loader2 } from 'lucide-react';

const AdminChatbotAnalytics = ({ chatbotId }) => {
    const { fetchAnalytics, loading } = useChatbotAdmin(chatbotId);
    const [data, setData] = useState(null);

    useEffect(() => {
        const load = async () => {
            const stats = await fetchAnalytics();
            if (stats) setData(stats);
        };
        load();
    }, [chatbotId]);

    if (loading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-10" />;
    if (!data) return <div className="text-center mt-10">No analytics data available.</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Conversations</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{data.totalConversations}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Avg Response Time</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{data.avgResponseTime}s</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Satisfaction</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{data.satisfactionRating}/5.0</div></CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Conversation Trends</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.trends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="conversations" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Top Intents</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.topIntents} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminChatbotAnalytics;