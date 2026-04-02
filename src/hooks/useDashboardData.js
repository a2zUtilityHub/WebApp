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

      // Fetch users
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

      // Fetch orders (using subscriptions or mock orders table)
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate);

      let totalRev = 0;
      const statusCounts = {};
      const salesMap = {};

      const recent = [...(ordersData || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);

      (ordersData || []).forEach(o => {
        totalRev += Number(o.total_amount || 0);
        statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
        const date = o.created_at.split('T')[0];
        salesMap[date] = (salesMap[date] || 0) + Number(o.total_amount || 0);
      });

      const orderStatusBreakdown = Object.keys(statusCounts).map(name => ({ name, value: statusCounts[name] }));
      const salesData = Object.keys(salesMap).sort().map(date => ({ date, amount: salesMap[date] }));

      setData({
        totalUsers: usersCount || 0,
        totalOrders: ordersData?.length || 0,
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