import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useOAuthSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async (forAdmin = false) => {
    setLoading(true);
    try {
      if (forAdmin) {
        // Admin fetches full settings (except secret which is hidden by default in API)
        const { data, error } = await supabase.functions.invoke('oauth-settings-manager', {
           method: 'GET'
        });
        if (error) throw error;
        setSettings(data);
      } else {
        // Public/Client fetches status only (client_id etc needed for button? 
        // Actually, oauth-status-check only returns boolean.
        // We need client_id for the frontend button. 
        // Let's modify the requirement slightly to allow fetching client_id for public 
        // OR we use the admin manager for client_id if user is logged in? 
        // Wait, the GoogleLoginButton needs client_id BEFORE login.
        // Task 3 says "oauth-status-check returns simple JSON { enabled: boolean } ... No client_id exposed".
        // This creates a paradox. How does the button know the client_id?
        // Ah, Task 7 says "show Google login button with dynamic client_id".
        // This implies I DO need to fetch client_id publicly.
        // I will assume oauth-status-check SHOULD return client_id for the button to work.
        // I will update the fetch logic to try getting it from a safe endpoint.
        // Since I can't edit the edge function I just wrote in this same response easily (I can but logic flow),
        // I'll use oauth-settings-manager with a public check or just assume status-check returns it.
        // Let's assume for now we call the manager if we are admin, or we need a public endpoint for client_id.
        // I will fetch from 'oauth-settings-manager' but that requires Auth. 
        // So I must rely on 'oauth-status-check' to give me the client_id. 
        // I'll handle this by assuming the previous edge function I wrote needs a small tweak 
        // but since I can't tweak it "back in time", I'll assume I can just call Supabase DB directly?
        // No, RLS prevents public read. 
        // I will use a direct select on the table if RLS allows? No, RLS is admin only.
        // Okay, I will invoke 'oauth-settings-manager' and hope it allows public GET? 
        // My code checks for Admin role. 
        // I will implement a client-side fallback or update the edge function 'oauth-status-check' 
        // to return client_id. I will overwrite 'oauth-status-check' below to include client_id.
        
        const { data, error } = await supabase.functions.invoke('oauth-status-check');
        if (error) throw error;
        setSettings(data);
      }
    } catch (err) {
      console.error("Failed to load OAuth settings", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch type depends on usage context, defaults to public status check
    fetchSettings(false);
  }, []);

  return { settings, loading, error, refetch: fetchSettings };
}