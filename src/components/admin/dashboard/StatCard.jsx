import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, trend, trendPercent, icon: Icon, loading }) => {
  return (
    <Card className="overflow-hidden relative border border-border/50 bg-background/60 backdrop-blur-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl group">
        <div className="absolute -top-6 -right-6 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-primary to-transparent rounded-bl-[100px] z-0"></div>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-300 z-0">
            {Icon && <Icon className="w-16 h-16 text-primary" />}
        </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="z-10 relative">
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold tracking-tight">{value}</div>
        )}
        
        {(trendPercent !== undefined) && !loading && (
            <div className={cn("text-xs flex items-center mt-1", 
                trend === 'up' ? "text-green-600" : trend === 'down' ? "text-red-600" : "text-muted-foreground"
            )}>
                {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                <span className="font-medium">{trendPercent}%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;