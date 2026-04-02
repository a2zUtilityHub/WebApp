
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, KanbanSquare, Settings, Activity, Clock } from 'lucide-react';

export const MobileNavigation = () => {
  const navItems = [
    { icon: Home, label: 'Board', path: '/apps/task-manager' },
    { icon: Activity, label: 'Analytics', path: '/apps/task-manager/analytics' },
    { icon: Clock, label: 'Time', path: '/apps/task-manager/time' },
    { icon: KanbanSquare, label: 'Reports', path: '/apps/task-manager/reports' },
    { icon: Settings, label: 'Settings', path: '/apps/task-manager/settings' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border pb-safe z-50 shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.1)]">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/apps/task-manager'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full touch-target transition-colors duration-200 ${
                isActive ? 'text-teal-600' : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
