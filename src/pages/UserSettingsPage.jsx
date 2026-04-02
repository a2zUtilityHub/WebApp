import React from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import DashboardPage from './DashboardPage';

const UserSettingsPage = () => {
  const { tab } = useParams();
  const location = useLocation();

  if (location.pathname === '/settings') {
    return <Navigate to="/settings/profile" replace />;
  }
  
  const validTabs = ['profile', 'subscription', 'services', 'location'];
  if (!tab || !validTabs.includes(tab)) {
    return <Navigate to="/settings/profile" replace />;
  }
  
  return <DashboardPage />;
};

export default UserSettingsPage;