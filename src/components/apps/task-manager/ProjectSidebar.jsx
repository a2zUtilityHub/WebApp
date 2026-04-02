
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FolderKanban, BarChart3, Users, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager';

const ProjectSidebar = ({ currentProjectId }) => {
  const { toast } = useToast();
  const { trackProjectCreated } = useGoogleTagManager();

  const handleCreate = () => {
    trackProjectCreated({ project_id: 'new_project_placeholder' });
    toast({ title: 'Feature incoming', description: 'Project creation will be available soon.' });
  };

  const navItems = [
    { name: 'Board', icon: FolderKanban, path: `/apps/task-manager` },
    { name: 'Analytics', icon: BarChart3, path: `/apps/task-manager/analytics` },
    { name: 'Team', icon: Users, path: `/apps/task-manager/team` },
    { name: 'Settings', icon: Settings, path: `/apps/task-manager/settings` },
  ];

  return (
    <div className="w-64 border-r border-border/50 bg-card/30 hidden md:flex flex-col h-full sticky top-[72px]">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">My Projects</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCreate}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-1 mb-8">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">General</div>
          {navItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/apps/task-manager'}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
