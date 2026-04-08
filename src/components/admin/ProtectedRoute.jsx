
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ requiredPermission, requireAdmin = true, children }) => {
  const { user, isAuthenticated, loading: authLoading, adminUser } = useAuth();
  const { hasPermission, loading: permLoading, role, isSuperAdmin } = useUserPermissions();
  const location = useLocation();

  // Loading state
  if (authLoading || (requireAdmin && permLoading && !adminUser)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle standard user protection
  if (!requireAdmin) {
    if (!isAuthenticated) {
      return <Navigate to={`/auth?redirect=${location.pathname}`} replace />;
    }
    return children ? children : <Outlet />;
  }

  // Handle admin protection
  if (!user) {
    return <Navigate to={`/admin/login?redirect=${location.pathname}`} replace />;
  }

  // Check role hierarchy: Super Admin bypasses all
  if (isSuperAdmin) {
    return children ? children : <Outlet />;
  }

  // Regular Permission Check for other roles
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.warn(`[ProtectedRoute] Access Denied. Required: ${requiredPermission}, Current Role: ${role || adminUser?.roles?.name}`);
    return <Navigate to="/admin/access-denied" replace />;
  }

  // If no specific permission is required, but they are an admin, let them in
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
