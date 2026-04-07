import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Calendar, Github, Mail, Users, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager';

const INTEGRATIONS = [
  { id: 'slack', name: 'Slack', icon: MessageSquare, desc: 'Receive task updates and notifications directly in your Slack channels.', connected: true },
  { id: 'gcal', name: 'Google Calendar', icon: Calendar, desc: 'Sync due dates and project milestones with your Google Calendar.', connected: false },
  { id: 'github', name: 'GitHub', icon: Github, desc: 'Link commits and pull requests to tasks automatically.', connected: false },
  { id: 'email', name: 'Email Notifications', icon: Mail, desc: 'Configure customized daily digests and instant email alerts.', connected: true },
  { id: 'teams', name: 'Microsoft Teams', icon: Users, desc: 'Collaborate on tasks within Microsoft Teams channels.', connected: false },
  { id: 'zapier', name: 'Zapier', icon: Zap, desc: 'Connect Task Manager with 5000+ other apps via Zapier.', connected: false },
];

export const IntegrationsPage = () => {
  const { toast } = useToast();
  const { trackIntegrationConnected, pushEvent } = useGoogleTagManager();
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

  const toggleConnection = (id, currentStatus) => {
    const integration = integrations.find(i => i.id === id);
    if (!currentStatus) {
      trackIntegrationConnected({ integration_name: integration.name });
    } else {
      pushEvent('integration_disconnected', { integration_name: integration.name });
    }
    toast({ 
      title: currentStatus ? "Integration Disconnected" : "Integration Connected", 
      description: `Successfully updated status for integration.` 
    });
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: !currentStatus } : i));
  };

  const handleSaveSettings = () => {
    toast({ title: "Settings Saved", description: "Integration preferences have been updated successfully." });
  };

  const renderSettingsModal = (integration) => {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure {integration.name}</DialogTitle>
          <DialogDescription>
            Manage settings and notification preferences for this integration.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {integration.id === 'slack' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="workspace">Workspace</Label>
                <Input id="workspace" defaultValue="acme-corp" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="channel">Default Channel</Label>
                <Input id="channel" defaultValue="#task-updates" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-assign">Notify on Assignment</Label>
                <Switch id="notify-assign" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-complete">Notify on Completion</Label>
                <Switch id="notify-complete" defaultChecked />
              </div>
            </>
          )}
          {integration.id !== 'slack' && (
             <div className="text-sm text-muted-foreground text-center py-6">
                Configuration settings for {integration.name} will appear here. <br/>
                🚧 This form is a placeholder. 🚀
             </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}))}>Cancel</Button>
          <Button type="submit" onClick={handleSaveSettings}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Integrations</h1>
        <p className="text-muted-foreground mt-2">Connect your favorite tools to streamline your workflow and automate tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card key={integration.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-lg ${integration.connected ? 'bg-teal-500/10 text-teal-600' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant={integration.connected ? "default" : "secondary"} className={integration.connected ? "bg-teal-500" : ""}>
                    {integration.connected ? (
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Connected</span>
                    ) : (
                      <span className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Disconnected</span>
                    )}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{integration.name}</CardTitle>
                <CardDescription className="min-h-[40px]">{integration.desc}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-6 gap-2">
                {integration.connected ? (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">Configure</Button>
                      </DialogTrigger>
                      {renderSettingsModal(integration)}
                    </Dialog>
                    <Button variant="destructive" className="w-full" onClick={() => toggleConnection(integration.id, true)}>Disconnect</Button>
                  </>
                ) : (
                  <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => toggleConnection(integration.id, false)}>Connect</Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};