export const routeTests = [
  // Public Core
  { path: '/', component: 'HomePage', visibility: 'public' },
  { path: '/apps', component: 'AppsPage', visibility: 'public' },
  { path: '/blogs', component: 'BlogsPage', visibility: 'public' },
  { path: '/coupons', component: 'CouponsPage', visibility: 'public' },
  { path: '/pricing', component: 'PricingPage', visibility: 'public' },
  
  // Controlled Visibility
  { path: '/about-us', component: 'AboutPage', visibility: 'checked', slug: 'about-us' },
  { path: '/contact-us', component: 'ContactPage', visibility: 'checked', slug: 'contact-us' },
  { path: '/testimonials', component: 'TestimonialsPage', visibility: 'checked', slug: 'testimonials' },
  { path: '/share-earn', component: 'ShareEarnPage', visibility: 'checked', slug: 'share-earn' },

  // CMS Pages
  { path: '/legal/terms', component: 'DynamicFooterPage', visibility: 'checked', slug: 'terms-of-service' },
  { path: '/legal/privacy', component: 'DynamicFooterPage', visibility: 'checked', slug: 'privacy-policy' },
  
  // User Routes
  { path: '/dashboard', component: 'DashboardPage', visibility: 'protected' },
  
  // Admin Routes
  { path: '/admin/dashboard', component: 'AdminDashboardPage', visibility: 'admin' },
  { path: '/admin/pages', component: 'AdminPagesManager', visibility: 'admin' },
  { path: '/admin/page-visibility', component: 'AdminPageVisibilityPage', visibility: 'admin' }
];