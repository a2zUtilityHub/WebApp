export const getErrorMessage = (error) => {
  if (!error) return "An unknown error occurred.";
  
  // Handle string errors
  if (typeof error === 'string') return error;

  // Handle Fetch/Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return "Network error: Unable to connect to the server. Please check your internet connection.";
  }

  // Handle Supabase/PostgREST errors
  if (error.code) {
    if (error.code === 'PGRST116' || error.code === '42501') {
      return "Access denied: You don't have permission to access this data. (RLS Policy restriction)";
    }
    if (error.code === '23505') {
      return "Permission denied: Action not allowed.";
    }
  }

  // Handle Edge Function errors (FunctionsFetchError)
  if (error.name === 'FunctionsFetchError' || error.message?.includes('FunctionsFetchError')) {
    return "Service temporarily unavailable: Failed to connect to backend functions.";
  }

  // Handle standard HTTP errors attached to custom error objects
  if (error.status) {
    switch (error.status) {
      case 401: return "Unauthorized: Please log in to continue.";
      case 403: return "Forbidden: You don't have access to this resource.";
      case 404: return "Not found: The requested resource could not be found.";
      case 408: return "Request timeout: The server took too long to respond.";
      case 429: return "Too many requests: Please try again later.";
      case 500: return "Server error: An internal server error occurred.";
      case 503: return "Service unavailable: The server is temporarily overloaded.";
    }
  }

  return error.message || "An unexpected error occurred.";
};

export const shouldRetry = (error) => {
  if (!error) return false;
  
  // Don't retry auth or permission errors
  if (error.status === 401 || error.status === 403 || error.code === 'PGRST116' || error.code === '42501') {
    return false;
  }
  
  // Don't retry 404s
  if (error.status === 404) return false;

  // Retry network errors, timeouts, and 5xx server errors
  return (
    error.name === 'TypeError' || // Network fetch failure
    error.name === 'FunctionsFetchError' ||
    error.status === 408 ||
    error.status === 429 ||
    (error.status >= 500 && error.status <= 599)
  );
};

export const logError = (context, error, additionalData = {}) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [ERROR] [${context}]`, {
    message: error?.message || error,
    name: error?.name,
    code: error?.code,
    status: error?.status,
    stack: error?.stack,
    ...additionalData
  });
};

export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000, context = 'Operation') => {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      if (attempt > 0) {
        console.log(`[${new Date().toISOString()}] [RETRY] [${context}] Attempt ${attempt + 1} of ${maxRetries}...`);
      }
      return await fn();
    } catch (error) {
      attempt++;
      logError(`${context} (Attempt ${attempt})`, error);
      
      if (attempt >= maxRetries || !shouldRetry(error)) {
        console.error(`[${new Date().toISOString()}] [FAILED] [${context}] Max retries reached or non-retriable error.`);
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`[${new Date().toISOString()}] [WAIT] [${context}] Waiting ${delay}ms before next retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};