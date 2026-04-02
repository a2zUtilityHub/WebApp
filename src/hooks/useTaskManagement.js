
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { handleTaskError } from '@/utils/taskErrorHandler';
import { validateTaskQuery } from '@/utils/taskQueryValidator';

export const useTaskManagement = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useAuth();

    const executeWithRetry = async (operation, maxRetries = 3, baseDelay = 1000) => {
        let attempt = 0;
        while (attempt < maxRetries) {
            try {
                return await operation();
            } catch (error) {
                attempt++;
                const { isRecoverable, code } = handleTaskError(error, `Attempt ${attempt}`);
                
                if (!isRecoverable || code === '42501' || code === 'AUTH_ERROR') {
                    throw error;
                }
                
                if (attempt >= maxRetries) {
                    throw error;
                }
                
                const delay = baseDelay * Math.pow(2, attempt - 1);
                console.log(`[Task Retry] Waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };

    const fetchTasks = useCallback(async (filters = {}, search = '', sort = {}, page = 1, pageSize = 10) => {
        if (!user) return { data: [], count: 0, error: 'Not authenticated' };
        
        setLoading(true);
        console.log('[useTaskManagement] Fetching tasks with filters:', filters);
        try {
            validateTaskQuery('tasks', 'select');
            
            const fetchOperation = async () => {
                let query = supabase.from('tasks').select('*', { count: 'exact' }).eq('is_deleted', false);
                query = query.eq('creator_id', user.id);

                if (search) {
                    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
                }

                if (filters.status && filters.status.length > 0) {
                     query = query.in('status', filters.status);
                }
                if (filters.priority && filters.priority.length > 0) {
                    query = query.in('priority', filters.priority);
                }
                if (filters.project && filters.project.length > 0) {
                    query = query.in('project_id', filters.project);
                }
                
                if (filters.dueDate) {
                    const now = new Date();
                    if (filters.dueDate === 'today') {
                        const startOfDay = new Date(now.setHours(0,0,0,0)).toISOString();
                        const endOfDay = new Date(now.setHours(23,59,59,999)).toISOString();
                        query = query.gte('due_date', startOfDay).lte('due_date', endOfDay);
                    } else if (filters.dueDate === 'overdue') {
                        query = query.lt('due_date', new Date().toISOString()).neq('status', 'completed');
                    }
                }

                if (sort.column) {
                    query = query.order(sort.column, { ascending: sort.ascending });
                } else {
                    query = query.order('created_at', { ascending: false });
                }

                const from = (page - 1) * pageSize;
                const to = from + pageSize - 1;
                query = query.range(from, to);

                const { data, count, error } = await query;
                if (error) throw error;
                return { data, count };
            };

            const { data, count } = await executeWithRetry(fetchOperation);
            
            const transformedData = data?.map(task => ({
                ...task,
                assignees: [], 
                creator: null
            })) || [];

            console.log('[useTaskManagement] Tasks fetched successfully:', transformedData.length);
            setLoading(false);
            return { data: transformedData, count: count || 0 };
        } catch (error) {
            console.error('[useTaskManagement] Error fetching tasks:', error);
            const parsedError = handleTaskError(error, 'fetch tasks');
            toast({ title: 'Error loading tasks', description: parsedError.message, variant: 'destructive' });
            setLoading(false);
            return { data: [], count: 0, error: parsedError.message };
        }
    }, [toast, user]);

    const createTask = async (taskData) => {
        if (!user) {
            toast({ title: 'Auth Error', description: 'You must be logged in to create tasks.', variant: 'destructive' });
            return null;
        }
        
        if (!taskData.title?.trim()) {
            toast({ title: 'Validation Error', description: 'Task title is required.', variant: 'destructive' });
            return null;
        }

        setLoading(true);
        try {
            validateTaskQuery('tasks', 'insert', taskData);
            
            // Remove fields that do not exist in the Supabase schema
            const { tags, subtasks, assigned_to, id, ...validFields } = taskData;
            
            const payload = {
                ...validFields,
                status: validFields.status || 'todo',
                priority: validFields.priority || 'medium',
                creator_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_deleted: false
            };

            console.log('[useTaskManagement] Creating task with payload:', payload);

            const { data, error } = await supabase.from('tasks').insert(payload).select().maybeSingle();

            if (error) {
                console.error('[useTaskManagement] Supabase insert error:', error);
                throw error;
            }
            
            console.log('[useTaskManagement] Task created successfully:', data);
            toast({ title: 'Success', description: 'Task created successfully' });
            setLoading(false);
            return data;
        } catch (error) {
            console.error('[useTaskManagement] Task creation failed:', error);
            const parsedError = handleTaskError(error, 'create task');
            toast({ title: 'Creation Failed', description: parsedError.message, variant: 'destructive' });
            setLoading(false);
            return null;
        }
    };

    const updateTask = async (id, taskData) => {
        if (!user || !id) return null;
        setLoading(true);
        try {
            validateTaskQuery('tasks', 'update', taskData);
            
            // Remove fields that do not exist in the Supabase schema
            const { tags, subtasks, assigned_to, id: _id, ...validFields } = taskData;

            const payload = {
                ...validFields,
                updated_at: new Date().toISOString()
            };

            console.log(`[useTaskManagement] Updating task ${id} with payload:`, payload);

            const { data, error } = await supabase.from('tasks').update(payload)
            .eq('id', id)
            .eq('creator_id', user.id) 
            .select()
            .maybeSingle();

            if (error) {
                console.error('[useTaskManagement] Supabase update error:', error);
                throw error;
            }
            
            if (!data) throw new Error("Task not found or permission denied.");

            console.log('[useTaskManagement] Task updated successfully:', data);
            setLoading(false);
            return data;
        } catch (error) {
            console.error('[useTaskManagement] Task update failed:', error);
            const parsedError = handleTaskError(error, 'update task');
            toast({ title: 'Update Failed', description: parsedError.message, variant: 'destructive' });
            setLoading(false);
            return null;
        }
    };

    const deleteTask = async (id) => {
        if (!user || !id) return false;
        setLoading(true);
        try {
            validateTaskQuery('tasks', 'update (soft delete)', { id });
            console.log(`[useTaskManagement] Soft deleting task ${id}`);
            
            const { error } = await supabase.from('tasks')
                .update({ is_deleted: true })
                .eq('id', id)
                .eq('creator_id', user.id);
                
            if (error) {
                console.error('[useTaskManagement] Supabase delete error:', error);
                throw error;
            }
            
            console.log('[useTaskManagement] Task deleted successfully');
            toast({ title: 'Success', description: 'Task deleted successfully' });
            setLoading(false);
            return true;
        } catch (error) {
            console.error('[useTaskManagement] Task deletion failed:', error);
            const parsedError = handleTaskError(error, 'delete task');
            toast({ title: 'Deletion Failed', description: parsedError.message, variant: 'destructive' });
            setLoading(false);
            return false;
        }
    };

    return {
        loading,
        fetchTasks, 
        createTask, 
        updateTask, 
        deleteTask
    };
};
