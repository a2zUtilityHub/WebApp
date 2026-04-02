import { useAuth } from '@/contexts/SupabaseAuthContext';
import { usePermission } from '@/hooks/usePermission';
import { ROLES } from '@/config/adminPermissions';

export const useAdminUser = () => {
  const { adminUser, user } = useAuth();
  const { 
    userPermissions, 
    userRole, 
    loading: permsLoading, 
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  } = usePermission();

  return {
    adminUser: adminUser || (userRole ? { ...user, role: userRole } : null),
    adminRole: userRole,
    adminPermissions: userPermissions,
    isAdmin: !!userRole,
    isSuperAdmin: userRole === ROLES.SUPER_ADMIN,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    loading: permsLoading,
    error: null
  };
};