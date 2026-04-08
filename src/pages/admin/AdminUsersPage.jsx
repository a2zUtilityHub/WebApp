import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Edit2, Trash2, Search, Filter, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const mockUsers = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Super Admin', status: 'Active', lastActive: '2 mins ago', avatar: '' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Active', lastActive: '1 hour ago', avatar: '' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'Inactive', lastActive: '2 days ago', avatar: '' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin', status: 'Active', lastActive: '5 mins ago', avatar: '' },
  { id: 5, name: 'Evan Wright', email: 'evan@example.com', role: 'User', status: 'Suspended', lastActive: '1 week ago', avatar: '' },
];

const AdminUsersPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { toast } = useToast();

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      id: editingUser ? editingUser.id : Date.now(),
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      status: formData.get('status'),
      lastActive: editingUser ? editingUser.lastActive : 'Just now',
      avatar: ''
    };

    if (editingUser) {
      setUsers(users.map(u => u.id === userData.id ? userData : u));
      toast({ title: "User updated", description: `${userData.name}'s profile has been updated.` });
    } else {
      setUsers([userData, ...users]);
      toast({ title: "User created", description: `${userData.name} has been added to the system.` });
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
    toast({ title: "User deleted", description: "The user has been removed.", variant: "destructive" });
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" /> User Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage user accounts, roles, and access permissions.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <DialogTitle className="text-lg font-semibold">{editingUser ? 'Edit User Profile' : 'Create New User'}</DialogTitle>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-5 bg-white dark:bg-gray-950">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                  <Input id="name" name="name" defaultValue={editingUser?.name} required className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
                  <Input id="email" name="email" type="email" defaultValue={editingUser?.email} required className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white" placeholder="john@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">Role</Label>
                    <Select name="role" defaultValue={editingUser?.role || 'User'}>
                      <SelectTrigger className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                        <SelectItem value="User">Standard User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status</Label>
                    <Select name="status" defaultValue={editingUser?.status || 'Active'}>
                      <SelectTrigger className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
                <Button type="submit" className="rounded-xl bg-blue-600 text-white hover:bg-blue-700">{editingUser ? 'Save Changes' : 'Create User'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-white/20 dark:border-gray-800 shadow-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4 pt-5 px-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-950/80 text-gray-900 dark:text-white"
            />
          </div>
          <Button variant="outline" className="rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">User Profile</TableHead>
                <TableHead className="py-4 font-semibold text-gray-600 dark:text-gray-300">Role</TableHead>
                <TableHead className="py-4 font-semibold text-gray-600 dark:text-gray-300">Status</TableHead>
                <TableHead className="py-4 font-semibold text-gray-600 dark:text-gray-300">Last Active</TableHead>
                <TableHead className="px-6 py-4 text-right font-semibold text-gray-600 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-semibold">{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className={cn(
                      "rounded-lg px-2.5 py-1 font-medium border-transparent",
                      user.role === 'Super Admin' ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
                      user.role === 'Admin' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    )}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5">
                      {user.status === 'Active' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : 
                       user.status === 'Suspended' ? <ShieldAlert className="w-4 h-4 text-red-500" /> : 
                       <XCircle className="w-4 h-4 text-gray-400" />}
                      <span className={cn("text-sm font-medium", 
                        user.status === 'Active' ? 'text-emerald-700 dark:text-emerald-400' : 
                        user.status === 'Suspended' ? 'text-red-600 dark:text-red-400' : 'text-gray-500'
                      )}>
                        {user.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-500 dark:text-gray-400">{user.lastActive}</TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(user)} className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg h-8 w-8">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg h-8 w-8">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-600 dark:text-red-500 flex items-center gap-2"><ShieldAlert className="w-5 h-5"/> Confirm Deletion</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you absolutely sure you want to delete <strong>{user.name}</strong>? This action cannot be undone and will permanently remove their account and data from the system.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl border-gray-200 dark:border-gray-700">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md">
                              Yes, delete user
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                    No users found matching "{search}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Mock */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
            <span className="text-sm text-gray-500">Showing {filteredUsers.length} of {users.length} users</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled className="rounded-lg h-8 border-gray-200 dark:border-gray-700">Previous</Button>
              <Button variant="outline" size="sm" className="rounded-lg h-8 border-gray-200 dark:border-gray-700">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;