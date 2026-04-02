import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import DataExportSection from '@/components/admin/backup/DataExportSection';
import BackupListTable from '@/components/admin/backup/BackupListTable';
import { useBackupManagement } from '@/hooks/useBackupManagement';
import { Button } from '@/components/ui/button';
import { Save, Loader2, Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminBackupPage = () => {
  const { backups, loading, error, fetchBackups, createBackup, deleteBackup, restoreBackup } = useBackupManagement();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBackupName, setNewBackupName] = useState('');
  const [newBackupDesc, setNewBackupDesc] = useState('');

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const handleCreate = async () => {
      if (!newBackupName.trim()) return;
      const result = await createBackup(newBackupName, newBackupDesc);
      if (result.success) {
          setIsCreateOpen(false);
          setNewBackupName('');
          setNewBackupDesc('');
      }
  };

  return (
    <>
      <Helmet><title>Backup & Export - Admin</title></Helmet>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h1 className="text-2xl font-bold">Backup & Disaster Recovery</h1>
                <p className="text-muted-foreground text-sm">Manage system snapshots and data exports</p>
            </div>
        </div>
        
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <DataExportSection />

        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>System Snapshots</CardTitle>
                    <CardDescription>Create and restore point-in-time snapshots of your system configuration.</CardDescription>
                </div>
                
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Save className="mr-2 h-4 w-4" />
                            Create New Snapshot
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create System Snapshot</DialogTitle>
                            <DialogDescription>
                                This will save current configurations including roles, permissions, and app settings.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Snapshot Name</Label>
                                <Input 
                                    id="name" 
                                    value={newBackupName} 
                                    onChange={(e) => setNewBackupName(e.target.value)} 
                                    placeholder="e.g., Pre-deployment Backup"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="desc">Description (Optional)</Label>
                                <Input 
                                    id="desc" 
                                    value={newBackupDesc} 
                                    onChange={(e) => setNewBackupDesc(e.target.value)} 
                                    placeholder="Brief notes about this backup"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={loading || !newBackupName.trim()}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Snapshot'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <BackupListTable 
                    backups={backups} 
                    loading={loading} 
                    onDelete={deleteBackup}
                    onRestore={restoreBackup}
                />
            </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminBackupPage;