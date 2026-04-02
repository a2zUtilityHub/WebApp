import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const TaskReports = () => {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="bg-muted p-4 rounded-full">
                    <Download className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Task Reports</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                    Generate comprehensive reports about task completion, team performance, and project timelines.
                </p>
                <Button>Generate Report (PDF)</Button>
            </CardContent>
        </Card>
    );
};
export default TaskReports;