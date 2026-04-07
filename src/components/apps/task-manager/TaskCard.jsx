import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { Calendar, MoreVertical, Edit2, Trash2, CheckCircle2, Circle, CheckSquare, GripVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager';

const priorityConfig = {
  high: { label: 'High', class: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200' },
  medium: { label: 'Medium', class: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  low: { label: 'Low', class: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' }
};

const TaskCard = ({ task, index, onEdit, onDelete, onToggleComplete, isSelected, onToggleSelect }) => {
  const { trackTaskCompleted } = useGoogleTagManager();
  if (!task || !task.id) return null;

  const isCompleted = task.status === 'completed';
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && !isCompleted;
  
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;
  const hasSubtasks = subtasks.length > 0;

  const tags = task.tags || [];

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    if (!isCompleted) {
      trackTaskCompleted({ task_id: task.id, project_id: task.project_id || 'default' });
    }
    onToggleComplete(task);
  };

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            'task-card group relative', 
            snapshot.isDragging && 'dragging', 
            isCompleted && 'opacity-75 bg-muted/30',
            isSelected && 'ring-2 ring-primary border-primary'
          )}
          style={{ ...provided.draggableProps.style }}
          onClick={(e) => {
            if(e.target.closest('.bulk-select-cb')) return;
            onEdit(task);
          }}
        >
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 items-center z-10 bg-card rounded-md shadow-sm border p-1">
             <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
               <GripVertical className="w-4 h-4" />
             </div>
             <div className="bulk-select-cb" onClick={e => e.stopPropagation()}>
               <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(task.id)} className="w-4 h-4" />
             </div>
          </div>

          <div className="flex items-start gap-3 pl-1 group-hover:pl-6 transition-all duration-200">
            <button 
              type="button"
              className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors z-10"
              onClick={handleToggleComplete}
              aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
            >
              {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={cn("task-title", isCompleted && "line-through text-muted-foreground")}>
                  {task.title}
                </h3>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded text-muted-foreground transition-all shrink-0 focus:opacity-100 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                      <Edit2 className="w-4 h-4 mr-2" /> Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {task.description && (
                <p className="task-description">{task.description}</p>
              )}

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map((tag, i) => {
                    const isObj = typeof tag === 'object';
                    return (
                      <Badge key={i} variant="secondary" className={cn("text-[10px] px-1.5 py-0 font-medium", isObj && tag.color ? `${tag.color} text-white hover:${tag.color}` : '')}>
                        {isObj ? tag.text : tag}
                      </Badge>
                    );
                  })}
                </div>
              )}

              {hasSubtasks && (
                <div className="mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <CheckSquare className="w-3 h-3" />
                    {completedSubtasks}/{subtasks.length} Subtasks
                  </div>
                  <div className="w-full bg-muted rounded-full h-1">
                    <div className={cn("h-1 rounded-full", completedSubtasks === subtasks.length ? "bg-emerald-500" : "bg-primary")} style={{ width: `${(completedSubtasks / subtasks.length) * 100}%` }} />
                  </div>
                </div>
              )}

              <div className="task-meta">
                {task.priority && (
                  <span className={cn('priority-badge border', priorityConfig[task.priority]?.class || 'bg-gray-100 text-gray-600')}>
                    {priorityConfig[task.priority]?.label || 'Medium'}
                  </span>
                )}
                
                {dueDate && (
                  <span className={cn(
                    'flex items-center gap-1 font-medium', 
                    isOverdue ? 'text-red-600 bg-red-50 px-1.5 py-0.5 rounded' : 
                    isToday(dueDate) ? 'text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded' : 
                    isTomorrow(dueDate) ? 'text-blue-600' : 'text-muted-foreground'
                  )}>
                    <Calendar className="w-3 h-3" />
                    {isOverdue ? 'Overdue' : isToday(dueDate) ? 'Today' : isTomorrow(dueDate) ? 'Tomorrow' : format(dueDate, 'MMM d')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;