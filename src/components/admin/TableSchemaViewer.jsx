
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Database, Calendar, HardDrive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TableSchemaViewer = ({ tableName, schema = [] }) => {
  const { toast } = useToast();

  const getDataTypeColor = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('int') || t.includes('numeric') || t.includes('float')) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (t.includes('timestamp') || t.includes('date')) return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    if (t.includes('bool')) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    if (t.includes('json')) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    if (t.includes('uuid')) return 'bg-red-500/10 text-red-500 border-red-500/20';
    return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  };

  const copySchemaDDL = () => {
    const ddl = `CREATE TABLE ${tableName} (\n` + 
      schema.map(col => `  ${col.column_name} ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}${col.column_default ? ` DEFAULT ${col.column_default}` : ''}`).join(',\n') +
      '\n);';
    
    navigator.clipboard.writeText(ddl);
    toast({ title: "Schema Copied", description: "DDL copied to clipboard." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-muted/30 p-4 rounded-lg border">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p className="text-muted-foreground">Columns</p>
              <p className="font-medium">{schema.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p className="text-muted-foreground">Est. Size</p>
              <p className="font-medium">-- KB</p>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={copySchemaDDL}>
          <Copy className="h-4 w-4 mr-2" />
          Copy DDL
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Column Name</TableHead>
              <TableHead>Data Type</TableHead>
              <TableHead>Nullable</TableHead>
              <TableHead>Default Value</TableHead>
              <TableHead>Primary Key</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schema.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No schema information available.
                </TableCell>
              </TableRow>
            ) : (
              schema.map((col) => (
                <TableRow key={col.column_name}>
                  <TableCell className="font-medium">{col.column_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getDataTypeColor(col.data_type)}>
                      {col.data_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{col.is_nullable === 'YES' ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {col.column_default || '-'}
                  </TableCell>
                  <TableCell>
                    {col.is_primary ? <Badge variant="secondary">PK</Badge> : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableSchemaViewer;
