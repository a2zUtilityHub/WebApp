import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, Calendar, Flag, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useOptimisticUpdate } from '@/hooks/useOptimisticUpdate';
import FormField from '@/components/FormField';
import { useFormValidation } from '@/hooks/useFormValidation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Mock data
const initialTasks = [
  { id: 1, title: 'Setup Project', description: 'Initialize React + Vite', status: 'todo', priority: 'high', dueDate: '2026-03-01' },
  { id: 2, title: 'Design System', description: 'Create theme tokens', status: 'in-progress', priority: 'medium', dueDate: '2026-03-05' },
  { id: 3, title: 'Auth Context', description: 'Implement Supabase auth', status: 'done', priority: 'high', dueDate: '2026-02-20' },
];

const priorityColors = {
  high: 'bg-red-500/10 text-red-500 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-500 border-green-500/20'
};

const TaskManagerPage = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleUpdateApi = async (newTasks) => {
    // Simulate API call
    return new Promise((resolve) => setTimeout(() => resolve(newTasks), 500));
  };

  const { performUpdate } = useOptimisticUpdate(
    handleUpdateApi,
    () => toast({ title: "Task Updated", description: "Your changes have been saved." }),
    () => setTasks(tasks) // rollback
  );

  const formRules = {
    title: { required: true, minLength: 3 },
    description: { required: true },
    priority: { required: true }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm } = useFormValidation(
    { title: '', description: '', priority: 'medium', status: 'todo' },
    formRules,
    (formValues) => {
      const newTask = { id: Date.now(), ...formValues, dueDate: new Date().toISOString().split('T')[0] };
      const newTasks = [...tasks, newTask];
      setTasks(newTasks); // optimistic
      performUpdate(tasks, newTasks);
      setIsModalOpen(false);
      resetForm();
    }
  );

  const columns = ['todo', 'in-progress', 'done'];

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    setTasks(newTasks);
    performUpdate(tasks, newTasks);
  };

  return (
    <>
      <Helmet><title>Task Manager | a2z Utility Hub</title></Helmet>
      <div className="container py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Task Manager</h1>
            <p className="text-muted-foreground mt-1">Organize and track your work</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> New Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(status => (
            <div 
              key={status}
              className="bg-muted/30 p-4 rounded-xl border border-dashed flex flex-col h-[calc(100vh-250px)] overflow-hidden"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold uppercase tracking-wider text-sm text-muted-foreground">{status.replace('-', ' ')}</h3>
                <Badge variant="secondary">{tasks.filter(t => t.status === status).length}</Badge>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                <AnimatePresence>
                  {tasks.filter(t => t.status === status).map(task => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <Card className="p-4 hover:shadow-md transition-shadow bg-card border group">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={priorityColors[task.priority]} variant="outline">
                            {task.priority}
                          </Badge>
                          <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h4 className="font-semibold mb-1">{task.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {task.dueDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> 0
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <FormField
                label="Task Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.title}
                touched={touched.title}
                required
                placeholder="Enter task title"
              />
              <FormField
                label="Description"
                name="description"
                type="textarea"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.description}
                touched={touched.description}
                required
                placeholder="Add more details..."
              />
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Priority <span className="text-red-500">*</span></label>
                <select 
                  name="priority" 
                  value={values.priority} 
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Create Task</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default TaskManagerPage;