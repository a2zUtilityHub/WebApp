import { supabase } from '@/lib/customSupabaseClient';
import { PERMISSIONS, ROLES } from '@/config/adminPermissions';

let permissionCache = new Map();

export const permissionService = {
  async getUserPermissions(userId) {
    if (!userId) return { permissions: [], role: null };
    
    // Check cache first (simple memory cache for session)
    if (permissionCache.has(userId)) {
        const { timestamp, data } = permissionCache.get(userId);
        if (Date.now() - timestamp < 60000) { // 1 minute cache
            return data;
        }
    }

    try {
      // Try RPC first
      const { data, error } = await supabase.rpc('get_user_permissions');
      
      let perms = [];
      let roleName = '';

      if (error) {
        // Fallback to manual query if RPC fails or doesn't exist
        // This handles cases where the RPC might not be deployed yet
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('roles(name, permissions)')
          .eq('id', userId)
          .single();
          
        if (profileError) {
            console.warn('Failed to fetch permissions via fallback query:', profileError.message);
            // Don't throw, just return empty to prevent app crash
            return { permissions: [], role: null };
        }

        roleName = profile?.roles?.name;
        perms = profile?.roles?.permissions || [];
      } else {
        perms = data?.permissions || [];
        roleName = data?.role;
      }

      const result = { permissions: perms, role: roleName };
      
      permissionCache.set(userId, {
          timestamp: Date.now(),
          data: result
      });
      
      return result;
    } catch (err) {
      console.error('Permission fetch critical error:', err);
      return { permissions: [], role: null };
    }
  },

  hasPermission(userPermissions, role, requiredPermission) {
    if (!requiredPermission) return true;
    if (role === ROLES.SUPER_ADMIN) return true;
    return Array.isArray(userPermissions) && userPermissions.includes(requiredPermission);
  },

  hasAnyPermission(userPermissions, role, requiredPermissions) {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (role === ROLES.SUPER_ADMIN) return true;
    return Array.isArray(userPermissions) && requiredPermissions.some(p => userPermissions.includes(p));
  },

  hasAllPermissions(userPermissions, role, requiredPermissions) {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (role === ROLES.SUPER_ADMIN) return true;
    return Array.isArray(userPermissions) && requiredPermissions.every(p => userPermissions.includes(p));
  },

  clearPermissionCache() {
    permissionCache.clear();
  }
};