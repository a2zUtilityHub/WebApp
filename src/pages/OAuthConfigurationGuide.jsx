
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const OAuthConfigurationGuide = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const redirectUri = `${window.location.origin}/auth/callback`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(redirectUri);
    setCopied(true);
    toast({ title: "Copied!", description: "Redirect URI copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Helmet>
        <title>OAuth Configuration Guide | Setup</title>
      </Helmet>
      
      <div className="container max-w-4xl py-12 mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Google OAuth Setup Guide</h1>
          <p className="text-muted-foreground mt-2">
            Step-by-step instructions to enable Google Sign-In for your Supabase project.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Configure Google Cloud Console</CardTitle>
            <CardDescription>Get your OAuth credentials from Google.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground">
            <ol className="list-decimal list-inside space-y-3">
              <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center">Google Cloud Console <ExternalLink className="h-3 w-3 ml-1" /></a>.</li>
              <li>Create a new project or select an existing one.</li>
              <li>Navigate to <strong>APIs & Services</strong> &gt; <strong>OAuth consent screen</strong> and configure it (choose External if public).</li>
              <li>Go to <strong>Credentials</strong> &gt; <strong>Create Credentials</strong> &gt; <strong>OAuth client ID</strong>.</li>
              <li>Select <strong>Web application</strong> as the Application type.</li>
              <li>Under <strong>Authorized redirect URIs</strong>, add your exact Supabase callback URL.
                <div className="my-3 p-3 bg-muted rounded-md flex justify-between items-center border">
                  <code className="text-sm break-all">{redirectUri}</code>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </li>
              <li>Click <strong>Create</strong>. Copy your <strong>Client ID</strong> and <strong>Client Secret</strong>.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Enable Provider in Supabase</CardTitle>
            <CardDescription>Link your Google credentials to Supabase Auth.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground">
            <ol className="list-decimal list-inside space-y-3">
              <li>Go to your <a href="https://supabase.com/dashboard/project/_/auth/providers" target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center">Supabase Dashboard <ExternalLink className="h-3 w-3 ml-1" /></a>.</li>
              <li>Click on <strong>Authentication</strong> &gt; <strong>Providers</strong>.</li>
              <li>Select <strong>Google</strong> from the list to expand its settings.</li>
              <li>Toggle <strong>Enable Google</strong> to ON.</li>
              <li>Paste the <strong>Client ID</strong> and <strong>Client Secret</strong> you copied from Google.</li>
              <li>Click <strong>Save</strong>.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-semibold text-amber-600 dark:text-amber-500">Common Errors</h4>
                <ul className="list-disc list-inside text-sm text-foreground space-y-1">
                  <li><strong>redirect_uri_mismatch:</strong> Ensure the URI added in Google Cloud Console matches your current domain EXACTLY (including http/https and trailing slashes).</li>
                  <li><strong>Provider not enabled:</strong> Make sure you clicked Save in Supabase after toggling Google ON.</li>
                  <li><strong>Session not persisting:</strong> Ensure you are using HTTPS or localhost. Cookies won't set on HTTP domains other than localhost.</li>
                </ul>
              </div>
            </div>
            <div className="pt-4">
              <Button onClick={() => window.location.href = '/oauth-status'} variant="default">
                Run Diagnostic Tests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OAuthConfigurationGuide;
