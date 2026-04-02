// Utility to validate queries in development
export const validateTaskQuery = (tableName, operation, payload = null) => {
  // Use a browser-compatible check for development environment
  const isDevelopment = import.meta.env?.DEV || false;
  
  if (!isDevelopment) return true;

  const validTables = ['tasks', 'projects', 'tags', 'task_tags', 'task_comments', 'task_attachments', 'task_subtasks', 'task_activity_log', 'task_dependencies'];
  
  if (!validTables.includes(tableName)) {
    console.warn(`[Query Validator] Warning: Table '${tableName}' is not in the recognized list of task-related tables.`);
  }

  if (payload) {
    if (operation === 'insert' || operation === 'update') {
      // Basic schema check
      if (tableName === 'tasks' && payload.title !== undefined && typeof payload.title !== 'string') {
        console.error(`[Query Validator] Error: 'title' must be a string.`);
        return false;
      }
    }
  }

  console.log(`[Query Validator] Validated ${operation} operation on ${tableName}`);
  return true;
};