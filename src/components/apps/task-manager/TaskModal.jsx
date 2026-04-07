import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Loader2, Wand2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager';

const templates = [
  { name: 'Bug Fix', title: 'Fix: ', priority: 'high', status: 'todo' },
  { name: 'Feature', title: 'Feat: ', priority: 'medium', status: 'todo' },
  { name: 'Meeting Notes', title: 'Meeting: ', priority: 'low', status: 'completed' },
];

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
  const { trackTaskCreated, pushEvent } = useGoogleTagManager();
  const [formData, setFormData] = useState({ title: '', description: '', status: 'todo', priority: 'medium', due_date: null });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      pushEvent('task_modal_opened', { is_edit: !!task });
      if (task) {
        setFormData({ 
          title: task.title || '',
          description: task.description || '',
          status: task.status || 'todo',
          priority: task.priority || 'medium',
          due_date: task.due_date ? new Date(task.due_date) : null
        });
      } else {
        setFormData({ title: '', description: '', status: 'todo', priority: 'medium', due_date: null });
      }
      setErrors({});
    } else {
      pushEvent('task_modal_closed', { is_edit: !!task });
    }
  }, [task, isOpen, pushEvent]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    
    setIsSaving(true);
    try {
      const submitData = { 
        ...(task ? { id: task.id } : {}),
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date ? formData.due_date.toISOString() : null 
      };
      
      await onSave(submitData);
      
      if (!task) {
        trackTaskCreated({
          task_title: submitData.title,
          priority: submitData.priority,
          status: submitData.status,
          project_id: submitData.project_id || 'default'
        });
      }
      onClose();
    } catch (err) {
      console.error("Error saving task in modal:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const applyTemplate = (tpl) => {
    setFormData(prev => ({ ...prev, title: tpl.title, priority: tpl.priority, status: tpl.status }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity" 
        onClick={() => !isSaving && onClose()} 
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div className="bg-background rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6 pointer-events-auto flex flex-col">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-5">
            <h2 className="text-xl font-semibold leading-none tracking-tight">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Fill in the details for your task below.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5 flex-1">
            {!task && (
              <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
                {templates.map(tpl => (
                  <Button key={tpl.name} type="button" variant="outline" size="sm" onClick={() => applyTemplate(tpl)} className="shrink-0 text-xs">
                    <Wand2 className="w-3 h-3 mr-1" /> {tpl.name}
                  </Button>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input 
                id="title" autoFocus
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className={cn(errors.title && "border-red-500")}
                placeholder="What needs to be done?"
              />
              {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={val => setFormData({...formData, status: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="completed">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={val => setFormData({...formData, priority: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.due_date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? format(formData.due_date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={formData.due_date} onSelect={date => setFormData({...formData, due_date: date})} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Add more details..."
                className="resize-none min-h-[80px]"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving} className="mt-2 sm:mt-0">Cancel</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {task ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TaskModal;