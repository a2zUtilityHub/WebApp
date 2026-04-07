import React, { useState } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const SubtaskList = ({ subtasks = [], onChange }) => {
  const [newValue, setNewValue] = useState('');

  const handleAdd = (e) => {
    e?.preventDefault();
    if (!newValue.trim()) return;
    const newTask = { id: Date.now().toString(), title: newValue.trim(), completed: false };
    onChange([...subtasks, newTask]);
    setNewValue('');
  };

  const handleToggle = (id) => {
    onChange(subtasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id) => {
    onChange(subtasks.filter(t => t.id !== id));
  };

  const handleUpdateTitle = (id, newTitle) => {
    onChange(subtasks.map(t => t.id === id ? { ...t, title: newTitle } : t));
  };

  const completedCount = subtasks.filter(t => t.completed).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Subtasks</h4>
        {subtasks.length > 0 && (
          <span className="text-xs text-muted-foreground">{completedCount} / {subtasks.length} completed</span>
        )}
      </div>

      {subtasks.length > 0 && (
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-primary h-1.5 transition-all duration-300" 
            style={{ width: `${(completedCount / subtasks.length) * 100}%` }}
          />
        </div>
      )}

      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {subtasks.map((task) => (
          <div key={task.id} className="flex items-center gap-2 group">
            <Checkbox 
              checked={task.completed} 
              onCheckedChange={() => handleToggle(task.id)}
            />
            <Input 
              value={task.title}
              onChange={(e) => handleUpdateTitle(task.id, e.target.value)}
              className={cn("h-7 text-sm bg-transparent border-transparent hover:border-input focus:border-input", task.completed && "line-through text-muted-foreground")}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0 text-destructive hover:bg-destructive/10"
              onClick={() => handleDelete(task.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input 
          placeholder="Add a subtask..." 
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd(e)}
          className="h-8 text-sm"
        />
        <Button size="sm" variant="secondary" onClick={handleAdd} className="h-8 shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SubtaskList;