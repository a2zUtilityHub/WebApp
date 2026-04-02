export const handleTaskError = (error, context = '') => {
  console.error(`[Task Error] ${context}:`, error);

  let message = 'An unexpected error occurred.';
  let code = 'UNKNOWN_ERROR';
  let isRecoverable = true;

  if (!error) return { message, code, isRecoverable };

  // Supabase specific errors
  if (error.code) {
    code = error.code;
    switch (error.code) {
      case '42501': // RLS Policy violation
        message = 'You do not have permission to perform this action.';
        isRecoverable = false;
        break;
      case '23505': // Unique violation
        message = 'A record with this information already exists.';
        break;
      case '23503': // Foreign key violation
        message = 'Referenced data does not exist. Please refresh the page.';
        break;
      case 'PGRST116': // JSON object requested, multiple (or no) rows returned
        message = 'Requested data could not be found.';
        break;
      case 'XX000':
        message = 'Internal database error. Please try again later.';
        break;
      default:
        message = error.message || `Database error: ${error.code}`;
    }
  } else if (error.message) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      message = 'Network error. Please check your internet connection.';
      code = 'NETWORK_ERROR';
    } else if (error.message.includes('JWT') || error.message.includes('session')) {
      message = 'Your session has expired. Please log in again.';
      code = 'AUTH_ERROR';
      isRecoverable = false;
    } else {
      message = error.message;
    }
  }

  return {
    message,
    code,
    isRecoverable,
    originalError: error
  };
};