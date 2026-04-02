import { supabase } from '@/lib/customSupabaseClient';
import { logError } from './fetchErrorHandler';

export const isOnline = () => {
  return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' 
    ? navigator.onLine 
    : true;
};

export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('system_settings').select('key').limit(1);
    if (error) {
      logError('SupabaseConnectionCheck', error);
      return false;
    }
    return true;
  } catch (error) {
    logError('SupabaseConnectionCheck', error);
    return false;
  }
};

export const checkEdgeFunctionAccess = async (functionName = 'hello-world') => {
  try {
    const { error } = await supabase.functions.invoke(functionName, {
      body: JSON.stringify({ ping: true })
    });
    if (error) {
      logError('EdgeFunctionCheck', error, { functionName });
      return false;
    }
    return true;
  } catch (error) {
    logError('EdgeFunctionCheck', error, { functionName });
    return false;
  }
};