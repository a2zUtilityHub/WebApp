import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { adminNavigation } from '@/config/adminNavigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const AdminSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (path) => {
    setOpen(false);
    navigate(path);
  };

  // Flatten navigation for search
  const flattenNav = (items) => {
    let result = [];
    items.forEach(item => {
      if (item.path) result.push(item);
      if (item.children) result = [...result, ...flattenNav(item.children)];
    });
    return result;
  };
  
  const searchableItems = flattenNav(adminNavigation);
  
  const filteredItems = searchableItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search admin...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 gap-0 overflow-hidden max-w-[600px]">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              className="border-0 focus-visible:ring-0"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <ScrollArea className="max-h-[300px] overflow-y-auto">
            <div className="p-2">
              {filteredItems.length === 0 && (
                <p className="p-4 text-sm text-center text-muted-foreground">No results found.</p>
              )}
              
              {filteredItems.length > 0 && (
                <div className="mb-2">
                  <h4 className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Navigation</h4>
                  {filteredItems.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => handleSelect(item.path)}
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    >
                      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminSearch;