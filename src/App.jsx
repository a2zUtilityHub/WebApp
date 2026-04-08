
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import MobileMenu from '@/components/layout/MobileMenu';
import DevelopmentBanner from '@/components/DevelopmentBanner';
import ChatbotWidget from '@/components/chatbot/ChatbotWidget';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { CartProvider } from '@/hooks/useCart';
import { AdSenseProvider } from '@/contexts/AdSenseProvider';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';

import '@/styles/AdSidebarLayout.css';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const AppsPage = lazy(() => import('@/pages/AppsPage'));
const AppDetailPage = lazy(() => import('@/pages/AppDetailPage'));
const UrlShortenerPage = lazy(() => import('@/pages/apps/UrlShortenerPage'));
const TaskManagerPage = lazy(() => import('@/pages/apps/TaskManagerPage'));
const VideoEditorPage = lazy(() => import('@/pages/apps/VideoEditorPage'));
const StorePage = lazy(() => import('@/pages/StorePage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const BlogsPage = lazy(() => import('@/pages/BlogsPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const CouponsPage = lazy(() => import('@/pages/CouponsPage'));
const CouponCategoryPage = lazy(() => import('@/pages/CouponCategoryPage'));
const DiscussionForumPage = lazy(() => import('@/pages/DiscussionForumPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const SupportPage = lazy(() => import('@/pages/SupportPage'));
const CareersPage = lazy(() => import('@/pages/CareersPage'));
const TestimonialsPage = lazy(() => import('@/pages/TestimonialsPage'));
const PressPage = lazy(() => import('@/pages/PressPage'));
const DonatePage = lazy(() => import('@/pages/DonatePage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const HowItWorksPage = lazy(() => import('@/pages/HowItWorksPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const ReferEarnPage = lazy(() => import('@/pages/ReferEarnPage'));
const ShareEarnPage = lazy(() => import('@/pages/ShareEarnPage'));

// OAuth specifics
const OAuthCallbackPage = lazy(() => import('@/pages/OAuthCallbackPage'));
const OAuthStatusPage = lazy(() => import('@/pages/OAuthStatusPage'));
const OAuthConfigurationGuide = lazy(() => import('@/pages/OAuthConfigurationGuide'));

// Dynamic Pages
const PopularDealsPage = lazy(() => import('@/pages/PopularDealsPage'));
const PopularDealsCategoryPage = lazy(() => import('@/pages/PopularDealsCategoryPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const CategoryDetailPage = lazy(() => import('@/pages/CategoryDetailPage'));

// Admin Pages
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminAccessDenied = lazy(() => import('@/pages/admin/AdminAccessDenied'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminRolesPage = lazy(() => import('@/pages/admin/AdminRolesPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminAppsManager = lazy(() => import('@/pages/admin/AdminAppsManager'));
const AdminCouponsManager = lazy(() => import('@/pages/admin/AdminCouponsManager'));
const AdminBlogsManager = lazy(() => import('@/pages/admin/AdminBlogsManager'));
const AdminDealsManager = lazy(() => import('@/pages/admin/AdminDealsManager'));
const AdminCategoriesManager = lazy(() => import('@/pages/admin/AdminCategoriesManager'));
const AdminPlansPage = lazy(() => import('@/pages/admin/AdminPlansPage'));
const AdminMessagingPage = lazy(() => import('@/pages/admin/AdminMessagingPage'));
const AdminChatbotPage = lazy(() => import('@/pages/admin/AdminChatbotPage'));
const AdminSupportPage = lazy(() => import('@/pages/admin/AdminSupportPage'));
const AdminTasksPage = lazy(() => import('@/pages/admin/AdminTasksPage'));
const AdminHRPage = lazy(() => import('@/pages/admin/AdminHRPage'));
const AdminActivityPage = lazy(() => import('@/pages/admin/AdminActivityPage'));
const AdminBackupPage = lazy(() => import('@/pages/admin/AdminBackupPage'));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'));
const AdminNotificationsPage = lazy(() => import('@/pages/admin/AdminNotificationsPage'));
const AdminSEOPage = lazy(() => import('@/pages/admin/AdminSEOPage'));

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Global routing/rendering error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
          <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            An unexpected error occurred. This could be due to a configuration issue or a temporary glitch.
          </p>
          <div className="flex gap-4">
            <button onClick={() => window.location.href = '/'} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Return Home</button>
            <button onClick={() => window.location.reload()} className="px-4 py-2 border rounded-md">Reload Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const PageLoader = () => (
  <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-background/50 backdrop-blur-sm w-full z-50">
    <LoadingSpinner size="xl" text="Loading amazing things..." />
  </div>
);

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="flex-grow flex flex-col relative z-10 w-full overflow-x-hidden">
      {children}
    </main>
    <Footer />
    <MobileMenu />
    <ChatbotWidget />
  </>
);

function App() {
  return (
    <GlobalErrorBoundary>
      <CartProvider>
        <AdSenseProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col w-full bg-background text-foreground font-sans antialiased overflow-x-hidden">
              <Helmet>
                <title>A2Z Utility Hub - All Your Tools in One Place</title>
                <meta name="description" content="Discover powerful productivity apps, amazing store deals, and valuable utilities." />
              </Helmet>
              
              {/* Global Feedback Mechanisms */}
              <Toaster />
              <Sonner position="top-right" />
              
              <DevelopmentBanner />
              
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/admin/login" element={<AdminLogin />} />

                  <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="access-denied" element={<AdminAccessDenied />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="roles" element={<AdminRolesPage />} />
                    <Route path="apps" element={<AdminAppsManager />} />
                    <Route path="coupons" element={<AdminCouponsManager />} />
                    <Route path="blogs" element={<AdminBlogsManager />} />
                    <Route path="deals" element={<AdminDealsManager />} />
                    <Route path="categories" element={<AdminCategoriesManager />} />
                    <Route path="plans" element={<AdminPlansPage />} />
                    <Route path="messaging" element={<AdminMessagingPage />} />
                    <Route path="chatbot" element={<AdminChatbotPage />} />
                    <Route path="support" element={<AdminSupportPage />} />
                    <Route path="tasks" element={<AdminTasksPage />} />
                    <Route path="hr" element={<AdminHRPage />} />
                    <Route path="audit" element={<AdminActivityPage />} />
                    <Route path="backup" element={<AdminBackupPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                    <Route path="notifications" element={<AdminNotificationsPage />} />
                    <Route path="seo" element={<AdminSEOPage />} />
                    <Route path="*" element={
                      <div className="p-12 flex flex-col items-center justify-center text-center w-full mx-auto min-h-[50vh]">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 ring-8 ring-primary/5">
                           <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight mb-3">Module Under Construction</h2>
                        <p className="text-muted-foreground text-lg">This section of the admin panel is currently being developed.</p>
                      </div>
                    } />
                  </Route>

                  {/* Auth Callbacks & Diagnostics */}
                  <Route path="/auth/callback" element={<OAuthCallbackPage />} />
                  <Route path="/oauth-status" element={<PublicLayout><OAuthStatusPage /></PublicLayout>} />
                  <Route path="/oauth-guide" element={<PublicLayout><OAuthConfigurationGuide /></PublicLayout>} />

                  <Route path="/*" element={
                    <PublicLayout>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/apps" element={<AppsPage />} />
                        <Route path="/apps/url-shortener" element={<UrlShortenerPage />} />
                        
                        <Route path="/apps/video-editor" element={<VideoEditorPage />} />
                        <Route path="/editor" element={<Navigate to="/apps/video-editor" replace />} />
                        
                        <Route path="/apps/task-manager/*" element={<TaskManagerPage />} />
                        <Route path="/task-manager/*" element={<Navigate to="/apps/task-manager" replace />} />
                        
                        <Route path="/apps/:slug" element={<AppDetailPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/categories/:category" element={<CategoryDetailPage />} />
                        <Route path="/popular-deals" element={<PopularDealsPage />} />
                        <Route path="/popular-deals/:category" element={<PopularDealsCategoryPage />} />
                        <Route path="/coupons" element={<CouponsPage />} />
                        <Route path="/coupons/:category" element={<CouponCategoryPage />} />
                        <Route path="/store" element={<StorePage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/blogs" element={<BlogsPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/discussion" element={<DiscussionForumPage />} />
                        
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/help" element={<HelpPage />} />
                        <Route path="/careers" element={<CareersPage />} />
                        <Route path="/testimonials" element={<TestimonialsPage />} />
                        <Route path="/press" element={<PressPage />} />
                        <Route path="/how-it-works" element={<HowItWorksPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/refer-earn" element={<ReferEarnPage />} />
                        <Route path="/share-earn" element={<ShareEarnPage />} />
                        <Route path="/support" element={<SupportPage />} />
                        <Route path="/donate" element={<DonatePage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        
                        <Route path="/dashboard/*" element={<ProtectedRoute requireAdmin={false}><DashboardPage /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute requireAdmin={false}><SettingsPage /></ProtectedRoute>} />
                        <Route path="/wishlist" element={<ProtectedRoute requireAdmin={false}><WishlistPage /></ProtectedRoute>} />
                        <Route path="/notifications" element={<ProtectedRoute requireAdmin={false}><NotificationsPage /></ProtectedRoute>} />
                        
                        <Route path="/about-us" element={<AboutPage />} />
                        <Route path="/contact-us" element={<ContactPage />} />
                        <Route path="/legal/privacy" element={<PrivacyPage />} />
                        <Route path="/legal/terms" element={<TermsPage />} />

                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </PublicLayout>
                  } />
                </Routes>
              </Suspense>
            </div>
          </AuthProvider>
        </AdSenseProvider>
      </CartProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
