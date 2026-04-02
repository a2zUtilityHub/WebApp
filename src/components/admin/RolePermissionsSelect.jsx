import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RolePermissionsSelect = ({ selectedPermissions = [], onChange }) => {
  const { permissions, loading, error, fetchPermissions } = useAdminPermissions();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const handleToggle = (permId) => {
    if (selectedPermissions.includes(permId)) {
      onChange(selectedPermissions.filter(id => id !== permId));
    } else {
      onChange([...selectedPermissions, permId]);
    }
  };

  const filteredPermissions = permissions.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const grouped = filteredPermissions.reduce((acc, perm) => {
    const cat = perm.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(perm);
    return acc;
  }, {});

  if (loading && permissions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] border rounded-md bg-muted/10">
            <Loader2 className="animate-spin h-8 w-8 text-primary mb-2" />
            <span className="text-sm text-muted-foreground">Loading permissions...</span>
        </div>
      );
  }

  if (error) {
      return (
          <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Error loading permissions: {error}</AlertDescription>
          </Alert>
      );
  }

  return (
    <div className="space-y-4 border rounded-md p-4 bg-card">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
            placeholder="Search permissions..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="h-9"
        />
      </div>
      
      <ScrollArea className="h-[300px] pr-4">
        {Object.keys(grouped).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                No permissions found.
            </div>
        ) : (
            Object.entries(grouped).map(([category, perms]) => (
                <div key={category} className="mb-6 last:mb-0">
                    <h4 className="font-semibold text-sm capitalize mb-3 text-primary border-b pb-1 sticky top-0 bg-card z-10">
                        {category.replace(/_/g, ' ')}
                    </h4>
                    <div className="grid grid-cols-1 gap-2 pl-2">
                        {perms.map(perm => (
                            <div key={perm.id} className="flex items-start space-x-3 p-2 rounded hover:bg-accent transition-colors">
                                <Checkbox 
                                    id={`perm-${perm.id}`} 
                                    checked={selectedPermissions.includes(perm.id)}
                                    onCheckedChange={() => handleToggle(perm.id)}
                                    className="mt-1"
                                />
                                <div className="grid gap-1 flex-1">
                                    <Label 
                                        htmlFor={`perm-${perm.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {perm.name}
                                    </Label>
                                    {perm.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {perm.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))
        )}
      </ScrollArea>
    </div>
  );
};

export default RolePermissionsSelect;