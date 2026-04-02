import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';

const SettingsResponseTime = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    globalTarget: 24,
    globalSLA: 48,
    escalationTime: 72,
    priorities: [
      { name: 'Low', target: 48, sla: 72 },
      { name: 'Medium', target: 24, sla: 48 },
      { name: 'High', target: 4, sla: 12 },
      { name: 'Urgent', target: 1, sla: 4 },
    ]
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
        .eq('key', 'support_response_times')
        .maybeSingle();
      
      if (data && data.value) {
        setSettings(data.value);
      }
    } catch (error) {
      console.error('Error fetching response time settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({ 
          key: 'support_response_times', 
          value: settings,
          updated_at: new Date()
        });

      if (error) throw error;
      toast({ title: 'Response time settings saved' });
    } catch (error) {
      toast({ title: 'Error saving settings', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = (index, field, value) => {
    const newPriorities = [...settings.priorities];
    newPriorities[index] = { ...newPriorities[index], [field]: value };
    setSettings({ ...settings, priorities: newPriorities });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SLA & Response Times</CardTitle>
        <CardDescription>Define target response times for different ticket priorities.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
              <Label>Global Target Response (Hours)</Label>
              <Input 
                type="number" 
                value={settings.globalTarget}
                onChange={(e) => setSettings({...settings, globalTarget: e.target.value})}
              />
           </div>
           <div className="space-y-2">
              <Label>Global SLA Limit (Hours)</Label>
              <Input 
                type="number" 
                value={settings.globalSLA}
                onChange={(e) => setSettings({...settings, globalSLA: e.target.value})}
              />
           </div>
           <div className="space-y-2">
              <Label>Auto-Escalation Time (Hours)</Label>
              <Input 
                type="number" 
                value={settings.escalationTime}
                onChange={(e) => setSettings({...settings, escalationTime: e.target.value})}
              />
           </div>
        </div>

        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Priority Based Rules</h3>
           </div>
           <div className="border rounded-md">
              <Table>
                 <TableHeader>
                    <TableRow>
                       <TableHead>Priority Level</TableHead>
                       <TableHead>Target Response (Hrs)</TableHead>
                       <TableHead>SLA Limit (Hrs)</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {settings.priorities.map((p, index) => (
                       <TableRow key={index}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell>
                             <Input 
                               type="number" 
                               value={p.target} 
                               className="h-8 w-24" 
                               onChange={(e) => handlePriorityChange(index, 'target', e.target.value)}
                             />
                          </TableCell>
                          <TableCell>
                             <Input 
                               type="number" 
                               value={p.sla} 
                               className="h-8 w-24" 
                               onChange={(e) => handlePriorityChange(index, 'sla', e.target.value)}
                             />
                          </TableCell>
                       </TableRow>
                    ))}
                 </TableBody>
              </Table>
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

export default SettingsResponseTime;