
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ShieldAlert, Mail, Smartphone, Github, Chrome, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AuthenticationTab = () => {
  const { toast } = useToast();

  const handleToggle = () => {
    toast({
      title: "Settings updated",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const providers = [
    { id: 'email', name: 'Email / Password', icon: Mail, enabled: true },
    { id: 'phone', name: 'Phone (SMS)', icon: Smartphone, enabled: false },
    { id: 'google', name: 'Google OAuth', icon: Chrome, enabled: true },
    { id: 'github', name: 'GitHub OAuth', icon: Github, enabled: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Authentication Settings</h2>
        <p className="text-muted-foreground">Configure identity providers and security policies.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Auth Providers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded-md">
                    <provider.icon className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{provider.name}</p>
                    <p className="text-xs text-muted-foreground">{provider.enabled ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
                <Switch checked={provider.enabled} onCheckedChange={handleToggle} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Require strong passwords</p>
                <p className="text-xs text-muted-foreground">Enforce minimum 8 characters, numbers, and symbols.</p>
              </div>
              <Switch checked={true} onCheckedChange={handleToggle} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Enable Multi-Factor Auth (MFA)</p>
                <p className="text-xs text-muted-foreground">Allow users to set up TOTP authenticator apps.</p>
              </div>
              <Switch checked={false} onCheckedChange={handleToggle} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Confirm email signups</p>
                <p className="text-xs text-muted-foreground">Require users to verify their email address before login.</p>
              </div>
              <Switch checked={true} onCheckedChange={handleToggle} />
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={handleToggle}>
              <Settings className="w-4 h-4 mr-2" /> Advanced Auth Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthenticationTab;
