import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TrendingUp, MousePointerClick, Globe, Smartphone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format, subDays, eachDayOfInterval } from 'date-fns';

const AnalyticsTab = ({ links }) => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('7');
  const [chartData, setChartData] = useState([]);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    // Generate mock trend data based on total clicks from actual links
    const total = links.reduce((sum, link) => sum + (link.visit_count || 0), 0);
    setTotalClicks(total);

    const days = parseInt(timeRange);
    const end = new Date();
    const start = subDays(end, days - 1);
    
    const dateRange = eachDayOfInterval({ start, end });
    
    // Distribute total clicks randomly across the selected days for visual effect
    // In a real app, this would be grouped by date from url_visits table
    let remaining = total;
    const data = dateRange.map((date, index) => {
      const isLast = index === dateRange.length - 1;
      const clicksForDay = isLast ? remaining : Math.floor(Math.random() * (remaining / (days - index) * 2));
      remaining -= clicksForDay;
      return {
        date: format(date, 'MMM dd'),
        clicks: Math.max(0, clicksForDay)
      };
    });

    setChartData(data);
  }, [links, timeRange]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Clicks\n"
      + chartData.map(row => `${row.date},${row.clicks}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Analytics Exported!" });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <MousePointerClick className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Clicks</p>
                <h3 className="text-2xl font-bold">{totalClicks}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Daily</p>
                <h3 className="text-2xl font-bold">{Math.round(totalClicks / parseInt(timeRange)) || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <Globe className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Top Source</p>
                <h3 className="text-xl font-bold">Direct</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/10 rounded-full">
                <Smartphone className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Top Device</p>
                <h3 className="text-xl font-bold">Mobile</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Click Traffic Trend</CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="14">Last 14 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleExport} title="Export CSV">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dx={-10}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorClicks)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;