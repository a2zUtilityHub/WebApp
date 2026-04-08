export const adminNavigation = [
  {
    id: 'core',
    label: 'Core',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', route: '/admin/dashboard', permission: 'view_dashboard' },
      { id: 'users', label: 'Users', icon: 'Users', route: '/admin/users', permission: 'manage_users' },
      { id: 'roles', label: 'Roles & Permissions', icon: 'Shield', route: '/admin/roles', permission: 'manage_roles' }
    ]
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { id: 'database-management', label: 'Database Management', icon: 'Database', route: '/admin/database-management', permission: 'super_admin' },
      { id: 'settings', label: 'Settings', icon: 'Settings', route: '/admin/settings', permission: 'manage_settings' },
      { id: 'audit', label: 'Audit Logs', icon: 'Activity', route: '/admin/audit', permission: 'view_audit_logs' },
      { id: 'backup', label: 'Backups', icon: 'Download', route: '/admin/backup', permission: 'manage_backups' }
    ]
  },
  {
    id: 'content',
    label: 'Content',
    items: [
      { id: 'apps', label: 'Apps', icon: 'Briefcase', route: '/admin/apps', permission: 'manage_apps' },
      { id: 'coupons', label: 'Coupons', icon: 'Ticket', route: '/admin/coupons', permission: 'manage_coupons' },
      { id: 'blogs', label: 'Blogs', icon: 'FileText', route: '/admin/blogs', permission: 'manage_blogs' },
      { id: 'categories', label: 'Categories', icon: 'FolderOpen', route: '/admin/categories', permission: 'manage_categories' }
    ]
  },
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    items: [
      { id: 'store-management', label: 'Store Management', icon: 'ShoppingCart', route: '/admin/store-management', permission: 'super_admin' }
    ]
  },
  {
    id: 'support',
    label: 'Support',
    items: [
      { id: 'tickets', label: 'Support Tickets', icon: 'LifeBuoy', route: '/admin/support', permission: 'manage_support' },
      { id: 'chatbot', label: 'Chatbot', icon: 'Bot', route: '/admin/chatbot', permission: 'manage_chatbot' },
      { id: 'messaging', label: 'Messaging', icon: 'MessageSquare', route: '/admin/messaging', permission: 'manage_messaging' }
    ]
  }
];