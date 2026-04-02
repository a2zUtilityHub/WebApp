import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useNotificationRecipients } from '@/hooks/useNotificationRecipients';
import { Loader2 } from 'lucide-react';
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
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';

const NotificationRecipientsTable = () => {
  const { recipients, loading, deleteRecipient } = useNotificationRecipients();
  const { toast } = useToast();

  const handleDelete = async (email) => {
    const { success, error } = await deleteRecipient(email);
    if (success) {
        toast({ title: "Deleted", description: "Recipient removed successfully." });
    } else {
        toast({ title: "Error", description: error, variant: "destructive" });
    }
  };

  if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Subscriptions</TableHead>
            <TableHead>Added Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipients.length === 0 ? (
             <TableRow><TableCell colSpan={4} className="text-center h-24 text-muted-foreground">No recipients found.</TableCell></TableRow>
          ) : (
             recipients.map((recipient) => (
                <TableRow key={recipient.email}>
                <TableCell className="font-medium">{recipient.email}</TableCell>
                <TableCell>{recipient.settings.length} types</TableCell>
                <TableCell>{format(new Date(recipient.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Remove Recipient?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will unsubscribe <strong>{recipient.email}</strong> from ALL notifications.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(recipient.email)} className="bg-red-600">Remove</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
                </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotificationRecipientsTable;