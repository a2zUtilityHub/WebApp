import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Loader2 } from 'lucide-react';
import { useDataExport } from '@/hooks/useDataExport';

const DataExportSection = () => {
  const [type, setType] = useState('all');
  const [format, setFormat] = useState('json');
  const { exportData, loading } = useDataExport();

  const handleExport = () => {
    exportData(type, format);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Export</CardTitle>
        <CardDescription>Export system data for reporting or local backup.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-[200px] space-y-2">
            <label className="text-sm font-medium">Data Type</label>
            <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Full System Dump</SelectItem>
                    <SelectItem value="users">Users Only</SelectItem>
                    <SelectItem value="roles">Roles & Permissions</SelectItem>
                    <SelectItem value="audit_logs">Audit Logs</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="w-full md:w-[150px] space-y-2">
            <label className="text-sm font-medium">Format</label>
            <Select value={format} onValueChange={setFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Button onClick={handleExport} disabled={loading} className="w-full md:w-auto">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {loading ? 'Exporting...' : 'Export Data'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataExportSection;