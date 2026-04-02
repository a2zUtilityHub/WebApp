import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserPlus, ShieldPlus, List } from 'lucide-react';

const QuickActionsSection = () => {
  return (
    <div className="flex gap-4 mb-8">
        <Link to="/admin/users">
            <Button className="gap-2">
                <UserPlus className="h-4 w-4" /> Add New User
            </Button>
        </Link>
        <Link to="/admin/roles">
            <Button variant="outline" className="gap-2">
                <ShieldPlus className="h-4 w-4" /> Add New Role
            </Button>
        </Link>
        <Link to="/admin/activity">
            <Button variant="secondary" className="gap-2">
                <List className="h-4 w-4" /> View Activity Log
            </Button>
        </Link>
    </div>
  );
};

export default QuickActionsSection;