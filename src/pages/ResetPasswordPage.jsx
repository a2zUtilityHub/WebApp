import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a valid session (Supabase handles the token exchange from URL automatically)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setValidSession(true);
      } else {
        // Try to handle hash fragment manually if Supabase auto-detect failed
        const hash = window.location.hash;
        if (hash && (hash.includes('access_token') || hash.includes('type=recovery'))) {
           // We're likely in the right flow, just wait for supabase listener
           // or force a refresh if needed. For now assume valid if hash is present
           setValidSession(true); 
        } else {
           setError("Invalid or expired password reset link.");
        }
      }
      setCheckingSession(false);
    };

    // Listen for auth state changes to catch the recovery event
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setValidSession(true);
        setCheckingSession(false);
        setError(null);
      }
    });

    checkSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: password });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Password Updated",
        description: "Your password has been successfully reset.",
      });

      // Redirect after a delay
      setTimeout(() => {
        navigate('/auth?mode=login');
      }, 2000);

    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reset Password - a2z Utility Hub</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              {success 
                ? "Your password has been reset successfully." 
                : "Enter your new password below."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!validSession && !success ? (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error || "The password reset link is invalid or has expired."}
                  </AlertDescription>
                </Alert>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/auth?mode=forgot-password')}
                >
                  Request New Link
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => navigate('/auth?mode=login')}
                >
                  Return to Sign In
                </Button>
              </div>
            ) : success ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <Lock className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-muted-foreground">
                  You can now sign in with your new password.
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/auth?mode=login')}
                >
                  Sign In Now
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="New password"
                    className="text-gray-900"
                  />
                  <PasswordStrengthIndicator password={password} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="text-gray-900"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                <Button 
                    type="button"
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => navigate('/auth?mode=login')}
                    disabled={loading}
                >
                  Cancel
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResetPasswordPage;