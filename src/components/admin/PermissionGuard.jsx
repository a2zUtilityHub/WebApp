import React from 'react';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const PermissionGuard = ({ permission, children, fallback = null, showLoading = false }) => {
  const { hasPermission, loading, role } = useUserPermissions();
  const { adminUser } = useAuth();

  // Explicit Super Admin bypass at component level for extra safety
  const isSuperAdmin = role === 'Super Admin' || adminUser?.roles?.name === 'Super Admin';

  if (loading && showLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  if (isSuperAdmin || hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default PermissionGuard;