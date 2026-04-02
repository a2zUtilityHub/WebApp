import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

const ChatbotSearch = ({ onSearch }) => {
    const [value, setValue] = useState('');
    const debouncedValue = useDebounce(value, 500);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search chatbots..."
                className="pl-9 pr-9"
            />
            {value && (
                <button
                    onClick={() => setValue('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default ChatbotSearch;