import { executeQuery } from './supabaseErrorHandler';

/**
 * Enhanced safe query wrapper with comprehensive error handling
 * @param {Function} queryFn - Function returning a Supabase query promise
 * @param {Object} options - Options for the query
 * @returns {Promise<{data: any, error: Error|null}>}
 */
export const safeQuery = async (queryFn, options = {}) => {
  const {
    context = 'Database Query',
    retries = 3,
    timeout = 30000,
    fallbackData = null,
    throwOnError = false
  } = options;

  return executeQuery(queryFn, {
    context,
    maxRetries: retries,
    timeout,
    fallbackData,
    throwOnError
  });
};

/**
 * Batch fetch multiple queries with individual error handling
 * @param {Array<{queryFn: Function, context: string}>} queries
 * @returns {Promise<Array<{data: any, error: Error|null}>>}
 */
export const batchSafeQuery = async (queries) => {
  return Promise.all(
    queries.map(({ queryFn, context, ...options }) =>
      safeQuery(queryFn, { context, ...options })
    )
  );
};

/**
 * Fetch with automatic retry and fallback
 */
export const fetchWithRetry = async (url, options = {}) => {
  const { retries = 3, timeout = 30000 } = options;
  
  return executeQuery(
    async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    {
      context: `Fetch: ${url}`,
      maxRetries: retries,
      timeout
    }
  );
};