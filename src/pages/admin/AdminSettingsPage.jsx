import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const PaymentGatewaySettings = ({ gateway, settings, onInputChange, onModeChange }) => {
    const isEnabled = settings[`${gateway}_settings`]?.enabled || false;
    const mode = settings[`${gateway}_settings`]?.mode || 'test';
    
    return (
        <div className="space-y-4">
            <h4 className="text-md font-medium capitalize">{gateway}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Mode</Label>
                    <Select value={mode} onValueChange={(value) => onModeChange(gateway, value)} disabled={!isEnabled}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="test">Test</SelectItem>
                            <SelectItem value="live">Live</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`${gateway}_test_key`}>{gateway === 'razorpay' ? 'Test Key ID' : 'Test Publishable Key'}</Label>
                    <Input id={`${gateway}_test_key`} value={settings[`${gateway}_settings`]?.[gateway === 'razorpay' ? 'test_key_id' : 'test_publishable_key'] || ''} onChange={(e) => onInputChange(gateway, gateway === 'razorpay' ? 'test_key_id' : 'test_publishable_key', e.target.value)} disabled={!isEnabled}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${gateway}_test_secret`}>{gateway === 'razorpay' ? 'Test Key Secret' : 'Test Secret Key'}</Label>
                    <Input id={`${gateway}_test_secret`} type="password" value={settings[`${gateway}_settings`]?.[gateway === 'razorpay' ? 'test_key_secret' : 'test_secret_key'] || ''} onChange={(e) => onInputChange(gateway, gateway === 'razorpay' ? 'test_key_secret' : 'test_secret_key', e.target.value)} disabled={!isEnabled}/>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`${gateway}_live_key`}>{gateway === 'razorpay' ? 'Live Key ID' : 'Live Publishable Key'}</Label>
                    <Input id={`${gateway}_live_key`} value={settings[`${gateway}_settings`]?.[gateway === 'razorpay' ? 'live_key_id' : 'live_publishable_key'] || ''} onChange={(e) => onInputChange(gateway, gateway === 'razorpay' ? 'live_key_id' : 'live_publishable_key', e.target.value)} disabled={!isEnabled}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${gateway}_live_secret`}>{gateway === 'razorpay' ? 'Live Key Secret' : 'Live Secret Key'}</Label>
                    <Input id={`${gateway}_live_secret`} type="password" value={settings[`${gateway}_settings`]?.[gateway === 'razorpay' ? 'live_key_secret' : 'live_secret_key'] || ''} onChange={(e) => onInputChange(gateway, gateway === 'razorpay' ? 'live_key_secret' : 'live_secret_key', e.target.value)} disabled={!isEnabled}/>
                </div>
            </div>
        </div>
    );
};

const AdminSettingsPage = () => {
  const { session, hasPermission } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('system_settings').select('key, value');
      if (error) throw error;
      
      const settingsMap = data.reduce((acc, setting) => {
        acc[setting.key] = setting.value.value;
        return acc;
      }, {});
      setSettings(settingsMap);

    } catch (error) {
      toast({ title: 'Error fetching settings', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (session) {
      fetchSettings();
    }
  }, [session, fetchSettings]);

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleGatewayInputChange = (gateway, field, value) => {
      setSettings(prev => ({
          ...prev,
          [`${gateway}_settings`]: {
              ...prev[`${gateway}_settings`],
              [field]: value
          }
      }));
  };
  
  const handleGatewayModeChange = (gateway, mode) => {
      handleGatewayInputChange(gateway, 'mode', mode);
  };
  
  const handleActiveGatewayChange = (gateway) => {
    setSettings(prev => {
        const newSettings = {...prev};
        newSettings.payment_gateway_active = gateway;
        ['stripe', 'razorpay', 'paypal'].forEach(g => {
            if (!newSettings[`${g}_settings`]) newSettings[`${g}_settings`] = {};
            newSettings[`${g}_settings`].enabled = (g === gateway);
        });
        return newSettings;
    });
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => {
        return supabase.from('system_settings').upsert({ key, value: { value } }, { onConflict: 'key' });
      });
      
      const results = await Promise.all(updates);
      results.forEach(res => {
        if (res.error) throw res.error;
      });

      toast({ title: 'Settings saved successfully!' });
      fetchSettings();
    } catch (error) {
      toast({ title: 'Error saving settings', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  const paymentGatewaysAllowed = hasPermission('manage:payment_gateways');

  return (
    <>
      <Helmet><title>System Settings - Admin</title></Helmet>
      <div className="space-y-6">
        <Tabs defaultValue="general">
            <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="pagination">Pagination</TabsTrigger>
                {paymentGatewaysAllowed && <TabsTrigger value="payment">Payment Gateways</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="general" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Manage general site settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="maintenance_mode" className="font-medium">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">Temporarily make the public site unavailable.</p>
                      </div>
                      <Switch
                        id="maintenance_mode"
                        checked={settings.maintenance_mode || false}
                        onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="pagination" className="mt-4">
                 <Card>
                  <CardHeader>
                    <CardTitle>Pagination Settings</CardTitle>
                    <CardDescription>Control how many items appear per page across the site.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="apps_per_page">Apps per Page (Apps Page)</Label>
                        <Input
                          id="apps_per_page"
                          type="number"
                          min="1"
                          value={settings.apps_per_page || ''}
                          placeholder="e.g., 16"
                          onChange={(e) => handleInputChange('apps_per_page', parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="home_apps_per_page">Featured Apps per Page (Home)</Label>
                        <Input
                          id="home_apps_per_page"
                          type="number"
                          min="1"
                          value={settings.home_apps_per_page || ''}
                          placeholder="e.g., 20"
                          onChange={(e) => handleInputChange('home_apps_per_page', parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
            </TabsContent>
            
            {paymentGatewaysAllowed && (
            <TabsContent value="payment" className="mt-4">
                 <Card>
                  <CardHeader>
                    <CardTitle>Payment Gateways</CardTitle>
                    <CardDescription>Manage donation payment gateways. Only one can be active.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label>Active Gateway</Label>
                        <Select value={settings.payment_gateway_active || 'stripe'} onValueChange={handleActiveGatewayChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="stripe">Stripe</SelectItem>
                                <SelectItem value="razorpay">Razorpay</SelectItem>
                                <SelectItem value="paypal">PayPal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <PaymentGatewaySettings gateway="stripe" settings={settings} onInputChange={handleGatewayInputChange} onModeChange={handleGatewayModeChange} />
                    <PaymentGatewaySettings gateway="razorpay" settings={settings} onInputChange={handleGatewayInputChange} onModeChange={handleGatewayModeChange} />
                    <PaymentGatewaySettings gateway="paypal" settings={settings} onInputChange={handleGatewayInputChange} onModeChange={handleGatewayModeChange} />
                  </CardContent>
                </Card>
            </TabsContent>
            )}
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={isSubmitting || loading}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save All Settings
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSettingsPage;