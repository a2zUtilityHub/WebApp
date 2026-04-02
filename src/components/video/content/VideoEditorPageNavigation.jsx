
import React from 'react';
import { Film, Info, BookOpen, HelpCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const VideoEditorPageNavigation = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'editor', label: 'Editor', icon: <Film className="w-4 h-4 mr-2" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4 mr-2" /> },
    { id: 'manual', label: 'Manual', icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4 mr-2" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-16 z-40 mb-6 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto custom-scrollbar py-2 gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoEditorPageNavigation;
