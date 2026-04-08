import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';

const TaskColumn = ({ id, title, tasks = [], onEdit, onDelete, onToggleComplete, selectedTaskIds, onToggleSelect }) => {
  return (
    <div className="kanban-column flex-shrink-0">
      <div className="kanban-column-header">
        <h2 className="text-foreground">{title}</h2>
        <span className="bg-background text-foreground text-xs px-2.5 py-1 rounded-full shadow-sm font-medium border border-border">
          {tasks.length}
        </span>
      </div>
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn('drop-zone flex-1 overflow-y-auto pr-1', snapshot.isDraggingOver && 'active')}
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index} 
                onEdit={onEdit} 
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
                isSelected={selectedTaskIds?.includes(task.id)}
                onToggleSelect={onToggleSelect}
              />
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-24 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                Drop tasks here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;