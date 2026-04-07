
/**
 * Centralized OAuth Error Handling
 */

export const OAUTH_ERRORS = {
  MISSING_STATE: 'missing_state',
  STATE_MISMATCH: 'state_mismatch',
  STATE_EXPIRED: 'state_expired',
  MISSING_CODE: 'missing_code',
  TOKEN_EXCHANGE_ERROR: 'token_exchange_error',
  PROVIDER_ERROR: 'provider_error',
  NETWORK_ERROR: 'network_error',
  TIMEOUT_ERROR: 'timeout_error',
  UNKNOWN_ERROR: 'unknown_error'
};

export const classifyOAuthError = (params, error = null) => {
  if (params.error) return OAUTH_ERRORS.PROVIDER_ERROR;
  
  if (!params.state && params.code) return OAUTH_ERRORS.MISSING_STATE;
  if (!params.code && params.state) return OAUTH_ERRORS.MISSING_CODE;
  
  if (error) {
    const msg = error.message?.toLowerCase() || '';
    if (msg.includes('mismatch') || msg.includes('invalid state')) return OAUTH_ERRORS.STATE_MISMATCH;
    if (msg.includes('expired') || msg.includes('time elapsed')) return OAUTH_ERRORS.STATE_EXPIRED;
    if (msg.includes('timeout')) return OAUTH_ERRORS.TIMEOUT_ERROR;
    if (msg.includes('network') || msg.includes('fetch')) return OAUTH_ERRORS.NETWORK_ERROR;
    if (msg.includes('exchange') || msg.includes('grant')) return OAUTH_ERRORS.TOKEN_EXCHANGE_ERROR;
  }
  
  return OAUTH_ERRORS.UNKNOWN_ERROR;
};

export const getOAuthErrorMessage = (errorType, providerErrorMsg = null) => {
  switch (errorType) {
    case OAUTH_ERRORS.MISSING_STATE:
      return {
        title: "Missing Security State",
        description: "The authentication provider did not return the required security state. Please try again.",
        action: "retry"
      };
    case OAUTH_ERRORS.STATE_MISMATCH:
      return {
        title: "Security Verification Failed",
        description: "State mismatch detected. This can happen if you opened multiple login tabs. Please retry from a single tab.",
        action: "retry"
      };
    case OAUTH_ERRORS.STATE_EXPIRED:
      return {
        title: "Login Session Expired",
        description: "Your login attempt took longer than 5 minutes and expired. Please try again.",
        action: "retry"
      };
    case OAUTH_ERRORS.MISSING_CODE:
      return {
        title: "Login Incomplete",
        description: "The authentication provider didn't return an authorization code.",
        action: "retry"
      };
    case OAUTH_ERRORS.TOKEN_EXCHANGE_ERROR:
      return {
        title: "Authentication Failed",
        description: "Failed to securely exchange the authorization code for a session. Please try again.",
        action: "retry"
      };
    case OAUTH_ERRORS.PROVIDER_ERROR:
      return {
        title: "Provider Error",
        description: providerErrorMsg || "The authentication provider reported an error.",
        action: "retry"
      };
    case OAUTH_ERRORS.NETWORK_ERROR:
      return {
        title: "Connection Error",
        description: "A network issue prevented us from completing your login. Please check your connection.",
        action: "retry"
      };
    case OAUTH_ERRORS.TIMEOUT_ERROR:
      return {
        title: "Request Timeout",
        description: "The authentication server took too long to respond. Please try again.",
        action: "retry"
      };
    case OAUTH_ERRORS.UNKNOWN_ERROR:
    default:
      return {
        title: "Unexpected Error",
        description: "An unexpected error occurred during login. Please try again.",
        action: "retry"
      };
  }
};

export const logOAuthError = (errorType, details = {}) => {
  console.error(`🚨 [OAuth Error] Type: ${errorType}`, JSON.stringify(details, null, 2));
};
