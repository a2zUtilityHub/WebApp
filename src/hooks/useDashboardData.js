import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { subDays, startOfDay } from 'date-fns';

export const useDashboardData = (days = 30) => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalOrders: 0, 
    totalRevenue: 0,
    salesData: [],
    recentOrders: [],
    orderStatusBreakdown: []
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = startOfDay(subDays(new Date(), days)).toISOString();

      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Use 'payments' instead of 'orders' to match the actual database schema
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .gte('created_at', startDate);

      if (paymentsError) {
        console.error("Dashboard Payments Error:", paymentsError);
      }

      let totalRev = 0;
      const statusCounts = {};
      const salesMap = {};

      const recent = [...(paymentsData || [])]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      (paymentsData || []).forEach(p => {
        const amount = Number(p.amount || 0);
        totalRev += amount;
        
        const status = p.status || 'unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
        
        const date = p.created_at.split('T')[0];
        salesMap[date] = (salesMap[date] || 0) + amount;
      });

      const orderStatusBreakdown = Object.keys(statusCounts).map(name => ({ 
        name: name.charAt(0).toUpperCase() + name.slice(1), 
        value: statusCounts[name] 
      }));
      
      const salesData = Object.keys(salesMap).sort().map(date => ({ 
        date, 
        amount: salesMap[date] 
      }));

      setData({
        totalUsers: usersCount || 0,
        totalOrders: paymentsData?.length || 0,
        totalRevenue: totalRev,
        salesData,
        recentOrders: recent,
        orderStatusBreakdown
      });
    } catch (error) {
      console.error("Dashboard data error:", error);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refetch: fetchData };
};