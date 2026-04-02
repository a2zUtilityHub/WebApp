import { 
  LayoutDashboard, FileText, ShoppingCart, Users, MessageSquare, 
  LifeBuoy, Settings, BarChart2, Briefcase, Bot, Ticket, 
  FileLock, Download, Activity, Globe, FolderOpen, Mail, Bell, Key, Shield
} from 'lucide-react';
import { PERMISSIONS } from './adminPermissions';

export const adminNavigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin/dashboard',
    permission: PERMISSIONS.VIEW_DASHBOARD
  },
  {
    id: 'content',
    label: 'Content Management',
    icon: FileText,
    permission: PERMISSIONS.MANAGE_CONTENT,
    children: [
      {
        id: 'cms-dashboard',
        label: 'CMS Dashboard',
        path: '/admin/content',
        permission: PERMISSIONS.MANAGE_CONTENT
      },
      {
        id: 'pages',
        label: 'Pages',
        path: '/admin/pages',
        permission: PERMISSIONS.MANAGE_CONTENT
      },
      {
        id: 'blogs',
        label: 'Blogs',
        path: '/admin/blogs', // Assuming this route exists or will exist
        permission: PERMISSIONS.MANAGE_BLOGS
      },
      {
        id: 'coupons',
        label: 'Coupons & Deals',
        path: '/admin/coupons',
        permission: PERMISSIONS.MANAGE_COUPONS
      },
      {
        id: 'apps',
        label: 'Apps',
        path: '/admin/apps', // Assuming route
        permission: PERMISSIONS.MANAGE_APPS
      },
      {
        id: 'seo',
        label: 'SEO Manager',
        path: '/admin/seo',
        permission: PERMISSIONS.MANAGE_SEO
      },
      {
         id: 'media',
         label: 'Files & Media',
         path: '/admin/storage',
         permission: PERMISSIONS.MANAGE_MEDIA
      }
    ]
  },
  {
    id: 'ecommerce',
    label: 'Ecommerce & Finance',
    icon: ShoppingCart,
    permission: PERMISSIONS.READ_FINANCE,
    children: [
      {
        id: 'plans',
        label: 'Plans & Pricing',
        path: '/admin/plans',
        permission: PERMISSIONS.MANAGE_PLANS
      },
      {
        id: 'invoices',
        label: 'Invoices',
        path: '/admin/invoices', // Assuming route
        permission: PERMISSIONS.READ_FINANCE
      }
    ]
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    permission: PERMISSIONS.MANAGE_USERS,
    children: [
      {
        id: 'users-list',
        label: 'All Users',
        path: '/admin/users',
        permission: PERMISSIONS.MANAGE_USERS
      },
      {
        id: 'roles',
        label: 'Roles',
        path: '/admin/roles',
        permission: PERMISSIONS.MANAGE_ROLES
      },
      {
        id: 'permissions',
        label: 'Permissions',
        path: '/admin/permissions',
        permission: PERMISSIONS.MANAGE_PERMISSIONS
      },
      {
        id: 'activity',
        label: 'Activity Logs',
        path: '/admin/user-activity',
        permission: PERMISSIONS.VIEW_ACTIVITY
      },
      {
         id: 'hr',
         label: 'HR Management',
         path: '/admin/hr',
         permission: PERMISSIONS.MANAGE_HR
      }
    ]
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: MessageSquare,
    permission: PERMISSIONS.MANAGE_MESSAGING,
    children: [
      {
        id: 'inbox',
        label: 'Inbox',
        path: '/admin/messaging',
        permission: PERMISSIONS.MANAGE_MESSAGING
      },
      {
        id: 'newsletter',
        label: 'Newsletter',
        path: '/admin/newsletter', // Assuming route
        permission: PERMISSIONS.MANAGE_NEWSLETTER
      },
      {
        id: 'notifications',
        label: 'Notifications',
        path: '/admin/notifications',
        permission: PERMISSIONS.MANAGE_NOTIFICATIONS
      },
      {
        id: 'chatbot',
        label: 'Chatbot',
        path: '/admin/chatbot',
        permission: PERMISSIONS.MANAGE_CHATBOT
      }
    ]
  },
  {
    id: 'support',
    label: 'Support',
    icon: LifeBuoy,
    permission: PERMISSIONS.MANAGE_TICKETS,
    children: [
      {
        id: 'tickets',
        label: 'Tickets',
        path: '/admin/support',
        permission: PERMISSIONS.MANAGE_TICKETS
      }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    permission: PERMISSIONS.MANAGE_SETTINGS,
    children: [
      {
        id: 'general-settings',
        label: 'General',
        path: '/admin/settings',
        permission: PERMISSIONS.MANAGE_SETTINGS
      },
      {
        id: 'oauth',
        label: 'Auth / OAuth',
        path: '/admin/oauth-settings',
        permission: PERMISSIONS.MANAGE_SETTINGS
      },
      {
        id: 'legal',
        label: 'Legal Documents',
        path: '/admin/legal',
        permission: PERMISSIONS.MANAGE_LEGAL
      },
      {
        id: 'backup',
        label: 'Backup & Restore',
        path: '/admin/backup',
        permission: PERMISSIONS.EXPORT_DATA
      },
      {
        id: 'analytics',
        label: 'System Analytics',
        path: '/admin/analytics',
        permission: PERMISSIONS.VIEW_ANALYTICS
      }
    ]
  }
];