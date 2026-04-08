
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
      <form onSubmit={handleSubmit} className="grid gap-2">
        <div className="grid gap-1">
          <Input 
            id="email" 
            type="email" 
            label="Email Address"
            placeholder="name@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            disabled={!!loading}
          />
        </div>
        <div className="grid gap-1">
          <div className="flex items-center justify-end px-1 -mb-2 z-10 relative">
            <Button 
              variant="link" 
              type="button" 
              size="sm" 
              className="h-auto p-0 text-primary/80 hover:text-primary transition-colors text-[13px]" 
              onClick={handleForgotPassword}
              disabled={!!loading}
            >
              Forgot password?
            </Button>
          </div>
          <Input 
            id="password" 
            type="password" 
            label="Password"
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            disabled={!!loading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!!loading} 
          className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          {loading === 'email' ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Authenticating...</>
          ) : 'Sign In Securely'}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="bg-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent backdrop-blur-md px-3 text-muted-foreground font-semibold rounded-full">Or continue with</span>
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
