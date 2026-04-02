
import React, { useState, useEffect } from 'react';
import { Wrench, Info, BookOpen, HelpCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AppPageNavigation = () => {
  const [activeHash, setActiveHash] = useState('#tool');

  useEffect(() => {
    // Handle initial hash on load
    if (window.location.hash) {
      setActiveHash(window.location.hash);
      const element = document.getElementById(window.location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }

    // Intersection Observer to update active tab on scroll
    const sections = ['tool', 'about', 'manual', 'faq', 'community'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
            // Optionally update URL without jumping
            window.history.replaceState(null, '', `#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-100px 0px -50% 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (e, hash) => {
    e.preventDefault();
    setActiveHash(hash);
    const id = hash.substring(1);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      window.history.pushState(null, '', hash);
    }
  };

  const tabs = [
    { id: '#tool', label: 'Tool', icon: <Wrench className="w-4 h-4 mr-2" /> },
    { id: '#about', label: 'About', icon: <Info className="w-4 h-4 mr-2" /> },
    { id: '#manual', label: 'Manual', icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { id: '#faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4 mr-2" /> },
    { id: '#community', label: 'Community', icon: <Users className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="w-full bg-background/80 backdrop-blur-md border-b border-border sticky top-[64px] md:top-[72px] z-40 mb-6 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto custom-scrollbar py-3 gap-2 hide-scrollbar">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href={tab.id}
              onClick={(e) => handleClick(e, tab.id)}
              className={cn(
                "flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                activeHash === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
