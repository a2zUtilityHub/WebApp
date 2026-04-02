import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminForgotPasswordPage = () => {
    const { sendPasswordResetEmail } = useAuth();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await sendPasswordResetEmail(email, true);
        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Password Reset Email Sent",
                description: "Please check your inbox for instructions to reset your password.",
            });
        }
        setLoading(false);
    };

    return (
        <>
            <Helmet>
                <title>Forgot Admin Password - A2Z Utility Hub</title>
            </Helmet>
            <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-sm">
                    <CardHeader className="text-center">
                        <Shield className="mx-auto h-12 w-12 text-primary" />
                        <CardTitle className="text-2xl font-bold mt-4">Forgot Admin Password</CardTitle>
                        <CardDescription>Enter your email below to receive a password reset link.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                            id="email"
                            type="email"
                            placeholder="admin@a2z.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Send Reset Link
                        </Button>
                         <Button variant="link" className="w-full" asChild>
                            <Link to="/admin/login">Back to Login</Link>
                        </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default AdminForgotPasswordPage;