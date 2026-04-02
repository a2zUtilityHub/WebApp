import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

const categories = [
    { value: 'user_management', label: 'User Management' },
    { value: 'role_management', label: 'Role Management' },
    { value: 'permission_management', label: 'Permission Management' },
    { value: 'page_access', label: 'Page Access' },
    { value: 'content_management', label: 'Content Management' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'support_management', label: 'Support Management' },
];

const PermissionCategorySelect = ({ value, onChange, className }) => {
  return (
    <div className={className}>
        <Label className="mb-2 block">Category</Label>
        <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
            <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
            {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                </SelectItem>
            ))}
        </SelectContent>
        </Select>
    </div>
  );
};

export default PermissionCategorySelect;