
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings, Bell, Palette, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager';

export const ProjectSettings = () => {
  const { toast } = useToast();
  const { pushEvent } = useGoogleTagManager();

  const handleToggle = (setting) => {
    pushEvent('settings_toggled', { setting_name: setting });
    toast({ title: 'Settings Updated', description: `${setting} preferences have been saved.` });
  };

  const handleSave = () => {
    toast({ title: 'Success', description: 'All project settings have been saved.' });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Settings className="w-8 h-8 text-teal-600" />
          Project Settings
        </h1>
        <p className="text-muted-foreground mt-2">Configure your workspace, notifications, and personal preferences.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5"/> Notifications</CardTitle>
            <CardDescription>Choose what you want to be notified about.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-assign" className="flex-1">Task Assignments</Label>
              <Switch id="notif-assign" defaultChecked onCheckedChange={() => handleToggle('Task Assignments')} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-mention" className="flex-1">Mentions & Comments</Label>
              <Switch id="notif-mention" defaultChecked onCheckedChange={() => handleToggle('Mentions')} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-due" className="flex-1">Due Date Reminders</Label>
              <Switch id="notif-due" defaultChecked onCheckedChange={() => handleToggle('Due Dates')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5"/> Appearance</CardTitle>
            <CardDescription>Customize the look and feel of your workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-compact" className="flex-1">Compact Mode</Label>
              <Switch id="theme-compact" onCheckedChange={() => handleToggle('Compact Mode')} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-animations" className="flex-1">Reduce Animations</Label>
              <Switch id="theme-animations" onCheckedChange={() => handleToggle('Animations')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5"/> Regional</CardTitle>
            <CardDescription>Set your timezone and date format.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="format-24h" className="flex-1">Use 24-hour time format</Label>
              <Switch id="format-24h" onCheckedChange={() => handleToggle('Time Format')} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="week-start" className="flex-1">Start week on Monday</Label>
              <Switch id="week-start" defaultChecked onCheckedChange={() => handleToggle('Week Start')} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave}>Save All Changes</Button>
        </div>
      </div>
    </div>
  );
};
