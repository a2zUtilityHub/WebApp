
/**
 * OAuth Utility Functions
 */

/**
 * Validates that a redirect URL is on the same origin
 */
export const isValidRedirectUrl = (url) => {
  if (!url) return false;
  try {
    if (url.startsWith('/')) return true;
    const targetUrl = new URL(url);
    const currentOrigin = window.location.origin;
    return targetUrl.origin === currentOrigin;
  } catch (err) {
    return false;
  }
};
