import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SignupTrendChart = ({ data, loading }) => {
  if (loading) return <Card className="h-[350px]"><CardContent className="h-full flex items-center justify-center"><Skeleton className="h-[200px] w-full" /></CardContent></Card>;

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>User Signups (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{fontSize: 12}} tickFormatter={(val) => val.slice(8,10)} />
              <YAxis allowDecimals={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupTrendChart;