import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { DragDropContext } from 'react-beautiful-dnd';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useTaskManagement } from '@/hooks/useTaskManagement';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Routes, Route, useLocation, NavLink } from 'react-router-dom';
import { Plus, RotateCcw, Trash2, KanbanSquare, Plug, Terminal, Zap, ShieldAlert, Loader2 } from 'lucide-react';

import TaskColumn from '@/components/apps/task-manager/TaskColumn';
import TaskModal from '@/components/apps/task-manager/TaskModal';
import FilterBar from '@/components/apps/task-manager/FilterBar';
import SearchBar from '@/components/apps/task-manager/SearchBar';
import SortOptions from '@/components/apps/task-manager/SortOptions';
import ProjectSidebar from '@/components/apps/task-manager/ProjectSidebar';
import AnalyticsDashboard from '@/components/apps/task-manager/AnalyticsDashboard';
import { NotificationBell } from '@/components/apps/task-manager/TaskNotifications';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager';

import { IntegrationsPage } from '@/components/apps/task-manager/integrations/IntegrationsPage';
import { APIDocumentation } from '@/components/apps/task-manager/api/APIDocumentation';
import { MobileNavigation } from '@/components/apps/task-manager/mobile/MobileNavigation';
import { AutomationRules } from '@/components/apps/task-manager/automation/AutomationRules';
import { ReportBuilder } from '@/components/apps/task-manager/reporting/ReportBuilder';
import { RoleManagement } from '@/components/apps/task-manager/permissions/RoleManagement';
import { TimeTracker } from '@/components/apps/task-manager/timetracking/TimeTracker';
import { TeamManagement } from '@/components/apps/task-manager/team/TeamManagement';
import { ProjectSettings } from '@/components/apps/task-manager/settings/ProjectSettings';

import { AppPageNavigation } from '@/components/apps/shared/AppPageNavigation';
import { AboutSection, ManualSection, FAQSection, CommunitySection } from '@/components/apps/shared/AppSections';
import { AppLoginModal } from '@/components/apps/shared/AppLoginModal';
import { AppTabsLayout } from '@/components/apps/shared/AppTabsLayout';

const taskManagerData = {
  about: {
    title: "Task Manager Pro",
    description: "An enterprise-grade project management suite designed to scale with your team.",
    features: [
      { icon: <KanbanSquare className="w-6 h-6" />, title: "Visual Kanban Boards", desc: "Organize and prioritize your tasks intuitively." },
      { icon: <Zap className="w-6 h-6" />, title: "Powerful Automation", desc: "Set up smart rules to auto-assign tasks." },
      { icon: <ShieldAlert className="w-6 h-6" />, title: "Role-Based Access", desc: "Granular permissions ensure right access." },
    ],
    benefits: [
      "Eliminate context switching.",
      "Improve team transparency.",
      "Save hours of manual work.",
      "Identify workflow roadblocks immediately."
    ]
  },
  manual: {
    title: "Task Manager",
    steps: [
      { title: "Create Workspace", desc: "Start by creating a new project from the sidebar." },
      { title: "Build Your Board", desc: "Use the default columns or customize your workflow." },
      { title: "Add Tasks", desc: "Create tasks, add descriptions, set due dates." },
      { title: "Move Tasks", desc: "Drag and drop tasks between columns." }
    ],
    tips: [
      "Use keyboard shortcuts.",
      "Apply specific tags.",
      "Use bulk actions."
    ]
  },
  faq: [
    { q: "Are my tasks private?", a: "Yes, by default, projects are only visible to their creator." },
    { q: "Can I undo a task move?", a: "Absolutely. A convenient 'Undo' button appears." },
    { q: "Is there a limit to projects?", a: "Registered users have generous allocations." }
  ]
};

const TaskManagerBoard = ({
  tasks, loading, columns, handleOpenModal, handleDeleteTask, handleToggleComplete, 
  selectedTaskIds, toggleSelectTask, onDragEnd, handleUndo, undoStack, handleBulkDelete,
  searchQuery, setSearchQuery, filters, setFilters, sortBy, setSortBy
}) => {
  if (loading && tasks.length === 0) {
    return (
      <div className="flex h-full min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium text-sm">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-fade-in w-full pb-10 md:pb-0">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Kanban Board</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage projects, track subtasks, and organize your workflow.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterBar filters={filters} setFilters={setFilters} clearFilters={() => setFilters({status:[], priority:[], dueDate:'all'})} />
          <SortOptions sortBy={sortBy} setSortBy={setSortBy} />
          
          {undoStack.length > 0 && (
            <Button variant="outline" size="icon" onClick={handleUndo} title="Undo last move (Ctrl+Z)"><RotateCcw className="w-4 h-4" /></Button>
          )}
          <Button onClick={() => handleOpenModal()} className="shadow-sm"><Plus className="w-4 h-4 mr-2" /> New Task</Button>
        </div>
      </div>

      {selectedTaskIds.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-lg flex items-center justify-between mb-4 animate-slide-in">
           <span className="text-sm font-medium">{selectedTaskIds.length} tasks selected</span>
           <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={handleBulkDelete}><Trash2 className="w-4 h-4 mr-2"/> Delete</Button>
           </div>
        </div>
      )}

      <div className="min-h-[50vh] w-full pb-10">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-board flex gap-4 overflow-x-auto pb-4">
            <TaskColumn id="todo" title="To Do" tasks={columns.todo} onEdit={handleOpenModal} onDelete={handleDeleteTask} onToggleComplete={handleToggleComplete} selectedTaskIds={selectedTaskIds} onToggleSelect={toggleSelectTask} />
            <TaskColumn id="inprogress" title="In Progress" tasks={columns.inprogress} onEdit={handleOpenModal} onDelete={handleDeleteTask} onToggleComplete={handleToggleComplete} selectedTaskIds={selectedTaskIds} onToggleSelect={toggleSelectTask} />
            <TaskColumn id="completed" title="Done" tasks={columns.completed} onEdit={handleOpenModal} onDelete={handleDeleteTask} onToggleComplete={handleToggleComplete} selectedTaskIds={selectedTaskIds} onToggleSelect={toggleSelectTask} />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

const TaskManagerPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { fetchTasks, updateTask, createTask, deleteTask } = useTaskManagement();
  const { toast } = useToast();
  const location = useLocation();
  const { trackPageView, pushEvent } = useGoogleTagManager();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: [], priority: [], dueDate: 'all' });
  const [sortBy, setSortBy] = useState('default');
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [undoStack, setUndoStack] = useState([]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState('login');

  useEffect(() => {
    trackPageView(location.pathname, 'Task Manager Pro');
  }, [location.pathname, trackPageView]);

  const loadData = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await fetchTasks({});
      if (!error) setTasks(data || []);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load tasks.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, fetchTasks, toast]);

  useEffect(() => {
    if (!authLoading) loadData();
  }, [authLoading, user, loadData]);

  useKeyboardShortcuts({
    onNew: () => { if(location.pathname === '/apps/task-manager' && isAuthenticated) handleOpenModal(); },
    onUndo: () => { if(isAuthenticated) handleUndo() },
    onEscape: () => { setIsModalOpen(false); setSelectedTaskIds([]); }
  });

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    const taskToMove = tasks.find(t => t.id.toString() === draggableId);
    if (!taskToMove) return;
    
    const oldStatus = taskToMove.status;
    const newStatus = destination.droppableId;
    
    setTasks(prev => prev.map(t => t.id.toString() === draggableId ? { ...t, status: newStatus } : t));
    setUndoStack(prev => [...prev, { action: 'MOVE', task: taskToMove, oldStatus, newStatus }]);
    
    try {
      const updatedTask = await updateTask(taskToMove.id, { status: newStatus });
      if (!updatedTask) throw new Error("Update task returned null");
      pushEvent('task_moved', { task_id: taskToMove.id, old_status: oldStatus, new_status: newStatus });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save move. Reverting...', variant: 'destructive' });
      loadData();
    }
  };

  const handleUndo = async () => {
    if (undoStack.length === 0) return;
    const lastAction = undoStack[undoStack.length - 1];
    try {
      if (lastAction.action === 'MOVE') {
        setTasks(prev => prev.map(t => t.id === lastAction.task.id ? { ...t, status: lastAction.oldStatus } : t));
        await updateTask(lastAction.task.id, { status: lastAction.oldStatus });
        toast({ title: 'Move undone' });
      }
      setUndoStack(prev => prev.slice(0, -1));
    } catch (err) {
      toast({ title: 'Undo failed', variant: 'destructive' });
      loadData();
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskData.id) {
        const updated = await updateTask(taskData.id, taskData);
        if (updated) {
          setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...updated } : t));
          toast({ title: 'Task updated' });
        }
      } else {
        const newTask = await createTask(taskData);
        if (newTask) {
          setTasks(prev => [newTask, ...prev]);
          toast({ title: 'Task created' });
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      toast({ title: 'Error saving task', variant: 'destructive' });
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const success = await deleteTask(id);
      if (success) {
          setTasks(prev => prev.filter(t => t.id !== id));
          setSelectedTaskIds(prev => prev.filter(tid => tid !== id));
          pushEvent('task_deleted', { task_id: id });
      }
    } catch (err) {
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  };

  const handleBulkDelete = async () => {
    if(!window.confirm(`Delete ${selectedTaskIds.length} selected tasks?`)) return;
    try {
      for(const id of selectedTaskIds) {
        await deleteTask(id);
      }
      setTasks(prev => prev.filter(t => !selectedTaskIds.includes(t.id)));
      setSelectedTaskIds([]);
    } catch(err) {
      toast({ title: 'Error during bulk delete', variant: 'destructive' });
      loadData();
    }
  };

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    try {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
      await updateTask(task.id, { status: newStatus });
    } catch (err) {
      loadData();
    }
  };

  const handleOpenModal = (task = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const toggleSelectTask = (id) => {
    setSelectedTaskIds(prev => prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]);
  };

  const processedTasks = useMemo(() => {
    let result = [...tasks];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => (t.title || '').toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
    }
    if (filters.status.length > 0) result = result.filter(t => filters.status.includes(t.status));
    if (filters.priority.length > 0) result = result.filter(t => filters.priority.includes(t.priority));
    result.sort((a, b) => {
      if (sortBy === 'title_asc') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'created_desc') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      return 0;
    });
    return result;
  }, [tasks, searchQuery, filters, sortBy]);

  const columns = {
    todo: processedTasks.filter(t => t.status === 'todo'),
    inprogress: processedTasks.filter(t => t.status === 'inprogress'),
    completed: processedTasks.filter(t => t.status === 'completed'),
  };

  const tabsConfig = [
    { id: 'about', label: 'About', content: <AboutSection {...taskManagerData.about} /> },
    { id: 'manual', label: 'Manual', content: <ManualSection {...taskManagerData.manual} /> },
    { id: 'faq', label: 'FAQ', content: <FAQSection faqs={taskManagerData.faq} /> },
    { id: 'community', label: 'Community', content: <CommunitySection appId="task-manager" /> }
  ];

  return (
    <div className="bg-background min-h-[calc(100vh-72px)] flex flex-col pb-20">
      <Helmet><title>Task Manager Workspace | A2Z</title></Helmet>
      
      <div className="h-14 border-b border-border px-4 md:px-6 flex items-center justify-between bg-card z-20">
         <div className="font-semibold tracking-tight text-primary flex items-center gap-2">
            <KanbanSquare className="w-5 h-5"/> Task Manager Pro
         </div>
         <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLink to="/apps/task-manager/integrations" className={({isActive}) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}><span className="flex items-center gap-1"><Plug className="w-4 h-4"/> Integrations</span></NavLink>
            <NavLink to="/apps/task-manager/api-docs" className={({isActive}) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}><span className="flex items-center gap-1"><Terminal className="w-4 h-4"/> API</span></NavLink>
            <NavLink to="/apps/task-manager/automation" className={({isActive}) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}><span className="flex items-center gap-1"><Zap className="w-4 h-4"/> Automation</span></NavLink>
            <NavLink to="/apps/task-manager/permissions" className={({isActive}) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}><span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4"/> Roles</span></NavLink>
         </div>
         <div className="flex items-center gap-3"><NotificationBell /></div>
      </div>

      <div className="flex-1 flex flex-col space-y-16">
        <section id="tool" className="scroll-mt-24">
          {authLoading ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : !isAuthenticated ? (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
              <Card className="w-full max-w-md shadow-xl border-primary/10 bg-card text-center">
                <CardHeader className="pb-6 pt-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5">
                    <KanbanSquare className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-extrabold tracking-tight">Task Manager</CardTitle>
                  <CardDescription className="text-base mt-3 text-muted-foreground">
                    Please log in to access the Task Manager and organize your workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 pb-8 px-8">
                  <Button size="lg" className="w-full text-md font-semibold h-12" onClick={() => { setAuthView('login'); setIsAuthModalOpen(true); }}>
                    Login to Continue
                  </Button>
                  <Button variant="outline" size="lg" className="w-full h-12 border-primary/20 hover:bg-primary/5" onClick={() => { setAuthView('signup'); setIsAuthModalOpen(true); }}>
                    Create an Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-1 overflow-hidden relative border-t border-border">
              <ProjectSidebar />
              <div className="flex-1 overflow-y-auto bg-muted/20">
                <div className="p-4 md:p-6 lg:p-8 min-h-[60vh]">
                  <Routes>
                    <Route index element={<TaskManagerBoard tasks={tasks} loading={loading} columns={columns} handleOpenModal={handleOpenModal} handleDeleteTask={handleDeleteTask} handleToggleComplete={handleToggleComplete} selectedTaskIds={selectedTaskIds} toggleSelectTask={toggleSelectTask} onDragEnd={onDragEnd} handleUndo={handleUndo} undoStack={undoStack} handleBulkDelete={handleBulkDelete} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filters={filters} setFilters={setFilters} sortBy={sortBy} setSortBy={setSortBy}/>} />
                    <Route path="analytics" element={<AnalyticsDashboard tasks={tasks} />} />
                    <Route path="reports" element={<ReportBuilder />} />
                    <Route path="integrations" element={<IntegrationsPage />} />
                    <Route path="api-docs" element={<APIDocumentation />} />
                    <Route path="automation" element={<AutomationRules />} />
                    <Route path="permissions" element={<RoleManagement />} />
                    <Route path="team" element={<TeamManagement />} />
                    <Route path="settings" element={<ProjectSettings />} />
                    <Route path="time" element={<TimeTracker />} />
                  </Routes>
                </div>
              </div>
              <MobileNavigation />
              <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTask} task={selectedTask} />
            </div>
          )}
        </section>

        <AppTabsLayout tabsConfig={tabsConfig} />
      </div>
      
      <AppLoginModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultView={authView} 
      />
    </div>
  );
};

export default TaskManagerPage;