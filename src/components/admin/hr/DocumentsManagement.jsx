import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useHRManagement } from '@/hooks/useHRManagement';
import { DocumentStatusBadge } from './HRBadges';
import { Loader2, Upload, Trash2, FileText } from 'lucide-react';

const DocumentsManagement = () => {
  const { fetchDocuments, uploadDocument, deleteDocument, fetchEmployees, loading } = useHRManagement();
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    document_type: 'Resume',
    document_name: '',
    file_url: '', // Simple URL input for now
    status: 'valid'
  });

  const loadData = async () => {
    const data = await fetchDocuments();
    setDocuments(data || []);
    const emps = await fetchEmployees();
    setEmployees(emps || []);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadDocument({
        ...formData, 
        upload_date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if(confirm('Delete this document?')) {
        await deleteDocument(id);
        loadData();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
         <Button onClick={() => setIsModalOpen(true)}><Upload className="mr-2 h-4 w-4" /> Upload Document</Button>
      </div>

      <div className="border rounded-md bg-card">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {documents.map(doc => {
                  const emp = employees.find(e => e.id === doc.employee_id);
                  return (
                     <TableRow key={doc.id}>
                        <TableCell>
                            <div className="font-medium">{emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown'}</div>
                        </TableCell>
                        <TableCell>{doc.document_type}</TableCell>
                        <TableCell className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {doc.document_name}
                        </TableCell>
                        <TableCell>{doc.upload_date}</TableCell>
                        <TableCell><DocumentStatusBadge status={doc.status} /></TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(doc.id)}><Trash2 className="h-4 w-4"/></Button>
                        </TableCell>
                     </TableRow>
                  );
               })}
               {documents.length === 0 && !loading && <TableRow><TableCell colSpan={6} className="text-center py-8">No documents found</TableCell></TableRow>}
            </TableBody>
         </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogContent>
            <DialogHeader><DialogTitle>Add Document Metadata</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <Label>Employee</Label>
                  <Select value={formData.employee_id} onValueChange={val => setFormData({...formData, employee_id: val})}>
                     <SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger>
                     <SelectContent>
                        {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</SelectItem>)}
                     </SelectContent>
                  </Select>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={formData.document_type} onValueChange={val => setFormData({...formData, document_type: val})}>
                         <SelectTrigger><SelectValue /></SelectTrigger>
                         <SelectContent>
                            <SelectItem value="Resume">Resume</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Offer Letter">Offer Letter</SelectItem>
                            <SelectItem value="ID Proof">ID Proof</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                         </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2"><Label>Document Name</Label><Input value={formData.document_name} onChange={e => setFormData({...formData, document_name: e.target.value})} /></div>
               </div>

               <div className="space-y-2">
                  <Label>File URL (Location)</Label>
                  <Input value={formData.file_url} onChange={e => setFormData({...formData, file_url: e.target.value})} placeholder="https://..." />
               </div>

               <DialogFooter><Button type="submit" disabled={loading}>Save</Button></DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsManagement;