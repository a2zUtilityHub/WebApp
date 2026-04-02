import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Shield } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { adminSignIn } = useAuth();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const { error } = await adminSignIn(email, password);

        if (error) {
            toast({
                title: 'Admin Login Failed',
                description: error.message,
                variant: 'destructive',
            });
        } else {
            toast({
                title: "Login Successful",
                description: "Redirecting to admin dashboard...",
            });
            navigate('/admin/dashboard');
        }
        setLoading(false);
    };

    return (
        <>
            <Helmet>
                <title>Admin Login - A2Z Utility Hub</title>
            </Helmet>
            <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-sm">
                    <CardHeader className="text-center">
                        <Link to="/" className="mb-4 inline-block"><BrandLogo /></Link>
                        <Shield className="mx-auto h-10 w-10 text-primary" />
                        <CardTitle className="text-2xl font-bold mt-2">Admin Panel</CardTitle>
                        <CardDescription>Enter your admin credentials to continue.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                            id="email"
                            type="email"
                            placeholder="example@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link to="/admin/forgot-password" tabIndex="-1" className="ml-auto inline-block text-sm underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Sign In
                        </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default AdminLogin;