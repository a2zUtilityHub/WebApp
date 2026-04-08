
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

const RecordEditor = ({ isOpen, onClose, record, columns, tableName, onSave }) => {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(record || {});
    }
  }, [isOpen, record]);

  const handleChange = (columnName, value) => {
    setFormData(prev => ({ ...prev, [columnName]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save record:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (col) => {
    const value = formData[col.column_name] !== undefined ? formData[col.column_name] : '';
    const type = col.data_type?.toLowerCase() || 'text';

    if (type.includes('bool')) {
      return (
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox
            id={col.column_name}
            checked={!!value}
            onCheckedChange={(checked) => handleChange(col.column_name, checked)}
          />
          <label htmlFor={col.column_name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {col.column_name}
          </label>
        </div>
      );
    }

    if (type.includes('json') || type.includes('text')) {
      return (
        <Textarea
          id={col.column_name}
          value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
          onChange={(e) => handleChange(col.column_name, e.target.value)}
          className="font-mono text-sm mt-1"
          rows={4}
        />
      );
    }

    const inputType = type.includes('int') || type.includes('numeric') ? 'number' : type.includes('timestamp') || type.includes('date') ? 'datetime-local' : 'text';

    return (
      <Input
        id={col.column_name}
        type={inputType}
        value={value}
        onChange={(e) => handleChange(col.column_name, e.target.value)}
        className="mt-1"
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{record ? 'Edit Record' : 'New Record'}</DialogTitle>
          <DialogDescription>
            {record ? `Updating record in ${tableName}` : `Adding new record to ${tableName}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 py-4 space-y-4">
          {columns.map((col) => (
            <div key={col.column_name} className="space-y-1">
              <Label htmlFor={col.column_name} className="flex items-center gap-2">
                {col.column_name}
                {col.is_nullable === 'NO' && <span className="text-destructive">*</span>}
                <span className="text-xs text-muted-foreground font-normal bg-muted px-1.5 py-0.5 rounded">
                  {col.data_type}
                </span>
              </Label>
              {renderInput(col)}
              {col.column_default && (
                <p className="text-xs text-muted-foreground">Default: {col.column_default}</p>
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordEditor;
