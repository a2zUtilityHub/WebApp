import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save } from 'lucide-react';

const SettingsPage = () => {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12 w-full relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <Helmet>
          <title>Settings | a2z Utility Hub</title>
        </Helmet>

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-8">Account Settings</h1>

        <div className="space-y-8">
          <Card className="border border-border/50 bg-background/60 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-primary/40 to-primary"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Notifications</CardTitle>
              <CardDescription className="text-[15px]">Manage how you receive alerts and updates.</CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive daily summaries and important updates.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Promotional Emails</Label>
                <p className="text-sm text-muted-foreground">Receive offers, coupons, and product news.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-background/60 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/50 bg-muted/10">
              <CardTitle className="text-2xl">Privacy & Security</CardTitle>
              <CardDescription className="text-[15px]">Manage your privacy preferences.</CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Public Profile</Label>
                <p className="text-sm text-muted-foreground">Allow other users to see your basic profile information.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
              </div>
              <Button variant="outline" size="sm">Enable 2FA</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} className="h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <Save className="h-5 w-5 mr-2" /> Save Preferences
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SettingsPage;