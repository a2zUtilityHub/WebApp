import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const TableOfContents = ({ contentRef }) => {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (!contentRef.current) return;

        // Parse headings from the content area
        const elements = Array.from(contentRef.current.querySelectorAll('h2, h3'));
        const items = elements.map((elem, index) => {
            if (!elem.id) elem.id = `heading-${index}`;
            return {
                id: elem.id,
                text: elem.innerText,
                level: Number(elem.tagName.substring(1))
            };
        });
        setHeadings(items);

        // Intersection Observer for highlighting
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -60% 0px' }
        );

        elements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, [contentRef]);

    if (headings.length === 0) return null;

    return (
        <div className="bg-muted/30 rounded-lg border p-4 sticky top-24">
            <div 
                className="flex items-center justify-between cursor-pointer mb-2 font-semibold"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <span>Table of Contents</span>
                {isCollapsed ? <ChevronRight className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
            </div>
            
            {!isCollapsed && (
                <ul className="space-y-1 text-sm max-h-[70vh] overflow-y-auto">
                    {headings.map((heading) => (
                        <li 
                            key={heading.id} 
                            style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
                        >
                            <a 
                                href={`#${heading.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={cn(
                                    "block py-1 hover:text-primary transition-colors border-l-2 pl-3",
                                    activeId === heading.id 
                                        ? "text-primary border-primary font-medium" 
                                        : "text-muted-foreground border-transparent"
                                )}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TableOfContents;