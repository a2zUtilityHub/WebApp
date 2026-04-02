import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useDataExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const exportData = async (type = 'all', format = 'json') => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Starting export for type: ${type}, format: ${format}`);
      let exportData = {};

      if (type === 'all' || type === 'system') {
        const [
          { data: profiles },
          { data: roles },
          { data: permissions },
          { data: auditLogs },
          { data: activityLogs }
        ] = await Promise.all([
          supabase.from('profiles').select('*'),
          supabase.from('roles').select('*'),
          supabase.from('permissions').select('*'),
          supabase.from('audit_logs').select('*').limit(1000),
          supabase.from('user_activity_logs').select('*').limit(1000)
        ]);
        
        exportData = {
          profiles,
          roles,
          permissions,
          audit_logs: auditLogs,
          activity_logs: activityLogs,
          exported_at: new Date().toISOString()
        };
      } else if (type === 'users') {
         const { data } = await supabase.from('profiles').select('*');
         exportData = { users: data, exported_at: new Date().toISOString() };
      } else if (type === 'roles') {
         const { data } = await supabase.from('roles').select('*');
         exportData = { roles: data, exported_at: new Date().toISOString() };
      } else if (type === 'audit_logs') {
          const { data } = await supabase.from('audit_logs').select('*').limit(5000);
          exportData = { audit_logs: data, exported_at: new Date().toISOString() };
      }

      // Convert to blob
      let blob;
      let filename = `export_${type}_${new Date().toISOString()}`;

      if (format === 'csv') {
        // Simple CSV flattening for the first array found in the object
        const firstKey = Object.keys(exportData).find(k => Array.isArray(exportData[k]));
        if (firstKey && exportData[firstKey].length > 0) {
            const items = exportData[firstKey];
            const header = Object.keys(items[0]).join(',');
            const rows = items.map(obj => 
                Object.values(obj).map(val => 
                    typeof val === 'object' ? `"${JSON.stringify(val).replace(/"/g, '""')}"` : `"${val}"`
                ).join(',')
            );
            const csvContent = [header, ...rows].join('\n');
            blob = new Blob([csvContent], { type: 'text/csv' });
            filename += '.csv';
        } else {
             // Fallback if structure is complex or empty
             const jsonContent = JSON.stringify(exportData, null, 2);
             blob = new Blob([jsonContent], { type: 'application/json' });
             filename += '.json'; // Forced fallback
             toast({ title: 'Warning', description: 'Exported as JSON due to complex data structure.' });
        }
      } else {
        const jsonContent = JSON.stringify(exportData, null, 2);
        blob = new Blob([jsonContent], { type: 'application/json' });
        filename += '.json';
      }

      // Download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({ title: 'Success', description: 'Data exported successfully.' });
      return { success: true };

    } catch (err) {
      console.error('Export error:', err);
      setError(err.message);
      toast({ title: 'Export Failed', description: err.message, variant: 'destructive' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { exportData, loading, error };
};