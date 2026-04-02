import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Key, Plus, Copy, Trash2, Loader2, AlertCircle } from 'lucide-react';

const ApiTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApiKeys = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('api_keys').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      setApiKeys(data);
    } catch (e) {
      setError(e.message);
      toast({ title: 'Error fetching API keys', description: e.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const generateNewKey = async () => {
    if (!newKeyName.trim()) {
      toast({ title: 'Please provide a name for the API key.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
        const { data: keyData, error: rpcError } = await supabase.rpc('generate_api_key');
        if (rpcError) throw rpcError;
        
        const { data: newKey, error: insertError } = await supabase
        .from('api_keys')
        .insert({ user_id: user.id, name: newKeyName, api_key: keyData })
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      setApiKeys([newKey, ...apiKeys]);
      setNewKeyName('');
      toast({ title: 'API Key Created!', description: 'Your new key has been created and is ready to use.' });
    } catch (e) {
      toast({ title: 'Error creating API key', description: e.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteKey = async (keyId) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from('api_keys').delete().eq('id', keyId);
      if (error) throw error;
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      toast({ title: 'API Key Deleted' });
    } catch (e) {
      toast({ title: 'Error deleting API key', description: e.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };
  
  const endpoint = `${window.location.origin}/api/edge/url-shortener`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage API Keys</CardTitle>
          <CardDescription>
            Use these keys to interact with the URL Shortener API. Keep them secret!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="New key name (e.g., 'My App')"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={generateNewKey} disabled={isLoading}>
              {isLoading && !newKeyName ? null : <Plus className="mr-2 h-4 w-4" />}
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Key"}
            </Button>
          </div>
          <div className="space-y-2">
            {isLoading && apiKeys.length === 0 ? <div className="text-center p-4"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></div> : null}
            {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
            {apiKeys.map(key => (
              <div key={key.id} className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <p className="font-semibold">{key.name}</p>
                  <p className="text-sm text-muted-foreground font-mono">{key.api_key.substring(0, 7)}...{key.api_key.substring(key.api_key.length - 4)}</p>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(key.api_key)}><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteKey(key.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Endpoint</h4>
            <pre className="p-2 mt-1 bg-muted rounded-md text-sm font-mono overflow-x-auto"><code>POST {endpoint}</code></pre>
          </div>
          <div>
            <h4 className="font-semibold">Headers</h4>
            <pre className="p-2 mt-1 bg-muted rounded-md text-sm font-mono overflow-x-auto">
              <code>{`{\n  "Authorization": "Bearer YOUR_SUPABASE_JWT",\n  "Content-Type": "application/json",\n  "x-api-key": "YOUR_A2Z_API_KEY"\n}`}</code>
            </pre>
          </div>
          <div>
            <h4 className="font-semibold">Body</h4>
            <pre className="p-2 mt-1 bg-muted rounded-md text-sm font-mono overflow-x-auto">
              <code>{`{\n  "original_url": "https://example.com/very/long/url/to/shorten",\n  "custom_slug": "my-cool-link", // Optional\n  "password": "super-secret", // Optional\n  "expires_at": "2025-12-31T23:59:59Z" // Optional\n}`}</code>
            </pre>
          </div>
          <div>
            <h4 className="font-semibold">Example cURL</h4>
            <pre className="p-2 mt-1 bg-muted rounded-md text-sm font-mono overflow-x-auto">
              <code>{`curl -X POST '${endpoint}' \\\n-H 'Authorization: Bearer YOUR_SUPABASE_JWT' \\\n-H 'Content-Type: application/json' \\\n-H 'x-api-key: YOUR_A2Z_API_KEY' \\\n-d '{"original_url": "https://example.com"}'`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTab;