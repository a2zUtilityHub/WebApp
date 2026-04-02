import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from '@/components/ui/alert';

const ForgotPasswordForm = ({ setView }) => {
  const { sendPasswordResetEmail } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await sendPasswordResetEmail(email);
      if (error) {
        // For security reasons, don't reveal if email exists or not, but log the error if it's not a generic auth error
        console.error("Reset password error:", error);
        // Supabase might rate limit or throw specific errors we want to show
        if (error.message.includes("rate limit")) {
            throw error;
        }
      } 
      
      // Always show success message to prevent user enumeration
      setSubmitted(true);
      toast({
        title: "Reset Link Sent",
        description: "If an account exists, you will receive a password reset link shortly.",
      });
      
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
      toast({
        title: "Error",
        description: err.message || "Failed to process request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
            <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Check your email</h3>
          <p className="text-sm text-muted-foreground">
            We have sent a password reset link to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setView('login')}
        >
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="name@example.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          disabled={loading}
          autoComplete="email"
          className="text-gray-900"
        />
      </div>

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={loading} className="w-full bg-[#4fd1c5] hover:bg-[#4fd1c5]/90 text-white">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Link...
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>

      <Button 
        type="button" 
        variant="ghost" 
        className="w-full"
        onClick={() => setView('login')}
        disabled={loading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Sign In
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;