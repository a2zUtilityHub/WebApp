import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, LayoutDashboard, ListTodo, FileText } from 'lucide-react';
import TasksDashboard from '@/components/admin/tasks/TasksDashboard';
import TasksList from '@/components/admin/tasks/TasksList';
import TaskReports from '@/components/admin/tasks/TaskReports';
import TaskFilters from '@/components/admin/tasks/TaskFilters';
import TaskSearch from '@/components/admin/tasks/TaskSearch';
import TaskForm from '@/components/admin/tasks/TaskForm';
import TaskDetail from '@/components/admin/tasks/TaskDetail';

const AdminTasksPage = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    // Filter & Search State
    const [filters, setFilters] = useState({});
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState({ column: 'created_at', ascending: false });

    const handleCreate = () => {
        setSelectedTask(null);
        setIsFormOpen(true);
    };

    const handleEdit = (task) => {
        setSelectedTask(task);
        setIsFormOpen(true);
    };

    const handleView = (task) => {
        setSelectedTask(task);
        setIsDetailOpen(true);
    };

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-6 pb-10 animate-in fade-in duration-500">
            <Helmet><title>Task Management | Admin</title></Helmet>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl shadow-sm border border-border/50 backdrop-blur-sm transition-all hover:shadow-md">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                      Tasks
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage project tasks, assignments, and workflows.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="rounded-xl border-border/50 hover:bg-muted transition-colors" onClick={() => setRefreshTrigger(p => p + 1)}><RefreshCw className="h-4 w-4"/></Button>
                    <Button onClick={handleCreate} className="rounded-xl bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all"><Plus className="mr-2 h-4 w-4"/> New Task</Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <TabsList className="bg-muted/50 border border-border/50 p-1 rounded-xl">
                        <TabsTrigger value="dashboard" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><LayoutDashboard className="h-4 w-4"/> Dashboard</TabsTrigger>
                        <TabsTrigger value="list" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><ListTodo className="h-4 w-4"/> Tasks List</TabsTrigger>
                        <TabsTrigger value="reports" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><FileText className="h-4 w-4"/> Reports</TabsTrigger>
                    </TabsList>
                    
                    {activeTab === 'list' && (
                        <div className="flex items-center gap-2 flex-1 justify-end max-w-xl">
                            <TaskSearch onSearch={setSearch} />
                        </div>
                    )}
                </div>

                <TabsContent value="dashboard" className="focus-visible:outline-none">
                    <TasksDashboard />
                </TabsContent>

                <TabsContent value="list" className="space-y-4 focus-visible:outline-none">
                    <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm space-y-5 overflow-hidden transition-all">
                        <TaskFilters 
                            filters={filters} 
                            onChange={handleFilterChange} 
                            onClear={() => setFilters({})} 
                        />
                        <TasksList 
                            filters={filters} 
                            search={search} 
                            sort={sort} 
                            onEdit={handleEdit} 
                            onView={handleView}
                            refreshTrigger={refreshTrigger}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="reports">
                    <TaskReports />
                </TabsContent>
            </Tabs>

            <TaskForm 
                open={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                initialData={selectedTask} 
                onSuccess={handleSuccess} 
            />

            <TaskDetail 
                open={isDetailOpen} 
                onClose={() => setIsDetailOpen(false)} 
                task={selectedTask}
                onEdit={(t) => { setIsDetailOpen(false); handleEdit(t); }}
                onDelete={handleSuccess}
            />
        </div>
    );
};

export default AdminTasksPage;