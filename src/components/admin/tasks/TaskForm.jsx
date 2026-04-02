import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useTaskManagement } from '@/hooks/useTaskManagement';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { Loader2 } from 'lucide-react';

const TaskForm = ({ open, onClose, initialData, onSuccess }) => {
    const { createTask, updateTask, loading } = useTaskManagement();
    const { users, fetchUsers } = useAdminUsers();
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        if (open) {
            // Only fetch users if we need assignments. 
            // For simplified version, we can keep fetching or remove it if problematic.
            // Keeping it but safely handling missing user data
            try {
                fetchUsers();
            } catch (e) { console.error("Could not fetch users", e); }
            
            if (initialData) {
                // Determine assignee from array if present
                const assigneeId = initialData.assignees && initialData.assignees.length > 0 
                    ? initialData.assignees[0].id 
                    : 'unassigned';
                
                reset({
                    title: initialData.title,
                    description: initialData.description || '',
                    status: initialData.status,
                    priority: initialData.priority,
                    assigned_to: assigneeId,
                    due_date: initialData.due_date ? initialData.due_date.split('T')[0] : '',
                });
            } else {
                reset({
                    title: '',
                    description: '',
                    status: 'pending',
                    priority: 'medium',
                    assigned_to: 'unassigned',
                    due_date: '',
                });
            }
        }
    }, [open, initialData, reset, fetchUsers]);

    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            assigned_to: data.assigned_to === 'unassigned' ? null : data.assigned_to
        };

        let result;
        if (initialData) {
            result = await updateTask(initialData.id, formattedData, initialData);
        } else {
            result = await createTask(formattedData);
        }

        if (result) {
            onSuccess?.();
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="title">Task Title <span className="text-red-500">*</span></Label>
                            <Input id="title" {...register('title', { required: true })} placeholder="e.g. Update Homepage Hero" />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select onValueChange={v => setValue('status', v)} defaultValue={initialData?.status || 'pending'}>
                                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select onValueChange={v => setValue('priority', v)} defaultValue={initialData?.priority || 'medium'}>
                                <SelectTrigger><SelectValue placeholder="Select Priority" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assignee">Assignee</Label>
                            <Select onValueChange={v => setValue('assigned_to', v)} defaultValue={initialData?.assigned_to || 'unassigned'}>
                                <SelectTrigger><SelectValue placeholder="Assign To" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                    {users?.map(u => (
                                        <SelectItem key={u.id} value={u.id}>{u.first_name} {u.last_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input type="date" id="due_date" {...register('due_date')} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register('description')} className="min-h-[100px]" placeholder="Detailed description..." />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? 'Update Task' : 'Create Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TaskForm;