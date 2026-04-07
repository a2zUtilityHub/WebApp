
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
    if (isOffline) return; 
    try {
        const { error } = await supabase.functions.invoke('track-user-activity', {
            body: { activity_type: activityType, status, error_message: errorMessage, metadata }
        });
        if (error) console.warn(`[AuthContext] Failed to track activity:`, error);
    } catch (err) {
        console.warn(`[AuthContext] Exception tracking activity:`, err);
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

      if (error && error.code !== 'PGRST116') {
         console.error('Error fetching profile:', error);
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
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        setLoading(true);
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) console.error("Supabase auth error:", error);

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) await fetchProfile(initialSession.user);
        }
      } catch (error) {
        console.error("Auth initialization critical error:", error);
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
        navigate(location.pathname.includes('/admin') ? '/admin/update-password' : '/update-password');
      }
      
      if (_event === "SIGNED_IN" && currentUser) {
        await fetchProfile(currentUser);
        trackActivity('login', 'success');
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
      if (authListener?.subscription) authListener.subscription.unsubscribe();
    };
  }, [fetchProfile, navigate, location.pathname]);
  
  const hasPermission = (permission) => {
    if (adminUser?.roles?.name === 'Super Admin') return true;
    if (!isAdmin || !adminUser?.roles?.permissions) return false;
    const [, resource] = permission.split(':');
    if (adminUser.roles.permissions.includes(`manage:${resource}`) || adminUser.roles.permissions.includes('manage:all')) {
        return true;
    }
    return adminUser.roles.permissions.includes(permission);
  };

  const signIn = async (email, password) => {
    if (isOffline) return { error: { message: "You are offline." } };
    try {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) await trackActivity('failed_login', 'failure', result.error.message);
        return result;
    } catch (err) {
        return { error: { message: "Network error during sign in." } };
    }
  };

  const signInWithGoogle = async () => {
    if (isOffline) return { error: { message: "Network error. Please check your connection." } };
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        }
      });
      if (error) {
        console.error('[OAuth] signInWithOAuth error:', error);
        let userMessage = error.message;
        if (error.message.includes('not enabled')) {
           userMessage = "Google provider is not enabled. Please enable it in Supabase Authentication settings.";
        }
        return { error: { message: userMessage, original: error } };
      }
      return { data };
    } catch (err) {
      console.error('[OAuth] Exception during signInWithGoogle:', err);
      return { error: { message: "An unexpected error occurred during Google Login." } };
    }
  };
  
  const adminSignIn = async (email, password) => {
    if (isOffline) return { error: { message: "You are offline." } };
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
             await trackActivity('failed_login_admin', 'failure', error.message);
             return { data, error };
        }
        if (data?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles').select('*, roles(name)').eq('id', data.user.id).single();
          if(profileError || !adminRoles.includes(profileData?.roles?.name)) {
            await supabase.auth.signOut();
            return { user: null, session: null, error: { message: "Access denied." } };
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
        return await supabase.auth.signUp({ email, password, options: { data: metadata } });
    } catch (err) {
        return { error: { message: "Network error during sign up." } };
    }
  };
  
  const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) toast({ title: "Sign Out Error", description: error.message, variant: "destructive" });
        else {
          navigate('/');
          toast({ title: "Signed Out", description: "You have been successfully signed out." });
        }
    } catch (err) {
        setSession(null);
        setUser(null);
        navigate('/');
    }
  };

  const sendPasswordResetEmail = async (email, forAdmin = false) => {
    if (isOffline) return { error: { message: "You are offline." } };
    const redirectTo = forAdmin ? `${window.location.origin}/admin/update-password` : `${window.location.origin}/update-password`;
    try {
        return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    } catch (err) {
        return { error: { message: "Network error during password reset." } };
    }
  };

  const value = {
    session, user, currentUser: user, isAuthenticated: !!user, profile, isAdmin, adminUser,
    loading, authReady, isOffline, signIn, signInWithGoogle, adminSignIn, signUp, signOut,
    sendPasswordResetEmail, fetchProfile, hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
