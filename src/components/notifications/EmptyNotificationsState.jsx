import React from 'react';
import { BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const EmptyNotificationsState = ({ onSeed }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
      <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
        <BellOff className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
      <p className="text-muted-foreground max-w-sm mb-8">
        You're all caught up! We'll notify you when there's something new for you to check out.
      </p>
      
      <div className="flex gap-4">
        <Button asChild variant="outline">
            <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
        {/* Helper for demo purposes to generate data */}
        <Button variant="ghost" onClick={onSeed} className="text-xs">
            Generate Demo Data
        </Button>
      </div>
    </div>
  );
};

export default EmptyNotificationsState;