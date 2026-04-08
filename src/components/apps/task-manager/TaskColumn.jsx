import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';

const TaskColumn = ({ id, title, tasks = [], onEdit, onDelete, onToggleComplete, selectedTaskIds, onToggleSelect }) => {
  return (
    <div className="kanban-column flex-shrink-0 w-80 flex flex-col bg-background/40 backdrop-blur-xl border border-border/50 rounded-3xl h-full max-h-[70vh] shadow-sm">
      <div className="kanban-column-header p-5 flex items-center justify-between border-b border-border/50 bg-background/60 rounded-t-3xl backdrop-blur-md sticky top-0 z-10">
        <h2 className="font-semibold text-foreground tracking-tight text-[15px]">{title}</h2>
        <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-bold">
          {tasks.length}
        </span>
      </div>
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn('drop-zone flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar transition-colors duration-300 rounded-b-3xl', snapshot.isDraggingOver && 'bg-primary/5')}
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
              <div className="h-24 border-2 border-dashed border-border/50 rounded-2xl flex items-center justify-center text-muted-foreground text-sm font-medium bg-background/30 backdrop-blur-sm">
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