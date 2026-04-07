import React from 'react';
import { CheckCircle2, ListTodo, Clock, AlertTriangle } from 'lucide-react';

const TaskStats = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const inProgress = tasks.filter(t => t.status === 'inprogress').length;
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < today && t.status !== 'completed').length;

  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 animate-fade-in">
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-center">
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Total Tasks</span>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold">{total}</span>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-center">
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Done
        </span>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold">{completed}</span>
          <span className="text-sm text-muted-foreground pb-1">({completionRate}%)</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-center">
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
          <ListTodo className="w-3.5 h-3.5 text-blue-500" /> To Do
        </span>
        <span className="text-2xl font-bold">{todo}</span>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-center">
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-amber-500" /> In Progress
        </span>
        <span className="text-2xl font-bold">{inProgress}</span>
      </div>

      <div className="bg-card border border-destructive/20 bg-destructive/5 rounded-xl p-4 shadow-sm flex flex-col justify-center md:col-span-1 col-span-2">
        <span className="text-destructive text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" /> Overdue
        </span>
        <span className="text-2xl font-bold text-destructive">{overdue}</span>
      </div>
    </div>
  );
};

export default TaskStats;