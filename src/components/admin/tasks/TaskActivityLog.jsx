import React, { useEffect, useState } from 'react';
import { useTaskManagement } from '@/hooks/useTaskManagement';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Activity, Plus, Edit, CheckSquare, MessageSquare, Paperclip } from 'lucide-react';

const TaskActivityLog = ({ taskId }) => {
    const { fetchActivityLog } = useTaskManagement();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchActivityLog(taskId);
            setActivities(data || []);
            setLoading(false);
        };
        if(taskId) load();
    }, [taskId]);

    const getIcon = (action) => {
        switch(action) {
            case 'created': return <Plus className="h-4 w-4 text-green-500" />;
            case 'updated': return <Edit className="h-4 w-4 text-blue-500" />;
            case 'status_changed': return <CheckSquare className="h-4 w-4 text-yellow-500" />;
            case 'priority_changed': return <Activity className="h-4 w-4 text-orange-500" />;
            case 'commented': return <MessageSquare className="h-4 w-4 text-purple-500" />;
            case 'attachment_added': return <Paperclip className="h-4 w-4 text-gray-500" />;
            default: return <Activity className="h-4 w-4" />;
        }
    };

    const getMessage = (act) => {
        switch(act.action) {
            case 'created': return `created this task`;
            case 'status_changed': return `changed status from ${act.old_value} to ${act.new_value}`;
            case 'priority_changed': return `changed priority from ${act.old_value} to ${act.new_value}`;
            case 'commented': return `added a comment`;
            case 'attachment_added': return `uploaded attachment ${act.new_value}`;
            default: return `updated the task`;
        }
    };

    if (loading) return <Skeleton className="h-40 w-full" />;

    return (
        <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
                {activities.map((act) => (
                    <div key={act.id} className="flex gap-4 relative">
                        <div className="absolute left-4 top-8 bottom-[-24px] w-px bg-border last:hidden"></div>
                        
                        <Avatar className="h-8 w-8 border">
                            <AvatarImage src={act.user?.avatar_url} />
                            <AvatarFallback>{act.user?.first_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{act.user?.first_name} {act.user?.last_name}</span>
                                <span className="text-muted-foreground text-xs">{formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}</span>
                            </div>
                            <div className="text-sm flex items-start gap-2">
                                <div className="mt-0.5 p-1 bg-muted rounded-full">
                                    {getIcon(act.action)}
                                </div>
                                <span className="text-muted-foreground">{getMessage(act)}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {activities.length === 0 && <div className="text-center text-muted-foreground py-8">No recent activity</div>}
            </div>
        </ScrollArea>
    );
};

export default TaskActivityLog;