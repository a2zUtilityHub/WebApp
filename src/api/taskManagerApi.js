import { supabase } from '@/lib/customSupabaseClient';

/**
 * Task Manager REST API Wrapper
 * Uses Supabase as the backend for robust, authenticated requests.
 */

// --- Projects API ---
export const getProjects = async () => {
  const { data, error } = await supabase.from('projects').select('*').eq('is_deleted', false).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getProject = async (id) => {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createProject = async (projectData) => {
  const { data, error } = await supabase.from('projects').insert([{ ...projectData, created_at: new Date().toISOString() }]).select().single();
  if (error) throw error;
  return data;
};

export const updateProject = async (id, projectData) => {
  const { data, error } = await supabase.from('projects').update(projectData).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteProject = async (id) => {
  const { error } = await supabase.from('projects').update({ is_deleted: true }).eq('id', id);
  if (error) throw error;
  return true;
};

// --- Tasks API ---
export const getTasks = async (projectId, filters = {}) => {
  let query = supabase.from('tasks').select('*').eq('is_deleted', false);
  if (projectId) query = query.eq('project_id', projectId);
  if (filters.status) query = query.eq('status', filters.status);
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createTask = async (projectId, taskData) => {
  const { data, error } = await supabase.from('tasks').insert([{ 
    ...taskData, 
    project_id: projectId,
    created_at: new Date().toISOString() 
  }]).select().single();
  if (error) throw error;
  return data;
};

export const updateTask = async (projectId, taskId, taskData) => {
  const { data, error } = await supabase.from('tasks')
    .update({ ...taskData, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .select().single();
  if (error) throw error;
  return data;
};

export const deleteTask = async (projectId, taskId) => {
  const { error } = await supabase.from('tasks').update({ is_deleted: true }).eq('id', taskId);
  if (error) throw error;
  return true;
};

// --- Comments API ---
export const getComments = async (taskId) => {
  const { data, error } = await supabase.from('comments').select('*').eq('task_id', taskId).eq('is_deleted', false).order('created_at', { ascending: true });
  if (error) throw error;
  return data;
};

export const addComment = async (taskId, content, userId) => {
  const { data, error } = await supabase.from('comments').insert([{ 
    task_id: taskId, 
    content, 
    user_id: userId,
    created_at: new Date().toISOString() 
  }]).select().single();
  if (error) throw error;
  return data;
};

// --- Activity API ---
export const getActivity = async (projectId, limit = 50) => {
  let query = supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(limit);
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// --- User API ---
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
};