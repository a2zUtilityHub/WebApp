import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOAuthSettings } from '@/hooks/useOAuthSettings';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Helmet } from 'react-helmet';

const AdminOAuthSettingsPage = () => {
  const { settings, loading: initialLoading, refetch } = useOAuthSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState(null);
  const { toast } = useToast();
  
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();

  // Load initial data
  useEffect(() => {
    // Manually fetch admin data since useOAuthSettings defaults to public view
    const loadAdminData = async () => {
        try {
            const { data, error } = await supabase.functions.invoke('oauth-settings-manager', { method: 'GET' });
            if (error) throw error;
            reset({
                client_id: data.client_id,
                redirect_uri: data.redirect_uri,
                is_enabled: data.is_enabled,
                client_secret: '' // Secret is never returned
            });
        } catch (e) {
            console.error(e);
            toast({ title: "Error", description: "Failed to load settings", variant: "destructive" });
        }
    };
    loadAdminData();
  }, [reset, toast]);

  const onPreSubmit = (data) => {
    setFormData(data);
    setShowConfirm(true);
  };

  const onConfirmSave = async () => {
    setShowConfirm(false);
    setSaving(true);
    try {
      const { error } = await supabase.functions.invoke('oauth-settings-manager', {
        method: 'POST',
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "OAuth configuration has been updated successfully.",
      });
      setIsEditing(false);
      refetch(true); // Refresh
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error.message || "Could not update settings.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>OAuth Settings - Admin - a2z Utility Hub</title>
      </Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">OAuth Settings</h2>
          <p className="text-muted-foreground">Manage Google Login configuration.</p>
        </div>
        {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Settings</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Google Provider Configuration</CardTitle>
          <CardDescription>
            Configure your Google Cloud Platform credentials here.
            Changes will affect all users immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onPreSubmit)} className="space-y-4">
            
            <div className="grid gap-2">
              <Label htmlFor="client_id">Client ID</Label>
              <Input 
                id="client_id" 
                {...register('client_id', { required: 'Client ID is required' })} 
                disabled={!isEditing}
                placeholder="Google Client ID"
              />
              {errors.client_id && <p className="text-red-500 text-sm">{errors.client_id.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="client_secret">Client Secret</Label>
              <div className="relative">
                <Input 
                    id="client_secret" 
                    type={showSecret ? "text" : "password"}
                    {...register('client_secret', { 
                        required: isEditing && !settings?.client_id ? 'Secret required for new config' : false 
                    })} 
                    disabled={!isEditing}
                    placeholder={isEditing ? "Enter new secret to update..." : "••••••••••••••••••••••••"}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowSecret(!showSecret)}
                    disabled={!isEditing}
                >
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {isEditing ? "Leave blank to keep existing secret." : "Secret is hidden for security."}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="redirect_uri">Redirect URI</Label>
              <Input 
                id="redirect_uri" 
                {...register('redirect_uri', { 
                    required: 'Redirect URI is required',
                    pattern: {
                        value: /^https?:\/\/.+/,
                        message: "Must be a valid URL starting with http:// or https://"
                    }
                })} 
                disabled={!isEditing}
                placeholder="https://your-domain.com/auth/google/callback"
              />
              {errors.redirect_uri && <p className="text-red-500 text-sm">{errors.redirect_uri.message}</p>}
            </div>

            <div className="flex items-center space-x-2 py-2">
                <Switch 
                    id="is_enabled" 
                    disabled={!isEditing} 
                    onCheckedChange={(checked) => setValue('is_enabled', checked)}
                    defaultChecked={settings?.is_enabled ?? true}
                />
                <Label htmlFor="is_enabled">Enable Google Login</Label>
            </div>

            {isEditing && (
                <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setIsEditing(false); reset(); }}>
                        Cancel
                    </Button>
                </div>
            )}
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Confirm Changes
                </AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure you want to update OAuth settings? This will immediately affect all users' ability to log in with Google.
                    Ensure the Redirect URI matches your Google Cloud Console configuration exactly.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirmSave}>Yes, Update Settings</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminOAuthSettingsPage;