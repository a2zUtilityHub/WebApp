import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Clock, XCircle, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const TaskStatusBadge = ({ status }) => {
    const variants = {
        pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200',
        in_progress: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200',
        completed: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200',
        cancelled: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200'
    };

    const icons = {
        pending: Clock,
        in_progress: Clock,
        completed: CheckCircle,
        cancelled: XCircle
    };

    const Icon = icons[status] || Clock;

    return (
        <Badge variant="outline" className={cn("gap-1 capitalize", variants[status] || variants.pending)}>
            <Icon className="h-3 w-3" />
            {status?.replace('_', ' ')}
        </Badge>
    );
};

export const TaskPriorityBadge = ({ priority }) => {
    const variants = {
        high: 'bg-red-100 text-red-800 border-red-200',
        medium: 'bg-orange-100 text-orange-800 border-orange-200',
        low: 'bg-green-100 text-green-800 border-green-200'
    };
    
    const icons = {
        high: ArrowUp,
        medium: ArrowRight,
        low: ArrowDown
    };
    
    const Icon = icons[priority] || ArrowRight;

    return (
        <Badge variant="outline" className={cn("gap-1 capitalize", variants[priority] || variants.medium)}>
            <Icon className="h-3 w-3" />
            {priority}
        </Badge>
    );
};

export const TaskAssigneeBadge = ({ assignee }) => {
    if (!assignee) return <span className="text-muted-foreground text-xs italic">Unassigned</span>;
    return (
        <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
                <AvatarImage src={assignee.avatar_url} />
                <AvatarFallback>{assignee.first_name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{assignee.first_name} {assignee.last_name}</span>
        </div>
    );
};