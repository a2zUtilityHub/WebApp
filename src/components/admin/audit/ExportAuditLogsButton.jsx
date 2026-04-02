import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const ExportAuditLogsButton = ({ filters }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      // Fetch all (or reasonable limit) for export
      const { data, error } = await supabase.functions.invoke('get-audit-logs', {
        body: { ...filters, page: 1, limit: 1000 } 
      });
      
      if (error || !data.logs) throw error || new Error("Failed to fetch logs");

      const csvContent = convertToCSV(data.logs);
      downloadCSV(csvContent);
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setLoading(false);
    }
  };

  const convertToCSV = (objArray) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = 'Timestamp,Admin Email,Action,Entity Type,Entity ID,Status,Error Message\r\n';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        const log = array[i];
        
        // Sanitize fields for CSV (escape commas)
        const timestamp = log.created_at;
        const email = log.profiles?.email || 'System';
        const action = log.action;
        const entity = log.entity_type || '';
        const id = log.target_id || '';
        const status = log.status || '';
        const error = (log.error_message || '').replace(/,/g, ';');

        line = `${timestamp},${email},${action},${entity},${id},${status},${error}`;
        str += line + '\r\n';
    }
    return str;
  };

  const downloadCSV = (csvStr) => {
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_logs_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={loading}>
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
      Export CSV
    </Button>
  );
};

export default ExportAuditLogsButton;