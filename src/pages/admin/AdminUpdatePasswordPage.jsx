import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Shield, AlertCircle } from 'lucide-react';

const AdminUpdatePasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { adminResetPassword } = useAuth();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await adminResetPassword(token, password);

        if (error) {
            toast({
                title: 'Password Update Failed',
                description: error.message,
                variant: 'destructive',
            });
        } else {
             toast({
                title: "Password Updated Successfully",
                description: "You can now log in with your new password.",
            });
            navigate('/admin/login');
        }
        setLoading(false);
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
                 <Card className="w-full max-w-sm">
                    <CardHeader className="text-center">
                         <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                         <CardTitle className="text-2xl font-bold mt-4">Invalid Token</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground">The password reset link is invalid or has expired. Please try again.</p>
                    </CardContent>
                 </Card>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Update Admin Password - A2Z Utility Hub</title>
            </Helmet>
            <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-sm">
                    <CardHeader className="text-center">
                        <Shield className="mx-auto h-12 w-12 text-primary" />
                        <CardTitle className="text-2xl font-bold mt-4">Set New Admin Password</CardTitle>
                        <CardDescription>Enter and confirm your new password below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                            id="new-password"
                            type="password"
                            placeholder="••••••••"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Update Password
                        </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default AdminUpdatePasswordPage;