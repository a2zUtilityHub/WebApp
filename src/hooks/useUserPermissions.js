
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const CACHE_KEY = 'user_permissions_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useUserPermissions = () => {
  const { user, adminUser } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPermissions = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setPermissions([]);
      setRole(null);
      setLoading(false);
      return;
    }

    const contextRole = adminUser?.roles?.name;

    // Optimization: If adminUser is already loaded in context, use that role as immediate fallback/check
    if (contextRole) {
        setRole(contextRole);
    }

    // Check cache
    const cached = localStorage.getItem(`${CACHE_KEY}_${user.id}`);
    if (!forceRefresh && cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setPermissions(data.permissions || []);
        if (data.role) setRole(data.role); // Prefer DB role if available
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      // First try the RPC
      const { data, error } = await supabase.rpc('get_user_permissions');

      if (error) {
        // Fallback to manual query
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('roles(name, permissions)')
          .eq('id', user.id)
          .single();

        if (!profileError && profile) {
          const fetchedRole = profile.roles?.name;
          const fetchedPerms = profile.roles?.permissions || [];
          setRole(fetchedRole);
          setPermissions(fetchedPerms);
          
          localStorage.setItem(`${CACHE_KEY}_${user.id}`, JSON.stringify({
            data: { role: fetchedRole, permissions: fetchedPerms },
            timestamp: Date.now()
          }));
        }
      } else if (data) {
        setPermissions(data.permissions || []);
        setRole(data.role);

        // Cache result
        localStorage.setItem(`${CACHE_KEY}_${user.id}`, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      }
    } catch (err) {
      console.error('Failed to fetch permissions:', err);
      setError(err);
      // Fallback: if context has role, use it
      if (adminUser?.roles?.name) {
          setRole(adminUser.roles.name);
      }
    } finally {
      setLoading(false);
    }
  }, [user, adminUser]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const isSuperAdmin = useCallback(() => {
    const currentRole = (role || adminUser?.roles?.name || '').trim().toLowerCase();
    return currentRole === 'super admin' || currentRole === 'super_admin';
  }, [role, adminUser]);

  const hasPermission = useCallback((permissionName) => {
    if (isSuperAdmin()) return true;
    if (!permissionName) return true;
    return permissions.includes(permissionName);
  }, [permissions, isSuperAdmin]);

  const hasAnyPermission = useCallback((permissionNames) => {
    if (isSuperAdmin()) return true;
    if (!Array.isArray(permissionNames)) return false;
    return permissionNames.some(p => permissions.includes(p));
  }, [permissions, isSuperAdmin]);

  const hasAllPermissions = useCallback((permissionNames) => {
    if (isSuperAdmin()) return true;
    if (!Array.isArray(permissionNames)) return false;
    return permissionNames.every(p => permissions.includes(p));
  }, [permissions, isSuperAdmin]);

  const refreshPermissions = () => fetchPermissions(true);

  return {
    permissions,
    role: role || adminUser?.roles?.name,
    loading,
    error,
    isSuperAdmin: isSuperAdmin(),
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshPermissions
  };
};
