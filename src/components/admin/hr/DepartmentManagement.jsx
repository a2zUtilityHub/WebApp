import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useHRManagement } from '@/hooks/useHRManagement';

const DepartmentManagement = () => {
  const { fetchDepartments, createDepartment, updateDepartment, deleteDepartment, loading } = useHRManagement();
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', budget: '' });
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    const data = await fetchDepartments();
    setDepartments(data || []);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateDepartment(editingId, formData);
    } else {
      await createDepartment(formData);
    }
    setIsModalOpen(false);
    loadData();
  };

  const openEdit = (dept) => {
    setEditingId(dept.id);
    setFormData({ name: dept.name, location: dept.location || '', budget: dept.budget || '' });
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({ name: '', location: '', budget: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
         <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Department</Button>
      </div>
      
      <div className="border rounded-md bg-card">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {departments.map(dept => (
                  <TableRow key={dept.id}>
                     <TableCell className="font-medium">{dept.name}</TableCell>
                     <TableCell>{dept.location || '-'}</TableCell>
                     <TableCell>{dept.budget ? `$${dept.budget}` : '-'}</TableCell>
                     <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(dept)}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={async () => { if(confirm('Delete?')) { await deleteDepartment(dept.id); loadData(); }}}><Trash2 className="h-4 w-4" /></Button>
                     </TableCell>
                  </TableRow>
               ))}
               {departments.length === 0 && !loading && <TableRow><TableCell colSpan={4} className="text-center">No departments</TableCell></TableRow>}
            </TableBody>
         </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'Create'} Department</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2"><Label>Name</Label><Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
               <div className="space-y-2"><Label>Location</Label><Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
               <div className="space-y-2"><Label>Budget</Label><Input type="number" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} /></div>
               <DialogFooter><Button type="submit">Save</Button></DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentManagement;