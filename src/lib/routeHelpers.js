import { routeConfig } from '@/config/routes';
import { pageVisibilityService } from '@/services/pageVisibilityService';

export const isPageVisible = async (slug) => {
  try {
    const { success, data } = await pageVisibilityService.getPageVisibility(slug);
    if (success && data) {
      return data.is_visible;
    }
    return true; // Default to visible if check fails or not found (safety fallback)
  } catch (error) {
    console.error(`Error checking visibility for ${slug}:`, error);
    return true;
  }
};

export const getPageRoute = (slug) => {
  const route = routeConfig.public.find(r => r.slug === slug);
  return route ? route.path : '/';
};

export const getPageComponent = (slug) => {
   // This is a helper for dynamic rendering if needed, 
   // but primarily we use the hardcoded route map in App.jsx
   return null; 
};

export const getPageTitle = (slug) => {
  const route = routeConfig.public.find(r => r.slug === slug);
  return route ? route.title : '';
};

export const getRouteByPath = (path) => {
  const all = [...routeConfig.public, ...routeConfig.user, ...routeConfig.admin];
  return all.find(r => r.path === path);
};

export const getAllPublicRoutes = () => routeConfig.public;
export const getAllAdminRoutes = () => routeConfig.admin;

export const getVisibleFooterLinks = async () => {
  const { success, data } = await pageVisibilityService.getVisiblePages();
  if (!success || !data) return [];
  return data.map(p => p.slug);
};