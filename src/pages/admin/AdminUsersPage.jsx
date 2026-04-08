import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Plus, Edit2, Trash2, Search, Database, RotateCcw, AlertCircle, Trash, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

import { adminUserService } from '@/services/adminUserService';
import { useAuth } from '@/contexts/SupabaseAuthContext'; 

const mockUsersFallback = [
  { name: 'Demo Admin', email: 'admin@demo.com', role: 'admin', status: 'active', is_mock: true },
  { name: 'Demo Editor', email: 'editor@demo.com', role: 'editor', status: 'active', is_mock: true },
];

const AdminUsersPage = () => {
  const { user, profile } = useAuth(); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbHasRealData, setDbHasRealData] = useState(false);
  const [dbHasMockData, setDbHasMockData] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  // Robust Super Admin Check
  const isSuperAdmin = [user?.role, profile?.role, user?.user_metadata?.role]
    .some(r => String(r).toLowerCase().replace('_', ' ') === 'super admin');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await adminUserService.getAllAdminUsers();
      if (error) throw error;
      
      if (data && data.length > 0) {
        setUsers(data.map(u => ({
          ...u,
          name: u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim(),
        })));
        setDbHasRealData(data.some(u => !u.is_mock));
        setDbHasMockData(data.some(u => u.is_mock));
      } else {
        setUsers(mockUsersFallback);
        setDbHasRealData(false); setDbHasMockData(false);
      }
    } catch (err) {
      setUsers(mockUsersFallback);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAction = async (actionFn, successMsg) => {
    setIsActionLoading(true);
    try {
      const { error } = await actionFn();
      if (error) throw error;
      toast({ title: "Success", description: successMsg });
      await fetchUsers();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setIsActionLoading(false); }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    await handleAction(() => adminUserService.createUser(data), "User added to database");
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full p-[10px] space-y-[10px] animate-in fade-in duration-500">
      
      {/* 🚩 RED BANNER: Database Empty */}
      {!dbHasRealData && !dbHasMockData && !loading && (
        <Alert variant="destructive" className="bg-red-50 border-red-500 text-red-900 rounded-xl p-[10px] flex items-center justify-between border-2 shadow-lg">
          <div className="flex items-center gap-[10px]">
            <AlertCircle className="h-6 w-6 text-red-600 animate-pulse" />
            <AlertDescription className="font-bold uppercase text-sm">Database is Empty</AlertDescription>
          </div>
          <Button size="sm" variant="destructive" onClick={() => handleAction(() => adminUserService.seedUsers(mockUsersFallback), "Live Database seeded.")} className="font-bold">Seed Database</Button>
        </Alert>
      )}

      {/* HEADER: Logic-aware Buttons */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-[10px] bg-card p-[10px] rounded-xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-[10px]">
          <div className="p-2 bg-primary/10 rounded-lg"><Users className="w-6 h-6 text-primary" /></div>
          <div>
            <h1 className="text-xl font-bold">User Management</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Mode: {dbHasRealData || dbHasMockData ? 'Live_Production' : 'Demo_Fallback'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-[10px] w-full xl:w-auto">
          {/* Seed/Remove Toggle Button */}
          <Button 
            variant="outline" size="sm" 
            onClick={() => dbHasMockData ? handleAction(adminUserService.removeMockUsers, "Mock data removed.") : handleAction(() => adminUserService.seedUsers(mockUsersFallback), "Mock data seeded.")}
            disabled={isActionLoading}
            className={cn("flex-1 xl:flex-none h-9 border-dashed font-bold", dbHasMockData ? "border-red-500 text-red-600" : "border-primary text-primary")}
          >
            {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : (dbHasMockData ? <Trash className="w-4 h-4 mr-2" /> : <Database className="w-4 h-4 mr-2" />)}
            {dbHasMockData ? 'Remove Mock Data' : 'Seed Mock Data'}
          </Button>

          {/* Reset Button: Super Admin Only */}
          {isSuperAdmin && (
            <Button variant="outline" size="sm" onClick={() => handleAction(adminUserService.resetAllUsers, "Database cleared.")} className="flex-1 xl:flex-none h-9 border-red-200 text-red-500 hover:bg-red-600 hover:text-white font-bold transition-all">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset DB
            </Button>
          )}

          <Button onClick={() => setIsModalOpen(true)} className="flex-1 xl:flex-none h-9 bg-primary shadow-md font-bold px-4">
            <Plus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Card className="border-border/50 shadow-sm bg-card/40 backdrop-blur-md overflow-hidden rounded-xl">
        <CardHeader className="p-[10px] border-b border-border/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search records..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 bg-background/50 border-border/40" />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="border-border/50">
                <TableHead className="px-[10px] py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">User Details</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Role</TableHead>
                <TableHead className="px-[10px] py-3 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <TableRow key={i}><TableCell colSpan={3} className="p-4"><Skeleton className="h-10 w-full rounded-lg" /></TableCell></TableRow>)
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id || user.email} className={cn("hover:bg-muted/20 border-border/40 group transition-colors", user.is_mock && "bg-amber-50/20")}>
                    <TableCell className="px-[10px] py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border/50"><AvatarFallback>{user.name?.[0]}</AvatarFallback></Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold truncate flex items-center gap-2">{user.name} {user.is_mock && <Badge variant="outline" className="text-[8px] h-4 border-amber-200 text-amber-600 bg-amber-50">Demo</Badge>}</span>
                          <span className="text-[11px] text-muted-foreground truncate">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4"><Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border-transparent">{user.role}</Badge></TableCell>
                    <TableCell className="px-[10px] py-4 text-right">
                      <div className="flex items-center justify-end gap-[5px]">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Edit2 className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleAction(() => adminUserService.deleteUser(user.id), "User removed.")} className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : <TableRow><TableCell colSpan={3} className="h-64 p-0"><AdminEmptyState title="No Records Found" description="Try seeding the database." /></TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ADD USER MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 rounded-xl overflow-hidden border-border/50 shadow-2xl">
          <DialogHeader className="p-[10px] bg-muted/30 border-b border-border/50">
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveUser} className="p-[10px] space-y-[10px]">
            <div className="grid gap-[5px]">
              <Label className="text-xs font-bold uppercase text-muted-foreground ml-1">Full Name</Label>
              <Input name="name" required className="h-10 bg-background" placeholder="e.g. John Doe" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-xs font-bold uppercase text-muted-foreground ml-1">Email</Label>
              <Input name="email" type="email" required className="h-10 bg-background" placeholder="john@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-[10px]">
              <div className="grid gap-[5px]">
                <Label className="text-xs font-bold uppercase text-muted-foreground ml-1">Role</Label>
                <Select name="role" defaultValue="standard">
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="standard">Standard</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-[5px]">
                <Label className="text-xs font-bold uppercase text-muted-foreground ml-1">Status</Label>
                <Select name="status" defaultValue="active">
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-[10px] border-t border-border/50">
              <Button type="submit" disabled={isActionLoading} className="w-full h-10 shadow-md">
                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;