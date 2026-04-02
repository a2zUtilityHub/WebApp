import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, RotateCcw, Loader2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
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

const BackupListTable = ({ backups, loading, onDelete, onRestore }) => {
  const [actionItem, setActionItem] = useState(null); // { type: 'delete' | 'restore', id: string }
  const [processingId, setProcessingId] = useState(null);

  const handleConfirm = async () => {
      if (!actionItem) return;
      setProcessingId(actionItem.id);
      
      try {
          if (actionItem.type === 'delete') {
              await onDelete(actionItem.id);
          } else if (actionItem.type === 'restore') {
              await onRestore(actionItem.id);
          }
      } finally {
          setProcessingId(null);
          setActionItem(null);
      }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Backup Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && backups.length === 0 ? (
             <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </TableCell>
             </TableRow>
          ) : backups.length === 0 ? (
             <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground">No backups found.</TableCell></TableRow>
          ) : (
             backups.map((backup) => (
                <TableRow key={backup.id}>
                    <TableCell>
                        <div className="font-medium">{backup.name}</div>
                        <div className="text-xs text-muted-foreground">{backup.description}</div>
                    </TableCell>
                    <TableCell>{format(new Date(backup.created_at), 'PPP p')}</TableCell>
                    <TableCell className="font-mono text-sm">{backup.size || 'N/A'}</TableCell>
                    <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {backup.status || 'Completed'}
                        </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setActionItem({ type: 'restore', id: backup.id })}
                            disabled={processingId === backup.id}
                        >
                            {processingId === backup.id && actionItem?.type === 'restore' ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <RotateCcw className="h-3 w-3 mr-1" />
                            )}
                            Restore
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            onClick={() => setActionItem({ type: 'delete', id: backup.id })}
                            disabled={processingId === backup.id}
                        >
                            {processingId === backup.id && actionItem?.type === 'delete' ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                        </Button>
                    </TableCell>
                </TableRow>
             ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!actionItem} onOpenChange={(open) => !open && setActionItem(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                    {actionItem?.type === 'delete' ? <Trash2 className="h-5 w-5 text-destructive" /> : <RotateCcw className="h-5 w-5 text-orange-500" />}
                    {actionItem?.type === 'delete' ? 'Delete Backup' : 'Restore System'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                    {actionItem?.type === 'delete' 
                        ? "Are you sure you want to permanently delete this backup? This action cannot be undone." 
                        : "Are you sure you want to restore the system to this state? Current data might be overwritten. (Simulation Only)"
                    }
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                    onClick={(e) => { e.preventDefault(); handleConfirm(); }}
                    className={actionItem?.type === 'delete' ? "bg-destructive hover:bg-destructive/90" : ""}
                >
                    {actionItem?.type === 'delete' ? 'Delete' : 'Restore'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BackupListTable;