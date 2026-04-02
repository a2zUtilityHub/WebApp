import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, Edit, Trash2, Send, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
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
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const AdminLegalPage = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-legal-manager', {
        method: 'GET',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      setDocuments(data);
    } catch (error) {
      toast({ title: 'Error fetching legal documents', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [session, toast]);

  useEffect(() => {
    if (session) {
      fetchDocuments();
    }
  }, [session, fetchDocuments]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const method = editingItem.id ? 'PATCH' : 'POST';
    const endpoint = 'admin-legal-manager';
    const body = editingItem.id 
      ? { id: editingItem.id, action: 'update_content', payload: { content: editingItem.content } }
      : { doc_type: editingItem.doc_type, content: editingItem.content };

    try {
      const { error } = await supabase.functions.invoke(endpoint, {
        method,
        headers: { Authorization: `Bearer ${session.access_token}` },
        body,
      });
      if (error) throw error;
      toast({ title: 'Document saved successfully!' });
      setIsDialogOpen(false);
      setEditingItem(null);
      fetchDocuments();
    } catch (error) {
      toast({ title: 'Error saving document', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async (id) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('admin-legal-manager', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { id, action: 'publish' },
      });
      if (error) throw error;
      toast({ title: 'Document published successfully!', description: 'Users will be notified.' });
      fetchDocuments();
    } catch (error) {
      toast({ title: 'Error publishing document', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditor = (item) => {
    setEditingItem(item || { doc_type: 'terms', content: '' });
    setIsDialogOpen(true);
  };

  const docTypeMap = {
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    refund: 'Refund Policy',
    cookies: 'Cookie Policy',
    disclaimer: 'Disclaimer',
  };

  return (
    <>
      <Helmet><title>Legal Management - Admin</title></Helmet>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Legal Documents</CardTitle>
            <CardDescription>Manage your terms, privacy policy, and other legal documents.</CardDescription>
          </div>
          <Button onClick={() => openEditor(null)}><PlusCircle className="mr-2 h-4 w-4" /> New Document</Button>
        </CardHeader>
        <CardContent>
          {loading ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{docTypeMap[doc.doc_type]}</TableCell>
                    <TableCell>v{doc.version}</TableCell>
                    <TableCell>
                      <Badge variant={doc.published_at ? 'default' : 'secondary'}>
                        {doc.published_at ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(doc.created_at), 'PPp')}</TableCell>
                    <TableCell>{doc.author?.first_name || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditor(doc)} disabled={!!doc.published_at}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={!!doc.published_at || isSubmitting}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Publish</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to publish?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will make version {doc.version} of the {docTypeMap[doc.doc_type]} live and notify all users. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handlePublish(doc.id)}>Publish</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? `Edit ${docTypeMap[editingItem.doc_type]} v${editingItem.version}` : 'New Legal Document'}</DialogTitle>
            <DialogDescription>Create a new version of a legal document. You can publish it after saving.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            <div>
              <Label htmlFor="doc_type">Document Type</Label>
              <Select
                value={editingItem?.doc_type}
                onValueChange={(value) => setEditingItem({ ...editingItem, doc_type: value })}
                disabled={!!editingItem?.id}
              >
                <SelectTrigger id="doc_type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(docTypeMap).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="content">Content (HTML supported)</Label>
              <Textarea
                id="content"
                value={editingItem?.content || ''}
                onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                rows={15}
                required
                disabled={!!editingItem?.published_at}
              />
              {editingItem?.published_at && <p className="text-sm text-destructive mt-1">Published documents cannot be edited. Create a new version instead.</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting || !!editingItem?.published_at}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Draft'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminLegalPage;