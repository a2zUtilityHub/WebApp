import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Edit, Calendar, Trash2 } from 'lucide-react';
import { TaskStatusBadge, TaskPriorityBadge, TaskAssigneeBadge } from './TaskBadges';
import TaskComments from './TaskComments';
import TaskAttachments from './TaskAttachments';
import TaskSubtasks from './TaskSubtasks';
import TaskActivityLog from './TaskActivityLog';
import TaskDependencies from './TaskDependencies';
import { ScrollArea } from '@/components/ui/scroll-area';

const TaskDetail = ({ task, open, onClose, onEdit, onDelete }) => {
    if (!task) return null;

    // Helper to get first assignee for badge
    // Safe check for missing assignees array
    const mainAssignee = task.assignees && task.assignees.length > 0 ? task.assignees[0] : null;

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-[800px] sm:max-w-[100vw] sm:w-[800px] flex flex-col p-0 gap-0">
                <SheetHeader className="p-6 border-b bg-muted/10">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <span>Task #{task.id}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/> Due {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Date'}</span>
                            </div>
                            <SheetTitle className="text-xl">{task.title}</SheetTitle>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <Button size="sm" variant="outline" onClick={() => onEdit(task)}><Edit className="h-4 w-4 mr-2"/> Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => { onDelete(task.id); onClose(); }}><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4">
                        <TaskStatusBadge status={task.status} />
                        <TaskPriorityBadge priority={task.priority} />
                        <TaskAssigneeBadge assignee={mainAssignee} />
                    </div>
                    {/* Safe check for creator */}
                    <div className="text-xs text-muted-foreground mt-2">
                         {task.creator ? `Created by ${task.creator.first_name} ${task.creator.last_name}` : `Created by Admin`}
                    </div>
                </SheetHeader>
                
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <div className="prose prose-sm max-w-none text-muted-foreground">
                            {task.description || <span className="italic">No description provided.</span>}
                        </div>

                        <Tabs defaultValue="comments" className="w-full">
                            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                                <TabsTrigger value="comments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Comments</TabsTrigger>
                                <TabsTrigger value="subtasks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Subtasks</TabsTrigger>
                                <TabsTrigger value="attachments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Attachments</TabsTrigger>
                                <TabsTrigger value="activity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Activity</TabsTrigger>
                                <TabsTrigger value="dependencies" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Dependencies</TabsTrigger>
                            </TabsList>
                            <div className="pt-4">
                                <TabsContent value="comments"><TaskComments taskId={task.id} /></TabsContent>
                                <TabsContent value="subtasks"><TaskSubtasks taskId={task.id} /></TabsContent>
                                <TabsContent value="attachments"><TaskAttachments taskId={task.id} /></TabsContent>
                                <TabsContent value="activity"><TaskActivityLog taskId={task.id} /></TabsContent>
                                <TabsContent value="dependencies"><TaskDependencies taskId={task.id} /></TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default TaskDetail;