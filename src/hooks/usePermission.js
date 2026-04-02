import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { permissionService } from '@/services/permissionService';
import { ROLES } from '@/config/adminPermissions';

export const usePermission = () => {
  const { user, adminUser } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPermissions = useCallback(async () => {
    if (!user) {
        setLoading(false);
        return;
    }
    
    // Quick fallback to context if available for immediate render
    if (adminUser?.roles) {
        setRole(adminUser.roles.name);
        setPermissions(adminUser.roles.permissions || []);
        setLoading(false);
        // We can optionally verify with service in background
        return;
    }

    setLoading(true);
    try {
        const { permissions: perms, role: r } = await permissionService.getUserPermissions(user.id);
        setPermissions(perms);
        setRole(r);
    } catch (err) {
        console.error("Error in usePermission hook:", err);
        setError(err);
    } finally {
        setLoading(false);
    }
  }, [user, adminUser]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const hasPermission = useCallback((requiredPermission) => {
    return permissionService.hasPermission(permissions, role, requiredPermission);
  }, [permissions, role]);

  const hasAnyPermission = useCallback((requiredPermissions) => {
    return permissionService.hasAnyPermission(permissions, role, requiredPermissions);
  }, [permissions, role]);

  const hasAllPermissions = useCallback((requiredPermissions) => {
    return permissionService.hasAllPermissions(permissions, role, requiredPermissions);
  }, [permissions, role]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userPermissions: permissions,
    userRole: role,
    isAdmin: !!role, // Basic check, ideally check against list of admin roles
    isSuperAdmin: role === ROLES.SUPER_ADMIN,
    loading,
    error
  };
};