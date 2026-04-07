
import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [errorDetails, setErrorDetails] = useState(null);
  const [status, setStatus] = useState('processing');
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    
    const processCallback = async () => {
      processedRef.current = true;
      
      try {
        const hash = window.location.hash;
        if (!hash) {
          const searchParams = new URLSearchParams(window.location.search);
          const error = searchParams.get('error');
          const errorDescription = searchParams.get('error_description');
          
          if (error) {
            throw new Error(errorDescription || error);
          }
          
          // Verify if there's already a session just in case
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
             throw new Error("No authentication tokens found in the URL.");
          }
        } else {
          // Parse URL hash for tokens
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const expiresIn = hashParams.get('expires_in');
          const error = hashParams.get('error');
          const errorDescription = hashParams.get('error_description');

          if (error) {
            throw new Error(errorDescription || error);
          }

          if (!accessToken || !refreshToken) {
            throw new Error("Missing required authentication tokens in the URL.");
          }

          // Create session
          const sessionData = {
            access_token: accessToken,
            refresh_token: refreshToken
          };
          
          if (expiresIn) {
             sessionData.expires_in = parseInt(expiresIn, 10);
          }

          const { data: { session }, error: sessionError } = await supabase.auth.setSession(sessionData);

          if (sessionError) {
            throw sessionError;
          }

          if (!session) {
            throw new Error("Failed to create authenticated session.");
          }
        }

        // Successfully authenticated
        setStatus('success');
        setTimeout(() => navigate('/', { replace: true }), 1000);

      } catch (err) {
        console.error('[OAuth Callback] Error:', err);
        setErrorDetails(err.message || "An unexpected error occurred during login.");
        setStatus('error');
      }
    };

    processCallback();
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Authenticating... - a2z Utility Hub</title>
        <meta name="description" content="Completing your authentication" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
          <CardContent className="pt-8 pb-8 px-6">
            {status === 'processing' && (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Securing Your Session
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Validating and securing your login session...
                  </p>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center space-y-6 animate-in zoom-in">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Login Successful!
                  </h2>
                  <p className="text-muted-foreground">Redirecting...</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4">
                <div className="flex justify-center">
                  <AlertCircle className="h-16 w-16 text-destructive" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Authentication Failed
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {errorDetails}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={() => navigate('/auth?mode=login')} className="w-full">
                    Try Logging In Again
                  </Button>
                  <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                    Return to Home
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
