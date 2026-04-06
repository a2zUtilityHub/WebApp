import React, { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { Toaster } from "@/components/ui/toaster";
import { Loader2, WifiOff } from 'lucide-react';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { NotificationsProvider } from '@/contexts/NotificationContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { CartProvider } from '@/hooks/useCart';
import { seedChatbotSettings } from '@/scripts/seedChatbotSettings';
import { initializeChatbotSettings } from '@/services/chatbotInitializationService';
import { supabase } from '@/lib/customSupabaseClient';
import ErrorBoundaryWithRetry from '@/components/ErrorBoundaryWithRetry';
import '@/i18n';

const rootElement = document.getElementById('root');

const LoadingFallback = () => (
  <div className="fixed inset-0 bg-background z-[100] flex items-center justify-center">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground p-2 text-center z-[200] flex items-center justify-center gap-2 text-sm font-medium">
      <WifiOff className="h-4 w-4" />
      You are currently offline. Using cached data where available.
    </div>
  );
};

const AppInitializer = ({ children }) => {
    useEffect(() => {
        const init = async () => {
            try {
                // Ensure Supabase client logic runs properly at startup
                if (supabase) {
                    seedChatbotSettings().catch(console.error);
                    const { data: defaultBot } = await supabase.from('chatbots').select('id').limit(1).maybeSingle();
                    if (defaultBot) {
                        initializeChatbotSettings(defaultBot.id).catch(console.error);
                    }
                }
            } catch (error) {
                console.error("App initialization warning:", error);
            }
        };
        init();
    }, []);

    return children;
};

// Providers ordering: CartProvider wraps the app to handle Ecommerce functionality correctly
ReactDOM.createRoot(rootElement).render(
  <>
    <ErrorBoundaryWithRetry>
      <Suspense fallback={<LoadingFallback />}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ThemeProvider defaultTheme="light" storageKey="a2z-ui-theme">
            <CartProvider>
              <AuthProvider>
                <LocationProvider>
                  <NotificationsProvider>
                    <AppInitializer>
                      <OfflineBanner />
                      <App />
                      <Toaster />
                    </AppInitializer>
                  </NotificationsProvider>
                </LocationProvider>
              </AuthProvider>
            </CartProvider>
          </ThemeProvider>
        </BrowserRouter>
      </Suspense>
    </ErrorBoundaryWithRetry>
  </>
);