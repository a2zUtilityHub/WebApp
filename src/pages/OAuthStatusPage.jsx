
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { logOAuthDiagnostics } from '@/utils/oauthDiagnostics';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const OAuthStatusPage = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { signInWithGoogle } = useAuth();

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const results = await logOAuthDiagnostics();
      setStatus(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const StatusItem = ({ label, result, description }) => {
    if (!result) return null;
    
    const isOk = result.valid || result.enabled;
    const Icon = isOk ? CheckCircle2 : (result.warning ? AlertTriangle : XCircle);
    const colorClass = isOk ? 'text-green-500' : (result.warning ? 'text-amber-500' : 'text-destructive');

    return (
      <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
        <Icon className={`h-6 w-6 mt-0.5 ${colorClass}`} />
        <div className="flex-1 space-y-1">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
          {!isOk && (
            <div className="mt-2 p-3 bg-muted rounded-md text-sm font-mono text-foreground break-all">
              {result.error || result.warning}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>OAuth Configuration Status | Diagnostics</title>
      </Helmet>
      
      <div className="container max-w-4xl py-12 mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OAuth Configuration Status</h1>
          <p className="text-muted-foreground mt-2">
            Diagnostic tools to verify Supabase Google OAuth setup.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12 border rounded-lg bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg text-muted-foreground">Running diagnostics...</span>
          </div>
        ) : status ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Diagnostic Results</CardTitle>
                <CardDescription>Automated checks for your environment and Supabase configuration.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <StatusItem 
                  label="Supabase Environment Config" 
                  description="Checks if VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present."
                  result={status.config} 
                />
                <StatusItem 
                  label="Redirect URI Configuration" 
                  description={`Expected: ${window.location.origin}/auth/callback`}
                  result={status.redirect} 
                />
                <StatusItem 
                  label="Google Provider Status" 
                  description="Attempts a dry-run OAuth connection to check if the provider is enabled in Supabase."
                  result={status.provider} 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting & Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(!status.provider.enabled || !status.config.valid) && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg space-y-2">
                    <h3 className="font-semibold text-destructive flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" /> Actions Required
                    </h3>
                    <ul className="list-disc list-inside text-sm text-foreground ml-4 space-y-1">
                      <li>Go to your <a href="https://supabase.com/dashboard/project/_/auth/providers" target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center">Supabase Dashboard <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                      <li>Navigate to Authentication → Providers</li>
                      <li>Enable Google, add your Client ID and Client Secret.</li>
                      <li>Ensure your redirect URI <code>{window.location.origin}/auth/callback</code> is added to Google Cloud Console.</li>
                    </ul>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button onClick={runDiagnostics} variant="outline">
                    Rerun Diagnostics
                  </Button>
                  <Button onClick={() => signInWithGoogle()} disabled={!status.provider.enabled}>
                    Test OAuth Flow
                  </Button>
                  <Button onClick={() => window.location.href = '/oauth-guide'} variant="secondary">
                    View Setup Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="p-4 text-destructive border border-destructive/20 bg-destructive/10 rounded-lg">
            Failed to run diagnostics.
          </div>
        )}
      </div>
    </>
  );
};

export default OAuthStatusPage;
