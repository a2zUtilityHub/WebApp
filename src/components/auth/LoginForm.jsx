
import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';

const LoginForm = ({ onAuthSuccess, setView }) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(null);

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
      onAuthSuccess?.();
    }
    setLoading(null);
  };
  
  const handleForgotPassword = () => {
      if (setView) setView('forgot-password');
      else navigate('/auth?mode=forgot-password');
  };

  const handleSignup = () => {
       if (setView) setView('signup');
       else navigate('/auth?mode=signup');
  };

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
            className="text-foreground bg-background border-input"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Button 
              variant="link" 
              type="button" 
              size="sm" 
              className="ml-auto h-auto p-0 text-primary" 
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
            className="text-foreground bg-background border-input"
          />
        </div>
        <Button 
          type="submit" 
          disabled={!!loading} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 shadow-sm transition-all"
        >
          {loading === 'email' ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing In...</>
          ) : 'Sign In'}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="bg-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-medium">Or continue with</span>
        </div>
      </div>
      
      <div className="grid gap-2">
        <GoogleLoginButton />
      </div>
      
      <div className="text-center text-sm text-muted-foreground mt-2">
        Don't have an account?{' '}
        <Button 
          variant="link" 
          type="button" 
          size="sm" 
          className="h-auto p-0 font-semibold text-primary hover:text-primary/80" 
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
