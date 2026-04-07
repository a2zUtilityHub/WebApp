import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Mail, UserPlus, Shield, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager';

export const TeamManagement = () => {
  const { toast } = useToast();
  const { pushEvent } = useGoogleTagManager();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');

  const [members, setMembers] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob Jones', email: 'bob@example.com', role: 'member' },
  ]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!email) return;
    pushEvent('team_member_invited', { role });
    toast({ title: 'Invitation Sent', description: `${email} has been invited as a ${role}.` });
    setEmail('');
  };

  const handleRemove = (id, name) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    pushEvent('team_member_removed');
    toast({ title: 'Member Removed', description: `${name} has been removed from the team.` });
  };

  const handleRoleChange = (id, newRole) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    toast({ title: 'Role Updated', description: `Member role has been changed to ${newRole}.` });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Users className="w-8 h-8 text-teal-600" />
          Team Management
        </h1>
        <p className="text-muted-foreground mt-2">Manage your team members, invite new collaborators, and assign roles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5"/> Invite Member</CardTitle>
              <CardDescription>Send an email invitation to join this workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    type="email" 
                    placeholder="Email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  <Mail className="w-4 h-4 mr-2" /> Send Invite
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5"/> Active Members</CardTitle>
              <CardDescription>People with access to your workspace and projects.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 gap-4">
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select value={member.role} onValueChange={(val) => handleRoleChange(member.id, val)}>
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleRemove(member.id, member.name)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {members.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No active members found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};