import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { useOAuthSettings } from '@/hooks/useOAuthSettings';
import GoogleLoginButton from './GoogleLoginButton';

const LoginForm = ({ onAuthSuccess, setView }) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(null); // null, 'email'
  
  const { settings, loading: settingsLoading, error: settingsError } = useOAuthSettings();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading('email');
    const { error } = await signIn(email, password);
    if (error) {
       toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login Successful!",
        description: "Welcome back!",
      });
      onAuthSuccess();
    }
    setLoading(null);
  };
  
  const handleForgotPassword = () => {
      // Use the parent's setView if available (in modal), otherwise navigate
      if (setView) {
          setView('forgot-password');
      } else {
          navigate('/auth?mode=forgot-password');
      }
  };

  const handleSignup = () => {
       if (setView) {
          setView('signup');
      } else {
          navigate('/auth?mode=signup');
      }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="example@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            disabled={!!loading}
            className="text-gray-900"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Button 
              variant="link" 
              type="button" 
              size="sm" 
              className="ml-auto h-auto p-0" 
              onClick={handleForgotPassword}
              disabled={!!loading}
            >
              Forgot your password?
            </Button>
          </div>
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            disabled={!!loading}
            className="text-gray-900"
          />
        </div>
        <Button 
          type="submit" 
          disabled={!!loading} 
          className="w-full bg-[#4fd1c5] hover:bg-[#4fd1c5]/90 text-white"
        >
          {loading === 'email' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <div className="grid gap-2">
        {settingsLoading ? (
            <div className="flex justify-center p-2">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        ) : settingsError ? (
            <div className="text-center text-sm text-red-500">
                Unable to load login options
            </div>
        ) : settings?.enabled && settings?.client_id ? (
            <GoogleLoginButton 
                clientId={settings.client_id} 
                redirectUri={settings.redirect_uri}
            />
        ) : (
            <div className="text-center text-sm text-muted-foreground italic">
                Google login is currently unavailable
            </div>
        )}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Button 
          variant="link" 
          type="button" 
          size="sm" 
          className="h-auto p-0" 
          onClick={handleSignup}
          disabled={!!loading}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;