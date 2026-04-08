import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Mail, Smartphone, Lock, CheckCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import OTPInput from './OTPInput';
import MobileNumberInput from './MobileNumberInput';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const MultiStepSignupForm = ({ setView, onSignupSuccess }) => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    otp: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  
  const [otpExpiry, setOtpExpiry] = useState(0); // seconds
  const [canResend, setCanResend] = useState(true);

  // Timer for OTP
  useEffect(() => {
    let interval;
    if (otpExpiry > 0) {
      interval = setInterval(() => {
        setOtpExpiry((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpExpiry]);

  // Timer for Resend Button
  useEffect(() => {
    let interval;
    if (!canResend) {
        const timeout = setTimeout(() => setCanResend(true), 30000);
        return () => clearTimeout(timeout);
    }
  }, [canResend]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if(!formData.email || !formData.firstName || !formData.lastName) {
        toast({ title: "Validation Error", description: "Please fill in all fields.", variant: "destructive" });
        return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email: formData.email }
      });

      if (error || data?.error) throw new Error(data?.error || error?.message || "Failed to send OTP");

      toast({ title: "OTP Sent", description: "Please check your email for the verification code." });
      setStep(2);
      setOtpExpiry(300); // 5 mins
      setCanResend(false);
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if(!canResend) return;
    setLoading(true);
    try {
        const { data, error } = await supabase.functions.invoke('send-otp', {
            body: { email: formData.email }
        });
        if (error || data?.error) throw new Error(data?.error || error.message);
        
        toast({ title: "OTP Resent", description: "A new code has been sent to your email." });
        setOtpExpiry(300);
        setCanResend(false);
    } catch (err) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if(formData.otp.length !== 6) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { email: formData.email, otp_code: formData.otp }
      });

      if (error || !data.success) throw new Error(data?.message || "Verification failed");

      toast({ title: "Verified", description: "Email successfully verified!" });
      setStep(3);
    } catch (err) {
      toast({ title: "Verification Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSignup = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
        toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
        return;
    }

    setLoading(true);
    try {
        const { error } = await signUp(formData.email, formData.password, {
            first_name: formData.firstName,
            last_name: formData.lastName,
            mobile: formData.mobile,
            email_verified: true // We verified it manually via OTP
        });

        if (error) throw error;

        toast({ title: "Account Created", description: "Welcome to a2z Utility Hub!" });
        if(onSignupSuccess) onSignupSuccess();
        else setView('login');

    } catch (err) {
        toast({ title: "Signup Failed", description: err.message, variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Step {step} of 4</span>
            <span>
                {step === 1 && "Personal Info"}
                {step === 2 && "Verification"}
                {step === 3 && "Mobile"}
                {step === 4 && "Security"}
            </span>
        </div>
        <Progress value={(step / 4) * 100} className="h-2" />
      </div>

      {/* STEP 1: Personal Info & Email */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input 
                        value={formData.firstName} 
                        onChange={(e) => updateFormData('firstName', e.target.value)} 
                        placeholder="John"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input 
                        value={formData.lastName} 
                        onChange={(e) => updateFormData('lastName', e.target.value)} 
                        placeholder="Doe"
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Email Address</Label>
                <Input 
                    type="email"
                    value={formData.email} 
                    onChange={(e) => updateFormData('email', e.target.value)} 
                    placeholder="john@example.com"
                    required
                />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Verification Code
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setView('login')}>
                Back to Login
            </Button>
        </form>
      )}

      {/* STEP 2: OTP Verification */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center space-y-2">
                <Mail className="h-10 w-10 mx-auto text-primary" />
                <h3 className="font-semibold text-lg">Check your email</h3>
                <p className="text-sm text-muted-foreground">
                    We sent a 6-digit code to <strong>{formData.email}</strong>
                </p>
            </div>
            
            <div className="space-y-4">
                <OTPInput 
                    value={formData.otp} 
                    onChange={(val) => updateFormData('otp', val)}
                />
                <div className="text-center text-sm">
                    {otpExpiry > 0 ? (
                        <span className="text-muted-foreground">Expires in {Math.floor(otpExpiry / 60)}:{(otpExpiry % 60).toString().padStart(2, '0')}</span>
                    ) : (
                        <span className="text-red-500">Code Expired</span>
                    )}
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || formData.otp.length !== 6}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Email
            </Button>
            
            <div className="flex gap-2 justify-between">
                <Button type="button" variant="ghost" onClick={() => setStep(1)} disabled={loading}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Change Email
                </Button>
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={handleResendOtp} 
                    disabled={!canResend || loading}
                    className="text-primary"
                >
                    Resend Code
                </Button>
            </div>
        </form>
      )}

      {/* STEP 3: Mobile Number */}
      {step === 3 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="space-y-4">
            <div className="text-center space-y-2 mb-6">
                <Smartphone className="h-10 w-10 mx-auto text-primary" />
                <h3 className="font-semibold text-lg">Add Mobile Number</h3>
                <p className="text-sm text-muted-foreground">
                    Secure your account with 2FA in the future.
                </p>
            </div>

            <div className="space-y-2">
                <Label>Mobile Number</Label>
                <MobileNumberInput 
                    value={formData.mobile}
                    onChange={(val) => updateFormData('mobile', val)}
                    onValidityChange={() => {}} 
                />
                <p className="text-xs text-muted-foreground">We won't share your number with anyone.</p>
            </div>

            <Button type="submit" className="w-full" disabled={!formData.mobile}>
                Continue
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(2)}>
                Back
            </Button>
        </form>
      )}

      {/* STEP 4: Password */}
      {step === 4 && (
        <form onSubmit={handleFinalSignup} className="space-y-4">
             <div className="text-center space-y-2 mb-6">
                <Lock className="h-10 w-10 mx-auto text-primary" />
                <h3 className="font-semibold text-lg">Create Password</h3>
                <p className="text-sm text-muted-foreground">
                    Protect your account with a strong password.
                </p>
            </div>

            <div className="space-y-2">
                <Label>Password</Label>
                <Input 
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    required
                />
                <PasswordStrengthIndicator password={formData.password} />
            </div>

            <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input 
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    required
                />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
            </Button>
             <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(3)}>
                Back
            </Button>
        </form>
      )}
    </div>
  );
};

export default MultiStepSignupForm;