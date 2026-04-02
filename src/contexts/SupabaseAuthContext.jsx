
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

const adminRoles = ['Super Admin', 'Admin', 'Support Lead', 'Support Agent', 'F&A', 'Payment Gateway Manager', 'HR', 'SEO', 'Tasks'];

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Network status listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const trackActivity = async (activityType, status, errorMessage = null, metadata = {}) => {
    if (isOffline) return; // Skip tracking if offline
    try {
        const { error } = await supabase.functions.invoke('track-user-activity', {
            body: { 
                activity_type: activityType, 
                status: status,
                error_message: errorMessage,
                metadata: metadata
            }
        });
        if (error) {
            console.warn(`[AuthContext] Failed to track activity '${activityType}':`, error);
        }
    } catch (err) {
        console.warn(`[AuthContext] Exception tracking activity '${activityType}':`, err);
    }
  };

  const fetchProfile = useCallback(async (userToFetch) => {
    if (!userToFetch) {
      setProfile(null);
      setAdminUser(null);
      setIsAdmin(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`*, roles ( name, permissions )`)
        .eq('id', userToFetch.id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
           console.error('Error fetching profile:', error);
           // If network error, keep basic user info but warn
           if (error.message?.includes('fetch') || error.message?.includes('network')) {
             toast({ title: "Connection Issue", description: "Could not load full profile data. Some features may be limited.", variant: "warning" });
           }
        }
      }
      
      const userRole = data?.roles?.name;
      const isUserAdmin = adminRoles.includes(userRole);

      if (isUserAdmin) {
        setAdminUser({ ...data, email: userToFetch.email });
        setIsAdmin(true);
      } else {
        setAdminUser(null);
        setIsAdmin(false);
      }
      
      setProfile({ ...data, email: userToFetch.email });

    } catch (error) {
      console.error('Exception fetching profile:', error);
      setIsAdmin(false);
      setProfile({ id: userToFetch.id, email: userToFetch.email });
      setAdminUser(null);
    }
  }, [toast]);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Add timeout to initial session check to prevent infinite loading
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Auth timeout')), 5000));
        
        const { data: { session: initialSession }, error } = await Promise.race([sessionPromise, timeoutPromise])
          .catch(err => {
             console.warn("Auth initialization timed out or failed:", err);
             return { data: { session: null }, error: err };
          });
        
        if (error) {
            console.error("Supabase auth error:", error);
            // Don't throw, just proceed as unauthenticated
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            await fetchProfile(initialSession.user);
          }
        }
      } catch (error) {
        console.error("Auth initialization critical error:", error);
        if (mounted) {
           // Even if auth fails, we must stop loading to show the app (likely in guest mode)
           setLoading(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setAuthReady(true);
        }
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      const currentUser = newSession?.user;
      setUser(currentUser ?? null);
      
      if (_event === "PASSWORD_RECOVERY") {
        const isFromAdmin = location.pathname.includes('/admin');
        navigate(isFromAdmin ? '/admin/update-password' : '/update-password');
      }
      
      if (_event === "SIGNED_IN" && currentUser) {
        await fetchProfile(currentUser);
        trackActivity('login', 'success');
        
        if (location.pathname.includes('/auth/google/callback')) {
          const redirectPath = sessionStorage.getItem('auth_redirect') || '/dashboard';
          sessionStorage.removeItem('auth_redirect');
          navigate(redirectPath);
        }
      }
      
      if (_event === "SIGNED_OUT") {
         setProfile(null);
         setAdminUser(null);
         setIsAdmin(false);
         trackActivity('logout', 'success');
      }
      
      if (!currentUser) {
        setProfile(null);
        setAdminUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      if (authListener && authListener.subscription) {
          authListener.subscription.unsubscribe();
      }
    };
  }, [fetchProfile, navigate, location.pathname]);
  
  const hasPermission = (permission) => {
    // Super Admin Bypass in Context as well
    if (adminUser?.roles?.name === 'Super Admin') return true;

    if(!isAdmin || !adminUser?.roles?.permissions) return false;
    const [action, resource] = permission.split(':');
    if (adminUser.roles.permissions.includes(`manage:${resource}`) || adminUser.roles.permissions.includes('manage:all')) {
        return true;
    }
    return adminUser.roles.permissions.includes(permission);
  };

  const signIn = async (email, password) => {
    if (isOffline) {
        return { error: { message: "You are offline. Please check your internet connection." } };
    }
    try {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) {
            await trackActivity('failed_login', 'failure', result.error.message);
        }
        return result;
    } catch (err) {
        return { error: { message: "Network error during sign in." } };
    }
  };
  
  const adminSignIn = async (email, password) => {
    if (isOffline) {
        return { error: { message: "You are offline. Please check your internet connection." } };
    }
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
             await trackActivity('failed_login_admin', 'failure', error.message);
             return { data, error };
        }
        if (!error && data.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*, roles(name)')
            .eq('id', data.user.id)
            .single();
            
          if(profileError || !adminRoles.includes(profileData?.roles?.name)) {
            await supabase.auth.signOut();
            return { user: null, session: null, error: { message: "Access denied. Not an admin user." } };
          }
        }
        return { data, error };
    } catch (err) {
        return { error: { message: "Network error during admin sign in." } };
    }
  };

  const signUp = async (email, password, metadata) => {
    if (isOffline) return { error: { message: "You are offline." } };
    try {
        return await supabase.auth.signUp({ 
          email, 
          password, 
          options: { data: metadata } 
        });
    } catch (err) {
        return { error: { message: "Network error during sign up." } };
    }
  };

  const signInWithOAuth = async (provider) => {
    if (isOffline) return { error: { message: "You are offline." } };
    try {
        return await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth`,
          },
        });
    } catch (err) {
        return { error: { message: "Network error during OAuth sign in." } };
    }
  };

  const signInWithGoogle = async () => {
    if (isOffline) return { error: { message: "You are offline." } };
    const currentPath = location.pathname;
    if (currentPath !== '/auth' && currentPath !== '/auth/google/callback') {
      sessionStorage.setItem('auth_redirect', currentPath);
    }

    try {
        return await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/google/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });
    } catch (err) {
        return { error: { message: "Network error during Google sign in." } };
    }
  };
  
  const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          toast({ title: "Sign Out Error", description: error.message, variant: "destructive" });
        } else {
          navigate('/');
          toast({ title: "Signed Out", description: "You have been successfully signed out." });
        }
    } catch (err) {
        // Force local cleanup even if network fails
        setSession(null);
        setUser(null);
        navigate('/');
    }
  };
  
  const adminSignOut = async () => {
    try {
        await supabase.auth.signOut();
    } catch (err) {
        console.error("Admin signout error", err);
    }
  }

  const sendPasswordResetEmail = async (email, forAdmin = false) => {
    if (isOffline) return { error: { message: "You are offline." } };
    const redirectTo = forAdmin 
      ? `${window.location.origin}/admin/update-password`
      : `${window.location.origin}/update-password`;
    try {
        return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    } catch (err) {
        return { error: { message: "Network error during password reset." } };
    }
  };
  
  const adminResetPassword = async (accessToken, newPassword) => {
    if (isOffline) return { error: { message: "You are offline." } };
    try {
        const { error: sessionError } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: '' });
        if(sessionError) return { error: sessionError };
        
        const result = await supabase.auth.updateUser({ password: newPassword });
        
        if (result.error) {
            await trackActivity('password_change', 'failure', result.error.message);
        } else {
            await trackActivity('password_change', 'success');
        }
        return result;
    } catch (err) {
        return { error: { message: "Network error during password update." } };
    }
  }

  const value = {
    session,
    user,
    currentUser: user, // Alias for user protection
    isAuthenticated: !!user, // Helper flag
    profile,
    isAdmin,
    adminUser,
    loading,
    authReady,
    isOffline,
    signIn,
    adminSignIn,
    signUp,
    signInWithOAuth,
    signInWithGoogle,
    signOut,
    adminSignOut,
    sendPasswordResetEmail,
    adminResetPassword,
    fetchProfile,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
