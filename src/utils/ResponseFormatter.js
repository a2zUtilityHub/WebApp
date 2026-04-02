import { format } from 'date-fns';

export const ResponseFormatter = {
  formatResponse(responseText, context) {
    if (!responseText) return '';
    let formatted = responseText;
    
    // Common variables
    const variables = {
      user_name: context?.user?.user_metadata?.first_name || 'there',
      current_time: this.formatTimestamp(new Date()),
      ...context // Spread other context vars
    };

    return this.substituteVariables(formatted, variables);
  },

  substituteVariables(text, variables) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return typeof variables[key] !== 'undefined' ? variables[key] : match;
    });
  },

  formatTimestamp(date) {
    // Default format
    try {
      return format(date, 'h:mm a');
    } catch (e) {
      return '';
    }
  },
  
  escapeHtml(text) {
    if (!text) return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
  }
};