
export const analyticsService = {
  calculateMetrics: (tasks = []) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'inprogress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    
    const high = tasks.filter(t => t.priority === 'high').length;
    const medium = tasks.filter(t => t.priority === 'medium').length;
    const low = tasks.filter(t => t.priority === 'low').length;

    const today = new Date();
    today.setHours(0,0,0,0);
    const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < today && t.status !== 'completed').length;

    return {
      total,
      completed,
      inProgress,
      todo,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      overdue,
      priorityDistribution: [
        { name: 'High', value: high, color: '#ef4444' },
        { name: 'Medium', value: medium, color: '#f59e0b' },
        { name: 'Low', value: low, color: '#10b981' }
      ],
      statusDistribution: [
        { name: 'To Do', value: todo, color: '#94a3b8' },
        { name: 'In Progress', value: inProgress, color: '#3b82f6' },
        { name: 'Done', value: completed, color: '#10b981' }
      ]
    };
  }
};
