
import { supabase } from '@/lib/customSupabaseClient';

/**
 * Validates the base Supabase configuration
 */
export const validateSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    return { valid: false, error: 'Missing Supabase environment variables (URL or Anon Key).' };
  }
  return { valid: true };
};

/**
 * Validates the configured redirect URI
 */
export const validateRedirectUri = () => {
  const configuredUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback`;
  const currentOrigin = window.location.origin;
  
  if (!configuredUri.startsWith(currentOrigin)) {
    return { 
      valid: false, 
      warning: `Redirect URI (${configuredUri}) does not match current origin (${currentOrigin}). This may cause issues in development/production.`
    };
  }
  return { valid: true, uri: configuredUri };
};

/**
 * Checks if the Google provider is enabled by attempting to initialize an OAuth request.
 * If it fails immediately with a specific provider error, it's likely disabled.
 */
export const checkGoogleProviderStatus = async () => {
  try {
    // Attempt a dry-run or inspect config (Supabase JS doesn't expose provider status directly without an admin key)
    // We will attempt to get the OAuth URL. If it throws immediately, we catch it.
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        skipBrowserRedirect: true, // Don't actually redirect
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      if (error.message.toLowerCase().includes('not enabled') || error.message.toLowerCase().includes('provider is disabled')) {
        return { enabled: false, error: 'Google provider is not enabled in Supabase - enable it in Authentication → Providers.' };
      }
      return { enabled: false, error: error.message };
    }
    
    if (data?.url) {
      return { enabled: true, url: data.url };
    }
    
    return { enabled: false, error: 'Failed to generate OAuth URL.' };
  } catch (err) {
    return { enabled: false, error: err.message || 'Unknown error checking provider status.' };
  }
};

/**
 * Logs a full diagnostic report to the console
 */
export const logOAuthDiagnostics = async () => {
  console.group('🔍 [OAuth Diagnostics] Running Checks...');
  
  const config = validateSupabaseConfig();
  console.log('Supabase Config:', config.valid ? '✅ Valid' : `❌ ${config.error}`);
  
  const redirect = validateRedirectUri();
  console.log('Redirect URI:', redirect.valid ? `✅ Valid (${redirect.uri})` : `⚠️ ${redirect.warning}`);
  
  const provider = await checkGoogleProviderStatus();
  console.log('Google Provider:', provider.enabled ? '✅ Enabled' : `❌ Disabled/Error: ${provider.error}`);
  
  console.groupEnd();
  
  return { config, redirect, provider };
};
