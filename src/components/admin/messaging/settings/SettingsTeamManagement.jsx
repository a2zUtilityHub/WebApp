import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const SettingsTeamManagement = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      // Assuming 'Support Agent' or 'Admin' or 'Super Admin' can handle tickets
      // First get roles
      const { data: roles } = await supabase.from('roles').select('id, name').in('name', ['Support Agent', 'Admin', 'Super Admin']);
      if (!roles) return;
      
      const roleIds = roles.map(r => r.id);
      
      // Fetch profiles with these roles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*, roles(name)')
        .in('role_id', roleIds);

      if (error) throw error;
      setAgents(profiles || []);

    } catch (error) {
       console.error(error);
       toast({ title: 'Error loading team', variant: 'destructive' });
    } finally {
       setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Team</CardTitle>
        <CardDescription>View team members who have access to support tickets.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
           <TableHeader>
              <TableRow>
                 <TableHead>Agent</TableHead>
                 <TableHead>Role</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead>Email</TableHead>
              </TableRow>
           </TableHeader>
           <TableBody>
              {loading ? (
                 <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
              ) : agents.map((agent) => (
                 <TableRow key={agent.id}>
                    <TableCell className="flex items-center gap-2">
                       <Avatar className="h-8 w-8">
                          <AvatarImage src={agent.avatar_url} />
                          <AvatarFallback>{agent.first_name?.[0]}</AvatarFallback>
                       </Avatar>
                       <span className="font-medium">{agent.first_name} {agent.last_name}</span>
                    </TableCell>
                    <TableCell>
                       <Badge variant="outline">{agent.roles?.name || 'Agent'}</Badge>
                    </TableCell>
                    <TableCell>
                       <Badge variant={agent.is_active ? "success" : "secondary"} className={agent.is_active ? "bg-green-100 text-green-800" : ""}>
                          {agent.is_active ? 'Active' : 'Inactive'}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{agent.email}</TableCell>
                 </TableRow>
              ))}
              {!loading && agents.length === 0 && (
                 <TableRow><TableCell colSpan={4} className="text-center py-4">No support agents found.</TableCell></TableRow>
              )}
           </TableBody>
        </Table>
        <div className="mt-4 text-xs text-muted-foreground">
           To add more agents, please go to User Management and assign the "Support Agent" role to users.
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsTeamManagement;