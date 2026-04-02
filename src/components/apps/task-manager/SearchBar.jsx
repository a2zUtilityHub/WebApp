
import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager';

const SearchBar = ({ value, onChange }) => {
  const { trackSearchPerformed } = useGoogleTagManager();
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedValue) {
        trackSearchPerformed({ search_query: debouncedValue });
      }
    }, 1000);
    return () => clearTimeout(handler);
  }, [debouncedValue, trackSearchPerformed]);

  const handleChange = (val) => {
    setDebouncedValue(val);
    onChange(val);
  };

  return (
    <div className="relative flex-1 md:min-w-[250px]">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        id="task-search"
        placeholder="Search tasks (Ctrl+F)..." 
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-9 pr-8 bg-card shadow-sm h-10 border-muted"
      />
      {value && (
        <button 
          onClick={() => handleChange('')}
          className="absolute right-2.5 top-3 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
