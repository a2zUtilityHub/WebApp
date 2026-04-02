
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ requiredPermission, requireAdmin = true, children }) => {
  const { user, currentUser, isAuthenticated, loading: authLoading, adminUser } = useAuth();
  const { hasPermission, loading: permLoading, role } = useUserPermissions();
  const location = useLocation();

  // Logging for debugging
  useEffect(() => {
    if (!authLoading && !permLoading) {
      console.log(`[ProtectedRoute] Path: ${location.pathname}`);
      console.log(`[ProtectedRoute] User: ${user?.email}`);
      console.log(`[ProtectedRoute] Require Admin: ${requireAdmin}`);
      if (requireAdmin) {
        console.log(`[ProtectedRoute] Role from Hook: "${role}"`);
        console.log(`[ProtectedRoute] Role from Context: "${adminUser?.roles?.name}"`);
        console.log(`[ProtectedRoute] Required Permission: ${requiredPermission}`);
      }
    }
  }, [authLoading, permLoading, location, user, role, adminUser, requiredPermission, requireAdmin]);

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

  // Super Admin Bypass - Robust Check
  const currentRoleName = (role || adminUser?.roles?.name || '').trim();
  const isSuperAdmin = currentRoleName.toLowerCase() === 'super admin';

  if (isSuperAdmin) {
    console.log('[ProtectedRoute] Access Granted: Super Admin');
    return children ? children : <Outlet />;
  }

  // Regular Permission Check
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log(`[ProtectedRoute] Access Denied. Required: ${requiredPermission}, Current Role: ${currentRoleName}`);
    return <Navigate to="/admin/access-denied" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
