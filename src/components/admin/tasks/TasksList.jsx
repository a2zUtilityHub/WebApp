import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskStatusBadge, TaskPriorityBadge, TaskAssigneeBadge } from './TaskBadges';
import { MoreHorizontal, Edit, Trash2, Eye, RefreshCcw, AlertCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTaskManagement } from '@/hooks/useTaskManagement';

const TasksList = ({ filters, search, sort, onEdit, onView, refreshTrigger }) => {
    const { fetchTasks, deleteTask } = useTaskManagement();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTasks, setSelectedTasks] = useState([]);

    const loadTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await fetchTasks(filters, search, sort);
            if (fetchError) throw fetchError;
            setTasks(data || []);
        } catch (err) {
            console.error("Failed to load tasks:", err);
            setError("Failed to load tasks. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, [filters, search, sort, refreshTrigger, fetchTasks]);

    const handleSelectAll = (checked) => {
        if (checked) setSelectedTasks(tasks.map(t => t.id));
        else setSelectedTasks([]);
    };

    const handleSelectOne = (id, checked) => {
        if (checked) setSelectedTasks([...selectedTasks, id]);
        else setSelectedTasks(selectedTasks.filter(tid => tid !== id));
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this task?')) {
            await deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
        }
    };

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex items-center gap-4">
                    {error}
                    <Button variant="outline" size="sm" onClick={loadTasks} className="h-7 text-xs border-red-200 hover:bg-red-100 hover:text-red-900">
                        <RefreshCcw className="mr-2 h-3 w-3" /> Retry
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    if (loading) {
        return (
            <div className="space-y-2">
                <div className="flex items-center space-x-2 pb-4">
                     <Skeleton className="h-4 w-[250px]" />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}
            </div>
        );
    }

    if (!loading && tasks.length === 0) {
        return (
            <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                <div className="flex flex-col items-center justify-center gap-2">
                    <p className="font-medium">No tasks found</p>
                    <p className="text-sm">
                        {Object.keys(filters).length > 0 || search 
                            ? "Try adjusting your filters or search terms." 
                            : "Get started by creating a new task."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40px]">
                            <Checkbox 
                                checked={selectedTasks.length === tasks.length && tasks.length > 0}
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map(task => (
                        <TableRow key={task.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => onView(task)}>
                             <TableCell onClick={e => e.stopPropagation()}>
                                <Checkbox 
                                    checked={selectedTasks.includes(task.id)}
                                    onCheckedChange={(c) => handleSelectOne(task.id, c)}
                                />
                            </TableCell>
                            <TableCell className="font-medium text-foreground">{task.title}</TableCell>
                            <TableCell><TaskStatusBadge status={task.status} /></TableCell>
                            <TableCell><TaskPriorityBadge priority={task.priority} /></TableCell>
                            <TableCell>
                                {task.assignees && task.assignees.length > 0 
                                    ? <TaskAssigneeBadge assignee={task.assignees[0]} />
                                    : <span className="text-muted-foreground text-xs italic">Unassigned</span>
                                }
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}</TableCell>
                            <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onView(task)}><Eye className="mr-2 h-4 w-4"/> View Details</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onEdit(task)}><Edit className="mr-2 h-4 w-4"/> Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4"/> Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="p-4 border-t text-xs text-muted-foreground">
                Showing {tasks.length} task{tasks.length !== 1 && 's'}
            </div>
        </div>
    );
};

export default TasksList;