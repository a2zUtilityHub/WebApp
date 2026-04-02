import React from 'react';
import { usePermission } from '@/hooks/usePermission';
import { Loader2 } from 'lucide-react';

const PermissionGuard = ({ 
  children, 
  requiredPermission, 
  requireAll = false, 
  fallback = null 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermission();

  if (loading) {
    return (
        <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
    );
  }

  // No requirements
  if (!requiredPermission) return <>{children}</>;

  const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
  
  let isAuthorized = false;
  if (requireAll) {
    isAuthorized = hasAllPermissions(permissions);
  } else {
    // Default to 'any' logic if array passed, or simple check if single string
    if (permissions.length === 1) {
        isAuthorized = hasPermission(permissions[0]);
    } else {
        isAuthorized = hasAnyPermission(permissions);
    }
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return fallback;
};

export default PermissionGuard;