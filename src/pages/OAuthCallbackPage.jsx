import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const OAuthCallbackPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double processing
    if (processedRef.current) return;
    
    // Check for direct errors from Google
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (errorParam) {
      setError(errorDescription || errorParam);
      setStatus('error');
      return;
    }

    const code = searchParams.get('code');
    
    if (code) {
        processedRef.current = true;
        // Exchange code
        const exchangeToken = async () => {
            try {
                const { data, error } = await supabase.functions.invoke('exchange-google-token', {
                    body: { code }
                });

                if (error) throw error;
                if (!data.id_token) throw new Error("No ID Token returned");

                // Sign in with Supabase
                const { error: signInError } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: data.id_token,
                });

                if (signInError) throw signInError;
                
                // Success will be handled by AuthContext listener, but we can set local state
                setStatus('success');
                setTimeout(() => {
                   navigate('/dashboard');
                }, 1000);

            } catch (err) {
                console.error(err);
                setError(err.message || "Authentication Failed");
                setStatus('error');
            }
        };
        exchangeToken();
    } else {
        // Fallback for implicit or other flows handled by standard Supabase redirect
        // Or if page loaded without params
        if (user) {
             setStatus('success');
             setTimeout(() => navigate('/dashboard'), 1000);
        } else if (!code && !searchParams.toString()) {
             setError("Invalid callback request.");
             setStatus('error');
        }
    }
  }, [user, navigate, searchParams]);

  return (
    <>
      <Helmet>
        <title>Authenticating... - a2z Utility Hub</title>
        <meta name="description" content="Completing your authentication with Google" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            {status === 'processing' && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Authenticating...
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we secure your session.
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Success!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Redirecting to dashboard...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
                    <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                  Authentication Failed
                </h2>
                
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error || 'An unexpected error occurred during authentication.'}
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => navigate('/auth?mode=login')}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="w-full"
                  >
                    Go to Home
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OAuthCallbackPage;