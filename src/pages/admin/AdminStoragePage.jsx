import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Folder, File as FileIcon, Upload, Trash2, Copy } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog"

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const AdminStoragePage = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('storage-manager', {
        method: 'GET',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      setFiles(data);
    } catch (error) {
      toast({ title: 'Error fetching files', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [session, toast]);

  useEffect(() => {
    if (session) {
      fetchFiles();
    }
  }, [session, fetchFiles]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { error } = await supabase.functions.invoke('storage-manager', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });
      if (error) throw error;
      toast({ title: 'File uploaded successfully' });
      fetchFiles();
    } catch (error) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      // Reset file input
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (fileName) => {
    try {
      const { error } = await supabase.functions.invoke('storage-manager', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: [fileName] }),
      });
      if (error) throw error;
      toast({ title: 'File deleted' });
      fetchFiles();
    } catch (error) {
      toast({ title: 'Deletion failed', description: error.message, variant: 'destructive' });
    }
  };

  const copyUrl = (fileName) => {
    const { data: { publicUrl } } = supabase.storage.from('public_uploads').getPublicUrl(fileName);
    navigator.clipboard.writeText(publicUrl);
    toast({ title: 'URL copied to clipboard!' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Storage Management - Admin</title>
      </Helmet>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>File Storage</CardTitle>
            <CardDescription>Manage your application's uploaded files.</CardDescription>
          </div>
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Upload File
          </Button>
          <Input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.filter(f => f.id !== null).map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileIcon className="h-4 w-4" /> {file.name}
                  </TableCell>
                  <TableCell>{formatBytes(file.metadata.size)}</TableCell>
                  <TableCell>{new Date(file.updated_at).toLocaleString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => copyUrl(file.name)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the file "{file.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(file.name)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {files.filter(f => f.id !== null).length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No files uploaded yet.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AdminStoragePage;