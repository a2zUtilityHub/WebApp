import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { adminNavigation } from '@/config/adminNavigation';
import { usePermission } from '@/hooks/usePermission';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const AdminNavigation = ({ isCollapsed, setIsCollapsed, isMobile }) => {
  const location = useLocation();
  const { hasPermission } = usePermission();
  const [openItems, setOpenItems] = useState([]);

  // Auto-expand active groups
  useEffect(() => {
    const activeGroups = adminNavigation
      .filter(item => 
        item.children?.some(child => location.pathname.startsWith(child.path))
      )
      .map(item => item.id);
      
    setOpenItems(prev => [...new Set([...prev, ...activeGroups])]);
  }, [location.pathname]);

  const toggleGroup = (id) => {
    if (isCollapsed && !isMobile) {
        setIsCollapsed(false);
        setTimeout(() => setOpenItems(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        ), 150);
    } else {
        setOpenItems(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }
  };

  const NavItem = ({ item, level = 0 }) => {
    // Check permission
    if (item.permission && !hasPermission(item.permission)) {
        return null;
    }

    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    const isChildActive = item.children?.some(c => location.pathname.startsWith(c.path));
    const isOpen = openItems.includes(item.id);

    if (item.children) {
      return (
        <Collapsible open={isOpen} onOpenChange={() => toggleGroup(item.id)} className="w-full">
          <CollapsibleTrigger asChild>
            <Button 
                variant="ghost" 
                className={cn(
                    "w-full justify-between hover:bg-white/5 hover:text-white transition-all group",
                    (isActive || isChildActive) ? "text-primary font-medium bg-primary/10" : "text-muted-foreground",
                    isCollapsed && !isMobile ? "px-2 justify-center" : "px-4"
                )}
            >
                <div className="flex items-center gap-3">
                   {Icon && <Icon className={cn("h-4 w-4 shrink-0", (isActive || isChildActive) && "text-primary")} />}
                   {(!isCollapsed || isMobile) && <span>{item.label}</span>}
                </div>
                {(!isCollapsed || isMobile) && (
                    isOpen ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />
                )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-1">
             {item.children.map(child => (
                 <NavItem key={child.id} item={child} level={level + 1} />
             ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <NavLink
        to={item.path}
        className={({ isActive }) => cn(
            "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white",
            isActive ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-sm" : "text-muted-foreground",
            isCollapsed && !isMobile ? "justify-center px-2" : "",
            level > 0 && (!isCollapsed || isMobile) ? "pl-11" : ""
        )}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        {(!isCollapsed || isMobile) && <span>{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <ScrollArea className="h-full py-4">
       <nav className="flex flex-col gap-1 px-2">
         {adminNavigation.map(item => (
            <NavItem key={item.id} item={item} />
         ))}
       </nav>
    </ScrollArea>
  );
};

export default AdminNavigation;