import React, { useEffect, useState } from 'react';
import { useTaskManagement } from '@/hooks/useTaskManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const TaskSubtasks = ({ taskId }) => {
    const { fetchSubtasks, createSubtask, updateSubtask, deleteSubtask } = useTaskManagement();
    const [subtasks, setSubtasks] = useState([]);
    const [newTitle, setNewTitle] = useState('');

    const loadSubtasks = async () => {
        const data = await fetchSubtasks(taskId);
        setSubtasks(data || []);
    };

    useEffect(() => {
        if(taskId) loadSubtasks();
    }, [taskId]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if(!newTitle.trim()) return;
        await createSubtask({ task_id: taskId, title: newTitle });
        setNewTitle('');
        loadSubtasks();
    };

    const handleToggle = async (id, currentStatus) => {
        await updateSubtask(id, { is_completed: !currentStatus });
        loadSubtasks();
    };

    const handleDelete = async (id) => {
        await deleteSubtask(id);
        loadSubtasks();
    };

    const progress = subtasks.length > 0 
        ? Math.round((subtasks.filter(s => s.is_completed).length / subtasks.length) * 100) 
        : 0;

    return (
        <div className="space-y-4">
             <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium whitespace-nowrap">Progress ({progress}%)</span>
                <Progress value={progress} className="h-2" />
            </div>

            <form onSubmit={handleAdd} className="flex gap-2">
                <Input 
                    value={newTitle} 
                    onChange={e => setNewTitle(e.target.value)} 
                    placeholder="Add a subtask..." 
                />
                <Button type="submit" size="icon"><Plus className="h-4 w-4"/></Button>
            </form>

            <div className="space-y-2 mt-4">
                {subtasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded group">
                        <Checkbox 
                            checked={task.is_completed} 
                            onCheckedChange={() => handleToggle(task.id, task.is_completed)} 
                        />
                        <span className={`flex-1 text-sm ${task.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                        </span>
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive"
                            onClick={() => handleDelete(task.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskSubtasks;