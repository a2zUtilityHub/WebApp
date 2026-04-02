import { supabase } from './customSupabaseClient';

export const trackEvent = async (eventName, payload = {}) => {
  try {
    // Check if supabase is initialized correctly
    if (!supabase) return;

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // Don't throw on session error, just proceed as anonymous
    const user = session?.user;

    const eventData = {
      event_name: eventName,
      payload: {
        ...payload,
        path: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      },
      user_id: user?.id || null
    };

    // Use try-catch for the specific insert operation to prevent unhandled promise rejections
    try {
        const { error } = await supabase.from('analytics_events').insert(eventData);
        if (error) {
            // Silent fail for analytics to not disrupt user experience
            // console.warn('Analytics logging failed silently:', error.message);
        }
    } catch (insertError) {
        // console.warn('Analytics insert exception:', insertError);
    }

  } catch (error) {
    // Catch-all for any other errors during event tracking prep
    // console.warn('Failed to track event:', error);
  }
};