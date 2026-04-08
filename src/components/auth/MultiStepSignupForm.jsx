import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Mail, Smartphone, Lock, CheckCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
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

  const slideVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <div className="space-y-6 relative overflow-hidden">
      <div className="space-y-3 mb-8">
        <div className="flex justify-between text-[13px] font-bold text-muted-foreground mb-1 px-1">
            <span className="text-primary">Step {step} of 4</span>
            <span className="uppercase tracking-wider">
                {step === 1 && "Personal Info"}
                {step === 2 && "Verification"}
                {step === 3 && "Mobile"}
                {step === 4 && "Security"}
            </span>
        </div>
        <Progress value={(step / 4) * 100} className="h-2.5 bg-muted/50 [&>div]:bg-gradient-to-r [&>div]:from-primary/60 [&>div]:to-primary rounded-full shadow-inner" />
      </div>

      <AnimatePresence mode="wait">
      {/* STEP 1: Personal Info & Email */}
      {step === 1 && (
        <motion.form key="step1" variants={slideVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleSendOtp} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
                <div className="w-full">
                    <Input 
                        label="First Name *"
                        value={formData.firstName} 
                        onChange={(e) => updateFormData('firstName', e.target.value)} 
                        placeholder="e.g. John"
                        required
                    />
                </div>
                <div className="w-full">
                    <Input 
                        label="Last Name *"
                        value={formData.lastName} 
                        onChange={(e) => updateFormData('lastName', e.target.value)} 
                        placeholder="e.g. Doe"
                        required
                    />
                </div>
            </div>
            <div className="w-full">
                <Input 
                    type="email"
                    label="Email Address *"
                    value={formData.email} 
                    onChange={(e) => updateFormData('email', e.target.value)} 
                    placeholder="e.g. john@example.com"
                    required
                />
            </div>
            <div className="pt-2 space-y-3">
                <Button type="submit" className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-bold text-lg" disabled={loading}>
                    {loading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                    Send Verification Code
                </Button>
                <Button type="button" variant="ghost" className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground font-semibold" onClick={() => setView('login')}>
                    Back to Login
                </Button>
            </div>
        </motion.form>
      )}

      {/* STEP 2: OTP Verification */}
      {step === 2 && (
        <motion.form key="step2" variants={slideVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center space-y-3 mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-sm relative">
                   <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                   <Mail className="h-10 w-10 text-primary relative z-10" />
                </div>
                <h3 className="font-extrabold text-2xl text-foreground">Check your email</h3>
                <p className="text-[15px] text-muted-foreground px-4">
                    We sent a 6-digit code to <strong className="text-foreground">{formData.email}</strong>
                </p>
            </div>
            
            <div className="space-y-6">
                <OTPInput 
                    length={6}
                    onComplete={(val) => {
                        updateFormData('otp', val);
                    }}
                />
                <div className="text-center text-[14px] font-bold">
                    {otpExpiry > 0 ? (
                        <span className="text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/50">
                           Expires in <span className="text-primary ml-1">{Math.floor(otpExpiry / 60)}:{(otpExpiry % 60).toString().padStart(2, '0')}</span>
                        </span>
                    ) : (
                        <span className="text-destructive bg-destructive/10 px-4 py-2 rounded-full border border-destructive/20">Code Expired</span>
                    )}
                </div>
            </div>

            <div className="pt-4 space-y-3">
                <Button type="submit" className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-bold text-lg" disabled={loading || formData.otp.length !== 6}>
                    {loading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                    Verify Email
                </Button>
                
                <div className="flex gap-2 justify-between mt-4">
                    <Button type="button" variant="outline" className="h-12 px-5 rounded-xl border-border/50 bg-background/60 hover:bg-muted shadow-sm font-semibold" onClick={() => setStep(1)} disabled={loading}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Edit Email
                    </Button>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={handleResendOtp} 
                        disabled={!canResend || loading}
                        className="h-12 px-5 rounded-xl font-bold text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors"
                    >
                        Resend Code
                    </Button>
                </div>
            </div>
        </motion.form>
      )}

      {/* STEP 3: Mobile Number */}
      {step === 3 && (
        <motion.form key="step3" variants={slideVariants} initial="hidden" animate="visible" exit="exit" onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="space-y-6">
            <div className="text-center space-y-3 mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-sm relative">
                   <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                   <Smartphone className="h-10 w-10 text-primary relative z-10" />
                </div>
                <h3 className="font-extrabold text-2xl text-foreground">Add Mobile Number</h3>
                <p className="text-[15px] text-muted-foreground px-4">
                    Secure your account with 2FA in the future.
                </p>
            </div>

            <div className="space-y-3 p-1">
                <MobileNumberInput 
                    value={formData.mobile}
                    onChange={(val) => updateFormData('mobile', val)}
                    onValidityChange={() => {}} 
                />
                <p className="text-[13px] font-medium text-muted-foreground/80 flex items-center gap-1.5 justify-center mt-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    We won't share your number with anyone.
                </p>
            </div>

            <div className="pt-4 space-y-3">
                <Button type="submit" className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-bold text-lg" disabled={!formData.mobile}>
                    Continue Securely
                </Button>
                <Button type="button" variant="ghost" className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground font-semibold" onClick={() => setStep(2)}>
                    Go Back
                </Button>
            </div>
        </motion.form>
      )}

      {/* STEP 4: Password */}
      {step === 4 && (
        <motion.form key="step4" variants={slideVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleFinalSignup} className="space-y-6">
             <div className="text-center space-y-3 mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-sm relative">
                   <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                   <Lock className="h-10 w-10 text-primary relative z-10" />
                </div>
                <h3 className="font-extrabold text-2xl text-foreground">Create Password</h3>
                <p className="text-[15px] text-muted-foreground px-4">
                    Protect your account with a strong password.
                </p>
            </div>

            <div className="space-y-5">
                <div className="w-full">
                    <Input 
                        type="password"
                        label="Master Password *"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        required
                    />
                    <div className="px-1 mt-2">
                        <PasswordStrengthIndicator password={formData.password} />
                    </div>
                </div>

                <div className="w-full">
                    <Input 
                        type="password"
                        label="Confirm Password *"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="pt-6 space-y-3 border-t border-border/50">
                <Button type="submit" className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-bold text-xl" disabled={loading}>
                    {loading && <Loader2 className="mr-3 h-6 w-6 animate-spin" />}
                    Complete Account Creation
                </Button>
                <Button type="button" variant="ghost" className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground font-semibold" onClick={() => setStep(3)}>
                    Go Back
                </Button>
            </div>
        </motion.form>
      )}
      </AnimatePresence>
    </div>
  );
};

export default MultiStepSignupForm;