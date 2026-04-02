import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';

const TaskSearch = ({ onSearch, resultCount }) => {
    const [value, setValue] = useState('');
    const debouncedValue = useDebounce(value, 500);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    return (
        <div className="relative flex items-center max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search tasks..."
                className="pl-9 pr-10"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            {value && (
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 h-9 w-9 text-muted-foreground hover:text-foreground"
                    onClick={() => setValue('')}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
            {resultCount !== undefined && value && (
                <div className="absolute top-10 right-0 text-xs text-muted-foreground bg-background border px-2 py-1 rounded shadow-sm z-10">
                    Found {resultCount} results
                </div>
            )}
        </div>
    );
};

export default TaskSearch;