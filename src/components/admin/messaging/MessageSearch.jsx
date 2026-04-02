import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const MessageSearch = ({ onSearch, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleClear = () => {
    setValue('');
  };

  return (
    <div className="relative flex items-center w-full md:max-w-xs">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder="Search messages..."
        className="pl-9 pr-9 h-9 text-sm transition-all focus:w-full"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={handleClear}
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
};

export default MessageSearch;