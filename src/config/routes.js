import { 
  Home, AppWindow, BookOpen, Tag, Info, Phone, Heart, LifeBuoy, 
  LayoutDashboard, Settings, Bell, Ticket, Share2, PenSquare, 
  Users, Shield, Key, Briefcase, BarChart2, MessageSquare, Bot, 
  DollarSign, Search, UserCheck, Lock, FileLock, Download, Activity,
  HelpCircle, FileText
} from 'lucide-react';

export const routeConfig = {
  public: [
    { path: '/', title: 'Home', component: 'HomePage', description: 'Welcome to a2z Utility Hub' },
    { path: '/apps', title: 'Apps', component: 'AppsPage', description: 'Explore our collection of utility apps' },
    { path: '/apps/:slug', title: 'App Details', component: 'AppDetailPage', dynamic: true },
    { path: '/blogs', title: 'Blogs', component: 'BlogsPage', description: 'Read our latest articles' },
    { path: '/blogs/:slug', title: 'Blog Post', component: 'BlogPostPage', dynamic: true },
    { path: '/coupons', title: 'Coupons', component: 'CouponsPage', description: 'Find the best deals' },
    { path: '/coupons/:store', title: 'Store Coupons', component: 'CouponStorePage', dynamic: true },
    { path: '/categories/:category', title: 'Category', component: 'CategoryPage', dynamic: true },
    { path: '/pricing', title: 'Pricing', component: 'PricingPage', description: 'Our subscription plans' },
    { path: '/faq', title: 'FAQ', component: 'FaqPage', description: 'Frequently Asked Questions' },
    { path: '/sitemap', title: 'Sitemap', component: 'SitemapPage', description: 'Site structure' },
    { path: '/donate', title: 'Donate', component: 'DonatePage', description: 'Support our work' },
    { path: '/auth', title: 'Authentication', component: 'AuthPage', description: 'Login or Sign up' },
    { path: '/reset-password', title: 'Reset Password', component: 'ResetPasswordPage' },
    { path: '/oauth-callback', title: 'OAuth Callback', component: 'OAuthCallbackPage' },
    
    // Visibility Controlled Pages
    { path: '/about-us', title: 'About Us', component: 'AboutPage', checkVisibility: true, slug: 'about-us' },
    { path: '/contact-us', title: 'Contact Us', component: 'ContactPage', checkVisibility: true, slug: 'contact-us' },
    { path: '/testimonials', title: 'Testimonials', component: 'TestimonialsPage', checkVisibility: true, slug: 'testimonials' },
    { path: '/share-earn', title: 'Share & Earn', component: 'ShareEarnPage', checkVisibility: true, slug: 'share-earn' },
    
    // Dynamic Footer Pages (CMS)
    { path: '/legal/terms', title: 'Terms & Conditions', component: 'DynamicFooterPage', slug: 'terms-of-service' },
    { path: '/legal/privacy', title: 'Privacy Policy', component: 'DynamicFooterPage', slug: 'privacy-policy' },
    { path: '/legal/anti-spam', title: 'Anti-Spam Policy', component: 'DynamicFooterPage', slug: 'anti-spam' },
    { path: '/refer-earn', title: 'Refer & Earn', component: 'DynamicFooterPage', slug: 'refer-earn' },
    { path: '/advertise', title: 'Advertise', component: 'DynamicFooterPage', slug: 'advertise' },
    { path: '/internship', title: 'Internship', component: 'DynamicFooterPage', slug: 'internship' },
    { path: '/how-it-works', title: 'How It Works', component: 'DynamicFooterPage', slug: 'how-it-works' },
    { path: '/careers', title: 'Careers', component: 'DynamicFooterPage', slug: 'careers' },
    { path: '/press', title: 'Press', component: 'DynamicFooterPage', slug: 'press' },
    
    // Discussion Forum
    { path: '/discussion-forum', title: 'Discussion Forum', component: 'DiscussionForumPage' },
    { path: '/discussion/:slug', title: 'Discussion Thread', component: 'DiscussionThreadPage', dynamic: true },
  ],
  
  user: [
    { path: '/dashboard', title: 'Dashboard', component: 'DashboardPage' },
    { path: '/notifications', title: 'Notifications', component: 'NotificationsPage' },
    { path: '/support', title: 'Support', component: 'SupportPage' },
    { path: '/support/ticket/:id', title: 'Ticket Details', component: 'SupportTicketDetailPage', dynamic: true },
    { path: '/discussion/new', title: 'Create Discussion', component: 'CreateDiscussionPage' },
    { path: '/user-settings', title: 'Settings', component: 'UserSettingsPage' },
    { path: '/settings/:tab', title: 'Settings Tab', component: 'UserSettingsPage', dynamic: true },
  ],
  
  admin: [
    { path: '/admin/dashboard', title: 'Dashboard', icon: Home, component: 'AdminDashboardPage', permission: 'read:dashboard' },
    { path: '/admin/notifications', title: 'Notifications', icon: Bell, component: 'AdminNotificationsPage', permission: 'manage:settings' },
    
    // Content Management
    { path: '/admin/coupons', title: 'Coupons', icon: Ticket, component: 'AdminCouponsManager', permission: 'manage:content' },
    { path: '/admin/social-links', title: 'Social Links', icon: Share2, component: 'AdminSocialLinksManager', permission: 'manage:content' },
    { path: '/admin/contact-info', title: 'Contact Info', icon: Phone, component: 'AdminContactInfoManager', permission: 'manage:content' },
    { path: '/admin/content', title: 'CMS Pages', icon: PenSquare, component: 'AdminContentPage', permission: 'manage:content' },
    { path: '/admin/pages', title: 'Pages Manager', icon: FileText, component: 'AdminPagesManager', permission: 'manage:content' },
    { path: '/admin/page-visibility', title: 'Page Visibility', icon: params => <params.icon />, component: 'AdminPageVisibilityPage', permission: 'manage:content' },
    { path: '/admin/pages/:slug/edit', title: 'Edit Page', component: 'AdminPageEditor', permission: 'manage:content', dynamic: true },

    // User & Role Management
    { path: '/admin/users', title: 'User Management', icon: Users, component: 'AdminUsersPage', permission: 'manage:users' },
    { path: '/admin/roles', title: 'Role Management', icon: Shield, component: 'AdminRolesPage', permission: 'manage_roles' },
    { path: '/admin/permissions', title: 'Permission Management', icon: Key, component: 'AdminPermissionsPage', permission: 'manage_permissions' },
    
    // HR & Operations
    { path: '/admin/hr', title: 'HR Management', icon: Briefcase, component: 'AdminHRPage', permission: 'manage_hr' },
    { path: '/admin/user-activity', title: 'User Activity', icon: Activity, component: 'AdminUserActivityPage', permission: 'view_user_activity' },
    { path: '/admin/backup', title: 'Backup & Export', icon: Download, component: 'AdminBackupPage', permission: 'export_data' },
    { path: '/admin/analytics', title: 'Analytics', icon: BarChart2, component: 'AdminAnalyticsPage', permission: 'read:analytics' },
    
    // Support & Comms
    { path: '/admin/messaging', title: 'Messaging', icon: MessageSquare, component: 'AdminMessagingPage', permission: 'manage:messaging' },
    { path: '/admin/support', title: 'Support Tickets', icon: LifeBuoy, component: 'AdminSupportPage', permission: 'manage:tickets' },
    { path: '/admin/support/ticket/:id', title: 'Ticket Detail', component: 'AdminSupportPage', permission: 'manage:tickets', dynamic: true },
    { path: '/admin/chatbot', title: 'Chatbot', icon: Bot, component: 'AdminChatbotPage', permission: 'manage_chatbots' },
    
    // Finance & SEO
    { path: '/admin/plans', title: 'Plans & Finance', icon: DollarSign, component: 'AdminPlansPage', permission: 'read:finance' },
    { path: '/admin/seo', title: 'SEO', icon: Search, component: 'AdminSEOPage', permission: 'manage:seo' },
    { path: '/admin/tasks', title: 'Tasks', icon: UserCheck, component: 'AdminTasksPage', permission: 'manage_tasks' },
    
    // Settings
    { path: '/admin/oauth-settings', title: 'OAuth Settings', icon: Lock, component: 'AdminOAuthSettingsPage', permission: 'manage:settings' },
    { path: '/admin/settings', title: 'System Settings', icon: Settings, component: 'AdminSettingsPage', permission: 'manage:settings' },
    { path: '/admin/legal', title: 'Legal Documents', icon: FileLock, component: 'AdminLegalPage', permission: 'manage:legal' },
    { path: '/admin/storage', title: 'Storage', icon: Shield, component: 'AdminStoragePage', permission: 'manage:storage' },
    { path: '/admin/tools/acceptance', title: 'Acceptance', component: 'AdminAcceptancePage', permission: 'manage_content' },
  ]
};

export const getRouteByPath = (path) => {
  const allRoutes = [...routeConfig.public, ...routeConfig.user, ...routeConfig.admin];
  return allRoutes.find(r => r.path === path);
};