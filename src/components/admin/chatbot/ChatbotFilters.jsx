import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ChatbotFilters = ({ filters, onChange, onClear }) => {
    return (
        <div className="flex flex-wrap gap-3 items-center p-4 bg-muted/20 rounded-lg border">
            <div className="w-[180px]">
                <Select value={filters.status || "all"} onValueChange={(val) => onChange("status", val === "all" ? [] : [val])}>
                    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="w-[180px]">
                <Select value={filters.type || "all"} onValueChange={(val) => onChange("type", val === "all" ? [] : [val])}>
                    <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="AI">AI</SelectItem>
                        <SelectItem value="rule-based">Rule Based</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {Object.keys(filters).length > 0 && (
                <Button variant="ghost" size="sm" onClick={onClear} className="h-8 px-2 lg:px-3 text-muted-foreground hover:text-foreground">
                    <X className="mr-2 h-4 w-4" /> Clear Filters
                </Button>
            )}
        </div>
    );
};

export default ChatbotFilters;