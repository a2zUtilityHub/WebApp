import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { usePermission } from '@/hooks/usePermission';
import { Loader2 } from 'lucide-react';

const ProtectedAdminRoute = ({ requiredPermission }) => {
  const { user, loading: authLoading } = useAuth();
  const { 
      isAdmin, 
      loading: permLoading, 
      hasPermission, 
      hasAllPermissions,
      userRole 
  } = usePermission();
  const location = useLocation();

  if (authLoading || permLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  // 1. Check Authentication
  if (!user) {
    return <Navigate to={`/admin/login?redirect=${location.pathname}`} replace />;
  }

  // 2. Check Admin Status
  if (!isAdmin) {
    // Not an admin at all
    return <Navigate to="/" replace />;
  }

  // 3. Check Specific Permissions (if required)
  if (requiredPermission) {
      const perms = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
      if (!hasAllPermissions(perms)) {
          console.warn(`Access Denied: User ${user.email} (${userRole}) lacks ${perms.join(', ')}`);
          return <Navigate to="/admin/access-denied" replace />;
      }
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;