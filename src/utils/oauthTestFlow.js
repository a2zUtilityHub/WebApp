
import { checkGoogleProviderStatus, validateRedirectUri } from './oauthDiagnostics';
import { supabase } from '@/lib/customSupabaseClient';

export const testGoogleProviderStatus = async () => {
  return await checkGoogleProviderStatus();
};

export const testOAuthRedirect = () => {
  const uriInfo = validateRedirectUri();
  return uriInfo;
};

export const testSessionCreation = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) return { success: false, error: error.message };
  return { success: !!data.session, session: data.session };
};

export const testSessionPersistence = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return { success: !!session, message: session ? 'Session persisted' : 'No active session' };
};

export const testLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, error: error.message };
  return { success: true };
};

export const runFullOAuthTest = async () => {
  const results = {
    provider: await testGoogleProviderStatus(),
    redirect: testOAuthRedirect(),
    session: await testSessionCreation(),
  };
  return results;
};
