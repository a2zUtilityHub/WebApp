export const isOffline = () => {
  return typeof navigator !== 'undefined' && !navigator.onLine;
};

export const isOnline = () => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

export const withTimeout = (promise, ms = 30000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((reason) => {
        clearTimeout(timer);
        reject(reason);
      });
  });
};

export const withExponentialBackoff = async (
  operation,
  options = {}
) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 8000,
    onRetry = null,
  } = options;

  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      if (isOffline()) {
        throw new Error('Network offline');
      }
      return await operation();
    } catch (error) {
      const isRetriable = 
        error.message === 'Network offline' ||
        error.message?.toLowerCase().includes('timed out') ||
        error.message?.toLowerCase().includes('fetch') ||
        error.message?.toLowerCase().includes('network') ||
        error.message?.toLowerCase().includes('cors') ||
        error.message?.toLowerCase().includes('connection refused') ||
        error.status === 429 ||
        (error.status >= 500 && error.status < 600);

      if (!isRetriable || attempt >= maxRetries) {
        throw error; // Max retries reached or non-retriable error
      }

      attempt++;

      if (onRetry) {
        onRetry(error, attempt);
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      const jitter = Math.random() * 200;
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }
};