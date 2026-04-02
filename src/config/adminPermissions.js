export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view:dashboard',
  VIEW_ANALYTICS: 'read:analytics',

  // Content
  MANAGE_CONTENT: 'manage:content',
  MANAGE_BLOGS: 'manage:blogs',
  MANAGE_COUPONS: 'manage:coupons',
  MANAGE_APPS: 'manage:apps',
  MANAGE_SEO: 'manage:seo',
  MANAGE_MEDIA: 'manage:storage',

  // Users
  MANAGE_USERS: 'manage:users',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_PERMISSIONS: 'manage_permissions',
  VIEW_ACTIVITY: 'view_user_activity',

  // Ecommerce/Finance
  READ_FINANCE: 'read:finance',
  MANAGE_PLANS: 'manage:plans',
  
  // Communication
  MANAGE_MESSAGING: 'manage:messaging',
  MANAGE_NEWSLETTER: 'manage:newsletter',
  MANAGE_NOTIFICATIONS: 'manage:settings', // grouping with settings for now or specific
  MANAGE_CHATBOT: 'manage_chatbots',

  // Support
  MANAGE_TICKETS: 'manage:tickets',

  // Settings & System
  MANAGE_SETTINGS: 'manage:settings',
  MANAGE_LEGAL: 'manage:legal',
  EXPORT_DATA: 'export_data',
  MANAGE_HR: 'manage_hr',
  MANAGE_TASKS: 'manage_tasks',
};

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  CONTENT_MANAGER: 'Content Manager',
  USER_MANAGER: 'User Manager',
  SUPPORT_MANAGER: 'Support Lead',
  FINANCE_MANAGER: 'F&A',
  HR_MANAGER: 'HR',
  SEO_MANAGER: 'SEO',
};

export const DEFAULT_ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['*'], // Logic handles * as all permissions
  [ROLES.CONTENT_MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.MANAGE_BLOGS,
    PERMISSIONS.MANAGE_COUPONS,
    PERMISSIONS.MANAGE_APPS,
    PERMISSIONS.MANAGE_MEDIA,
    PERMISSIONS.MANAGE_NEWSLETTER
  ],
  [ROLES.USER_MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_ACTIVITY
  ],
  [ROLES.SUPPORT_MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_TICKETS,
    PERMISSIONS.MANAGE_MESSAGING,
    PERMISSIONS.MANAGE_CHATBOT
  ],
  [ROLES.SEO_MANAGER]: [
     PERMISSIONS.VIEW_DASHBOARD,
     PERMISSIONS.MANAGE_SEO,
     PERMISSIONS.VIEW_ANALYTICS
  ]
};