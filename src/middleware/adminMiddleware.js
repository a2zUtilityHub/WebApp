import { auditLogService } from '@/services/auditLogService';
import { permissionService } from '@/services/permissionService';

export const adminMiddleware = {
  checkAdminAccess: async (user, requiredRole = null) => {
    if (!user) return false;
    // Check if user has an admin role
    const { permissions, role } = await permissionService.getUserPermissions(user.id);
    if (!role) return false;
    
    if (requiredRole && role !== requiredRole && role !== 'Super Admin') {
        return false;
    }
    return true;
  },

  checkAdminPermission: async (user, permission) => {
    if (!user) return false;
    const { permissions, role } = await permissionService.getUserPermissions(user.id);
    return permissionService.hasPermission(permissions, role, permission);
  },

  trackAdminAccess: async (user) => {
      if (user) {
          await auditLogService.logAdminAction('admin_access', { path: window.location.pathname });
      }
  }
};