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
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-all duration-300" 
        onClick={() => !isSaving && onClose()} 
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-background/80 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl max-w-lg w-[calc(100vw-32px)] max-h-[90vh] overflow-y-auto pointer-events-auto flex flex-col relative hide-scrollbar">
          <div className="p-6 md:p-8 pb-4 bg-gradient-to-b from-muted/30 to-transparent border-b border-border/50 sticky top-0 z-10 backdrop-blur-xl">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center sm:justify-start gap-2">
                {task ? <><Wand2 className="w-5 h-5 text-primary" /> Edit Task</> : <><Wand2 className="w-5 h-5 text-primary" /> Create New Task</>}
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                {task ? 'Update the details of your task.' : 'Fill in the details to add a new task to your board.'}
              </p>
            </div>
            
            {!task && (
              <div className="flex gap-2 pt-4 overflow-x-auto hide-scrollbar">
                {templates.map(tpl => (
                  <button 
                    key={tpl.name} 
                    type="button" 
                    onClick={() => applyTemplate(tpl)} 
                    className="shrink-0 text-[13px] font-medium flex items-center bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <Wand2 className="w-3.5 h-3.5 mr-1.5" /> {tpl.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 md:p-8 pt-6 space-y-6 flex-1 flex flex-col">

            <div>
              <Input 
                id="title" autoFocus
                label="Task Title *"
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                error={errors.title}
                placeholder="What needs to be done?"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 group">
                <Label className="text-[14px] font-medium text-foreground/90 group-focus-within:text-primary transition-colors">Status</Label>
                <Select value={formData.status} onValueChange={val => setFormData({...formData, status: val})}>
                  <SelectTrigger className="h-12 rounded-xl bg-background/60 backdrop-blur-sm border-input hover:border-primary/50 transition-colors shadow-sm focus:ring-4 focus:ring-primary/10"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50 bg-background/80 backdrop-blur-xl shadow-xl">
                    <SelectItem value="todo" className="rounded-xl focus:bg-primary/10">To Do</SelectItem>
                    <SelectItem value="inprogress" className="rounded-xl focus:bg-primary/10">In Progress</SelectItem>
                    <SelectItem value="completed" className="rounded-xl focus:bg-primary/10">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5 group">
                <Label className="text-[14px] font-medium text-foreground/90 group-focus-within:text-primary transition-colors">Priority</Label>
                <Select value={formData.priority} onValueChange={val => setFormData({...formData, priority: val})}>
                  <SelectTrigger className="h-12 rounded-xl bg-background/60 backdrop-blur-sm border-input hover:border-primary/50 transition-colors shadow-sm focus:ring-4 focus:ring-primary/10"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50 bg-background/80 backdrop-blur-xl shadow-xl">
                    <SelectItem value="low" className="rounded-xl focus:bg-primary/10">Low</SelectItem>
                    <SelectItem value="medium" className="rounded-xl focus:bg-primary/10">Medium</SelectItem>
                    <SelectItem value="high" className="rounded-xl focus:bg-primary/10">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5 group">
              <Label className="text-[14px] font-medium text-foreground/90 group-focus-within:text-primary transition-colors">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full h-12 rounded-xl bg-background/60 backdrop-blur-sm border-input hover:border-primary/50 hover:bg-background/80 transition-colors shadow-sm focus-visible:ring-4 focus-visible:ring-primary/10 justify-start text-left font-normal text-[15px]", !formData.due_date && "text-muted-foreground/60")}>
                    <CalendarIcon className="mr-3 h-[18px] w-[18px] text-muted-foreground group-focus-within:text-primary transition-colors" />
                    {formData.due_date ? format(formData.due_date, "PPP") : "Select a target date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl" align="start">
                  <Calendar mode="single" selected={formData.due_date} onSelect={date => setFormData({...formData, due_date: date})} initialFocus className="p-3" />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Textarea 
                id="description" 
                label="Description"
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Add more details, links, or notes..."
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-6 mt-auto border-t border-border/50">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving} className="mt-3 sm:mt-0 h-12 rounded-xl px-6 border-border/50 hover:bg-muted/50">Cancel</Button>
              <Button type="submit" disabled={isSaving} className="h-12 rounded-xl px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                {isSaving && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
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