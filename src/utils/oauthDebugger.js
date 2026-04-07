
/**
 * OAuth Debugger Utility
 * Provides functions to log and inspect OAuth state, configuration, and parameters
 * to help identify misconfigurations quickly.
 */

export const debugOAuthConfig = () => {
  console.group('🔍 [OAuth Debug] Configuration Check');
  console.log('VITE_GOOGLE_CLIENT_ID configured:', !!import.meta.env.VITE_GOOGLE_CLIENT_ID);
  console.log('VITE_GOOGLE_REDIRECT_URI configured:', !!import.meta.env.VITE_GOOGLE_REDIRECT_URI);
  console.log('Current Origin:', window.location.origin);
  console.log('Expected Redirect URI (Dev):', `${window.location.origin}/auth/callback`);
  console.groupEnd();
};

export const debugSessionStorage = () => {
  console.group('📦 [OAuth Debug] SessionStorage Contents');
  try {
    const oauthState = sessionStorage.getItem('oauth_state');
    const redirectUrl = sessionStorage.getItem('oauth_redirect');
    console.log('oauth_state:', oauthState ? JSON.parse(oauthState) : 'null');
    console.log('oauth_redirect:', redirectUrl || 'null');
  } catch (err) {
    console.error('Error reading sessionStorage:', err);
  }
  console.groupEnd();
};

export const debugUrlParams = (searchParams) => {
  console.group('🔗 [OAuth Debug] URL Parameters');
  if (!searchParams || !searchParams.toString()) {
    console.log('No URL parameters found.');
  } else {
    for (const [key, value] of searchParams.entries()) {
      console.log(`${key}:`, value);
    }
  }
  console.groupEnd();
};

export const validateOAuthSetup = () => {
  console.group('✅ [OAuth Debug] Setup Validation');
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  
  let isValid = true;
  if (!clientId) {
    console.warn('❌ Missing VITE_GOOGLE_CLIENT_ID in environment.');
    isValid = false;
  }
  if (!redirectUri) {
    console.warn('❌ Missing VITE_GOOGLE_REDIRECT_URI in environment.');
    isValid = false;
  }
  
  if (isValid) {
    console.log('✅ Basic OAuth environment variables are present.');
  }
  console.groupEnd();
  return isValid;
};
