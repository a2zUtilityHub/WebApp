
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useGoogleTagManager = () => {
  const location = useLocation();

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
  }, []);

  const pushEvent = useCallback((eventName, eventParams = {}) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...eventParams,
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

  const trackPageView = useCallback((path, title) => {
    pushEvent('page_view', {
      page_path: path,
      page_title: title || document.title,
    });
  }, [pushEvent]);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location, trackPageView]);

  return {
    pushEvent,
    trackPageView,
    trackTaskCreated: (data) => pushEvent('task_created', data),
    trackTaskCompleted: (data) => pushEvent('task_completed', data),
    trackProjectCreated: (data) => pushEvent('project_created', data),
    trackTeamMemberAdded: (data) => pushEvent('team_member_added', data),
    trackFilterApplied: (data) => pushEvent('filter_applied', data),
    trackSearchPerformed: (data) => pushEvent('search_performed', data),
    trackIntegrationConnected: (data) => pushEvent('integration_connected', data),
    trackAnalyticsViewed: (data) => pushEvent('analytics_viewed', data),
  };
};
