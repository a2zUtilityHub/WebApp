import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save } from 'lucide-react';

const SettingsAutoReply = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    enabled: false,
    messageTemplate: 'Thank you for your message. We have received it and will get back to you shortly.',
    delayHours: 0,
    appliedCategories: []
  });
  const [categories, setCategories] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, []);

  const fetchSettings = async () => {
    try {
      // Replaced .single() with .maybeSingle() to handle null results safely
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'support_auto_reply')
        .maybeSingle();
      
      if (data && data.value) {
        setSettings(data.value);
      }
    } catch (error) {
      console.error('Error fetching auto-reply settings:', error);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('support_categories').select('id, name');
    if (data) setCategories(data);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({ 
          key: 'support_auto_reply', 
          value: settings,
          updated_at: new Date()
        });

      if (error) throw error;
      toast({ title: 'Auto-reply settings saved' });
    } catch (error) {
      toast({ title: 'Error saving settings', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (catId) => {
    setSettings(prev => {
      const current = prev.appliedCategories || [];
      if (current.includes(catId)) {
        return { ...prev, appliedCategories: current.filter(id => id !== catId) };
      }
      return { ...prev, appliedCategories: [...current, catId] };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto-Reply Configuration</CardTitle>
        <CardDescription>Configure automated responses for new tickets.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Auto-Reply</Label>
            <div className="text-sm text-muted-foreground">Automatically send a response when a new ticket is created.</div>
          </div>
          <Switch 
            checked={settings.enabled} 
            onCheckedChange={(checked) => setSettings({...settings, enabled: checked})} 
          />
        </div>

        <div className="space-y-2">
          <Label>Message Template</Label>
          <Textarea 
            value={settings.messageTemplate} 
            onChange={(e) => setSettings({...settings, messageTemplate: e.target.value})}
            placeholder="Enter your auto-reply message..."
            rows={5}
          />
          <p className="text-xs text-muted-foreground">You can use simple text formatting.</p>
        </div>

        <div className="grid gap-2">
           <Label>Delay (Hours)</Label>
           <Input 
             type="number" 
             min="0"
             value={settings.delayHours} 
             onChange={(e) => setSettings({...settings, delayHours: parseInt(e.target.value) || 0})}
             className="max-w-[150px]"
           />
           <p className="text-xs text-muted-foreground">Set to 0 for immediate response.</p>
        </div>

        <div className="space-y-3">
           <Label>Apply to Categories</Label>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map(cat => (
                 <div key={cat.id} className="flex items-center space-x-2 border p-2 rounded-md">
                    <Switch 
                       id={`cat-${cat.id}`}
                       checked={settings.appliedCategories?.includes(cat.id)}
                       onCheckedChange={() => toggleCategory(cat.id)}
                    />
                    <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer">{cat.name}</Label>
                 </div>
              ))}
           </div>
        </div>

        <div className="flex justify-end gap-2">
           <Button variant="outline" onClick={fetchSettings}>Cancel</Button>
           <Button onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Save Changes
           </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsAutoReply;