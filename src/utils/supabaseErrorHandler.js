import { isOnline, withTimeout, withExponentialBackoff } from './networkResilience';
import { supabase } from '@/lib/customSupabaseClient';

export class SupabaseError extends Error {
  constructor(message, code, status, originalError) {
    super(message);
    this.name = 'SupabaseError';
    this.code = code;
    this.status = status;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

export const classifyError = (error) => {
  if (!error) return { type: 'unknown', retriable: false };

  const msg = (error.message || '').toLowerCase();

  if (msg.includes('fetch') || msg.includes('network') || msg.includes('cors') || msg.includes('connection refused') || !isOnline()) {
    return { type: 'network', retriable: true };
  }
  if (msg.includes('timeout') || msg.includes('timed out') || error.name === 'AbortError') {
    return { type: 'timeout', retriable: true };
  }
  // PGRST116 means 0 rows returned from a single() query
  if (error.code === 'PGRST116' || error.code === '42501' || error.status === 403) {
    return { type: 'permission_or_not_found', retriable: false };
  }
  if (error.status === 401 || msg.includes('jwt')) {
    return { type: 'auth', retriable: false };
  }
  if (error.status >= 500 && error.status < 600) {
    return { type: 'server', retriable: true };
  }
  if (error.status === 429) {
    return { type: 'rate_limit', retriable: true };
  }
  if (error.name === 'FunctionsFetchError') {
    return { type: 'edge_function', retriable: true };
  }
  if (error.status === 404) {
    return { type: 'not_found', retriable: false };
  }

  return { type: 'unknown', retriable: false };
};

export const classifyNotificationError = (error) => {
  const classification = classifyError(error);
  if (error.code === '42P01') {
    return { type: 'schema', retriable: false };
  }
  return classification;
};

export const getUserFriendlyMessage = (error) => {
  const classification = classifyError(error);
  const messages = {
    network: "Unable to connect to the server. Please check your internet connection or try again later.",
    timeout: "The request took too long. Please check your connection and try again.",
    permission_or_not_found: "The requested data could not be found or you don't have permission to access it.",
    auth: "Your session has expired. Please log in again.",
    server: "Our servers are experiencing issues. Please try again later.",
    rate_limit: "Too many requests. Please wait a moment.",
    edge_function: "A backend service is temporarily unavailable.",
    not_found: "The requested resource could not be found.",
    unknown: "An unexpected error occurred. Please try again."
  };
  return messages[classification.type] || messages.unknown;
};

export const getNotificationErrorMessage = (error) => {
  const classification = classifyNotificationError(error);
  if (classification.type === 'schema') {
    return "Notification system is currently unavailable due to maintenance.";
  }
  return getUserFriendlyMessage(error);
};

export const logDetailedError = (context, error, additionalData = {}) => {
  const timestamp = new Date().toISOString();
  const classification = classifyError(error);
  
  // Don't log PGRST116 as a critical error, it's often an expected "Not Found" case
  if (error?.code === 'PGRST116') {
      console.warn(`[${timestamp}] [SUPABASE_WARNING] [${context}] Resource not found (PGRST116)`);
      return;
  }

  console.error(`[${timestamp}] [SUPABASE_ERROR] [${context}]`, {
    type: classification.type,
    retriable: classification.retriable,
    message: error?.message,
    code: error?.code,
    status: error?.status,
    userMessage: getUserFriendlyMessage(error),
    ...additionalData
  });
};

/**
 * Safely executes a query that expects a single row. 
 * Prevents throwing PGRST116 by using .maybeSingle() under the hood if applied properly, 
 * or catching the error and returning null data gracefully.
 */
export const safeSingleFetch = async (queryFn, context = 'Single Fetch') => {
   try {
       const result = await queryFn();
       // if result is from normal Supabase fetch, check error
       if (result && result.error) {
           if (result.error.code === 'PGRST116') {
               return { data: null, error: null }; // Graceful degradation for 0 rows
           }
           throw result.error;
       }
       return { data: result.data !== undefined ? result.data : result, error: null };
   } catch (error) {
       if (error.code === 'PGRST116') {
           return { data: null, error: null };
       }
       logDetailedError(context, error);
       return { data: null, error: new SupabaseError(getUserFriendlyMessage(error), error.code, error.status, error) };
   }
};

/**
 * Logs notification-specific errors with context
 */
export const logNotificationError = (context, error, additionalData = {}) => {
  logDetailedError(`Notification:${context}`, error, additionalData);
};

export const retryWithBackoff = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 4000,
    timeout = 30000,
    context = 'Supabase Operation',
    onRetry = null
  } = options;

  let lastError;

  try {
    return await withExponentialBackoff(
      async () => {
        return await withTimeout(fn(), timeout);
      },
      {
        maxRetries,
        baseDelay,
        maxDelay,
        onRetry: (err, attempt) => {
          lastError = err;
          // Don't retry on PGRST116, it's deterministic
          if (err?.code === 'PGRST116') throw err;
          
          logDetailedError(context, err, { attempt, maxRetries });
          if (onRetry) onRetry(attempt);
        }
      }
    );
  } catch (error) {
    lastError = error;
    if (error?.code === 'PGRST116') throw error;
    throw new SupabaseError(
      getUserFriendlyMessage(lastError),
      lastError?.code,
      lastError?.status,
      lastError
    );
  }
};

export const executeQuery = async (queryFn, options = {}) => {
  const {
    context = 'Database Query',
    fallbackData = null,
    throwOnError = true
  } = options;

  try {
    const result = await retryWithBackoff(
      async () => {
        const response = await queryFn();
        if (response && response.error) {
            // PGRST116 handled gracefully if throwOnError is false
            if (response.error.code === 'PGRST116' && !throwOnError) return fallbackData;
            throw response.error;
        }
        return response?.data !== undefined ? response.data : response;
      },
      { ...options, context }
    );

    return { data: result, error: null };
  } catch (error) {
    if (error.code === 'PGRST116') {
         return { data: fallbackData, error: null };
    }
    
    logDetailedError(context, error);

    if (throwOnError) {
      return { 
        data: null, 
        error: new SupabaseError(getUserFriendlyMessage(error), error.code, error.status, error)
      };
    }

    return { data: fallbackData, error: null };
  }
};

export const executeEdgeFunction = async (functionName, payload = {}, options = {}) => {
  const {
    context = `EdgeFunction:${functionName}`,
    throwOnError = false,
    ...retryOptions
  } = options;

  try {
    const result = await retryWithBackoff(
      async () => {
        const { data, error } = await supabase.functions.invoke(functionName, {
          body: payload
        });
        if (error) throw error;
        return data;
      },
      { ...retryOptions, context }
    );

    return { data: result, error: null };
  } catch (error) {
    logDetailedError(context, error);

    if (throwOnError) {
      throw new SupabaseError(getUserFriendlyMessage(error), error.code, error.status, error);
    }

    return { 
      data: null, 
      error: new SupabaseError(getUserFriendlyMessage(error), error.code, error.status, error) 
    };
  }
};

export { isOnline };