import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Save, Loader2 } from 'lucide-react';

const SettingsNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifyOnNewTicket: true,
    notifyOnReply: true,
    notifyOnStatusChange: false,
    inAppNotifications: true,
    frequency: 'immediate'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Replaced .single() with .maybeSingle() to handle null results safely
      const { data } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'support_notifications')
        .maybeSingle();
      
      if (data && data.value) {
        setSettings(data.value);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({ 
          key: 'support_notifications', 
          value: settings,
          updated_at: new Date()
        });

      if (error) throw error;
      toast({ title: 'Notification settings saved' });
    } catch (error) {
      toast({ title: 'Error saving settings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Configure how and when the support team is notified.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
         <div className="space-y-4">
            <div className="flex items-center justify-between">
               <Label>Email on New Ticket</Label>
               <Switch checked={settings.notifyOnNewTicket} onCheckedChange={(v) => updateSetting('notifyOnNewTicket', v)} />
            </div>
            <div className="flex items-center justify-between">
               <Label>Email on New Reply</Label>
               <Switch checked={settings.notifyOnReply} onCheckedChange={(v) => updateSetting('notifyOnReply', v)} />
            </div>
            <div className="flex items-center justify-between">
               <Label>Email on Status Change</Label>
               <Switch checked={settings.notifyOnStatusChange} onCheckedChange={(v) => updateSetting('notifyOnStatusChange', v)} />
            </div>
            <div className="flex items-center justify-between">
               <Label>In-App Notifications</Label>
               <Switch checked={settings.inAppNotifications} onCheckedChange={(v) => updateSetting('inAppNotifications', v)} />
            </div>
         </div>

         <div className="space-y-2">
            <Label>Notification Frequency</Label>
            <Select value={settings.frequency} onValueChange={(v) => updateSetting('frequency', v)}>
               <SelectTrigger>
                  <SelectValue />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
               </SelectContent>
            </Select>
         </div>

         <div className="flex justify-end gap-2 pt-4">
           <Button onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Save Preferences
           </Button>
         </div>
      </CardContent>
    </Card>
  );
};

export default SettingsNotifications;