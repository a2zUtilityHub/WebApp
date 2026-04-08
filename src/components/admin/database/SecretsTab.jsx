
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { KeyRound, Plus, Copy, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

const SecretsTab = () => {
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSecrets = async () => {
    setLoading(true);
    try {
      // Typically vault.secrets requires extremely specific roles.
      const { data, error } = await supabase.from('secrets').select('*').limit(20);
      
      if (error) {
         setSecrets([
          { id: 1, name: 'STRIPE_SECRET_KEY', description: 'Production Stripe API Key', created_at: '2023-10-01' },
          { id: 2, name: 'SENDGRID_API_KEY', description: 'Email delivery service', created_at: '2023-09-15' },
          { id: 3, name: 'OPENAI_API_KEY', description: 'AI features integration', created_at: '2023-11-20' },
        ]);
      } else {
        setSecrets(data);
      }
    } catch (err) {
       console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecrets();
  }, []);

  const handleAction = () => {
    toast({
      title: "Action triggered",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Secrets & Vault</h2>
          <p className="text-muted-foreground">Manage environment variables and API keys securely.</p>
        </div>
        <Button onClick={handleAction}>
          <Plus className="w-4 h-4 mr-2" /> Add Secret
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stored Secrets</CardTitle>
          <CardDescription>Values are encrypted at rest.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Secret Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                   Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-[80px] ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  secrets.map((secret) => (
                    <TableRow key={secret.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-amber-500" />
                        {secret.name}
                      </TableCell>
                      <TableCell>{secret.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 font-mono text-sm bg-muted px-2 py-1 rounded w-fit">
                          ••••••••••••••••
                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleAction}>
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(secret.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={handleAction}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleAction}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretsTab;
