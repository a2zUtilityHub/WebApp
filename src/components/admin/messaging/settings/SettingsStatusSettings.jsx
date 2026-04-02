import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Save, Loader2, GripVertical } from 'lucide-react';

const SettingsStatusSettings = () => {
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([
    { id: 'open', name: 'Open', color: '#ef4444', order: 1 },
    { id: 'in_progress', name: 'In Progress', color: '#eab308', order: 2 },
    { id: 'resolved', name: 'Resolved', color: '#22c55e', order: 3 },
    { id: 'closed', name: 'Closed', color: '#64748b', order: 4 },
  ]);
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
        .eq('key', 'support_statuses')
        .maybeSingle();
      
      if (data && data.value) {
        setStatuses(data.value);
      }
    } catch (error) {
       // Silent error or fallback
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({ 
          key: 'support_statuses', 
          value: statuses,
          updated_at: new Date()
        });

      if (error) throw error;
      toast({ title: 'Status settings saved' });
    } catch (error) {
      toast({ title: 'Error saving settings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (index, field, value) => {
    const newItems = [...statuses];
    newItems[index] = { ...newItems[index], [field]: value };
    setStatuses(newItems);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Statuses</CardTitle>
        <CardDescription>Manage workflow statuses for support tickets.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Table>
           <TableHeader>
              <TableRow>
                 <TableHead className="w-[50px]"></TableHead>
                 <TableHead>ID</TableHead>
                 <TableHead>Display Name</TableHead>
                 <TableHead>Color</TableHead>
              </TableRow>
           </TableHeader>
           <TableBody>
              {statuses.map((p, index) => (
                 <TableRow key={index}>
                    <TableCell><GripVertical className="h-4 w-4 text-muted-foreground cursor-move" /></TableCell>
                    <TableCell className="font-mono text-xs">{p.id}</TableCell>
                    <TableCell>
                       <Input 
                          value={p.name} 
                          onChange={(e) => updateStatus(index, 'name', e.target.value)} 
                       />
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <Input 
                             type="color" 
                             value={p.color} 
                             className="w-12 h-8 p-1 cursor-pointer"
                             onChange={(e) => updateStatus(index, 'color', e.target.value)}
                          />
                          <span className="text-xs text-muted-foreground">{p.color}</span>
                       </div>
                    </TableCell>
                 </TableRow>
              ))}
           </TableBody>
        </Table>

        <div className="flex justify-end gap-2">
           <Button variant="outline" onClick={fetchSettings}>Reset</Button>
           <Button onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Save Changes
           </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsStatusSettings;