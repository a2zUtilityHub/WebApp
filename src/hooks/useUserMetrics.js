import { useMemo } from 'react';
import { subDays, isAfter } from 'date-fns';

export const useUserMetrics = (users = [], activityLogs = []) => {
  const metrics = useMemo(() => {
    if (!users.length) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        growthRate: 0,
        churnRate: 0
      };
    }

    const now = new Date();
    const sevenDaysAgo = subDays(now, 7);
    const thirtyDaysAgo = subDays(now, 30);

    // 1. Total Users
    const totalUsers = users.length;

    // 2. New Users (Last 7 days)
    const newUsers = users.filter(u => {
      const created = u.created_at || u.updated_at; // Fallback
      return created && isAfter(new Date(created), sevenDaysAgo);
    }).length;

    // 3. Active Users (Users with activity logs in last 7 days OR last_sign_in_at)
    // We combine activity logs + user last_sign_in
    const activeUserIds = new Set();
    
    // Check activity logs
    activityLogs.forEach(log => {
      if (log.user_id && isAfter(new Date(log.created_at), sevenDaysAgo)) {
        activeUserIds.add(log.user_id);
      }
    });

    // Check last_sign_in_at from user object
    users.forEach(user => {
      if (user.last_sign_in_at && isAfter(new Date(user.last_sign_in_at), sevenDaysAgo)) {
        activeUserIds.add(user.id);
      }
    });

    const activeUsers = activeUserIds.size;

    // 4. Growth Rate (New Users / Total Users at start of period)
    const usersStartOfPeriod = totalUsers - newUsers;
    const growthRate = usersStartOfPeriod > 0 
      ? ((newUsers / usersStartOfPeriod) * 100).toFixed(1) 
      : 0;

    // 5. Churn Rate (Inactive users / Total users) - Simplified definition
    // Users active 30 days ago but NOT active in last 7 days
    // This is hard to calculate precisely without historical snapshots, 
    // so we'll approximate: Users created > 30 days ago who haven't signed in last 30 days
    const staleUsers = users.filter(u => {
      const created = u.created_at || u.updated_at;
      const lastSign = u.last_sign_in_at;
      if (!created) return false;
      
      const isOldEnough = !isAfter(new Date(created), thirtyDaysAgo);
      const hasRecentSign = lastSign && isAfter(new Date(lastSign), thirtyDaysAgo);
      
      return isOldEnough && !hasRecentSign;
    }).length;

    const churnRate = totalUsers > 0 
      ? ((staleUsers / totalUsers) * 100).toFixed(1) 
      : 0;

    return {
      totalUsers,
      activeUsers,
      newUsers,
      growthRate,
      churnRate
    };
  }, [users, activityLogs]);

  return metrics;
};