
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const OAuthCallbackHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [errorDetails, setErrorDetails] = useState('');
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const processOAuthCallback = async () => {
      try {
        // 1. Extract params from search and hash
        const code = searchParams.get('code');
        const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
        
        const errorParam = searchParams.get('error') || hashParams.get('error');
        const errorDesc = searchParams.get('error_description') || hashParams.get('error_description');

        if (errorParam) {
          throw new Error(errorDesc || errorParam);
        }

        // 3. Exchange code for session (if PKCE code is present)
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else {
          // If no code, check for tokens in hash (Implicit Flow)
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            if (setSessionError) throw setSessionError;
          }
        }

        // Verify session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) throw new Error("No session found after authentication attempt.");

        setStatus('success');
        
        // 5. Default redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);

      } catch (err) {
        console.error('[OAuth Callback] Error:', err);
        setErrorDetails(err.message || 'Authentication failed. Please try again.');
        setStatus('error');
      }
    };

    processOAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-8 pb-8 px-6 flex flex-col items-center text-center">
          {status === 'processing' && (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">Completing Authentication</h2>
              <p className="text-muted-foreground">Please wait while we secure your session...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4 animate-fade-in">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">Login Successful</h2>
              <p className="text-muted-foreground">Redirecting you back...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4 animate-fade-in">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <h2 className="text-xl font-semibold text-destructive">Authentication Error</h2>
              <p className="text-sm text-muted-foreground bg-destructive/10 p-3 rounded-md border border-destructive/20">
                {errorDetails}
              </p>
              <div className="pt-4 flex flex-col gap-2 w-full">
                <Button onClick={() => navigate('/auth?mode=login')} className="w-full">
                  Back to Login
                </Button>
                <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                  Return Home
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallbackHandler;
