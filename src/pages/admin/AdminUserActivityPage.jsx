import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useUserActivityLogs } from '@/hooks/useUserActivityLogs';
import UserActivityFilters from '@/components/admin/activity/UserActivityFilters';
import UserActivityTable from '@/components/admin/activity/UserActivityTable';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminUserActivityPage = () => {
  const [filters, setFilters] = useState({});
  const { logs, loading, error, refetch, totalCount } = useUserActivityLogs();
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    refetch(filters, page, itemsPerPage);
  }, [filters, page, refetch]);

  const handleFilterChange = (newFilters) => {
      setFilters(newFilters);
      setPage(1); // Reset to first page on filter change
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <>
      <Helmet><title>User Activity - Admin</title></Helmet>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">User Activity Logs</h1>
                    <p className="text-sm text-muted-foreground">Monitor system access and user actions</p>
                </div>
            </div>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch(filters, page, itemsPerPage)}
                disabled={loading}
            >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
            </Button>
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Loading Logs</AlertTitle>
                <AlertDescription>
                    {error}
                    <Button variant="link" className="px-2 h-auto text-destructive-foreground underline" onClick={() => refetch(filters, page, itemsPerPage)}>
                        Retry
                    </Button>
                </AlertDescription>
            </Alert>
        )}

        <UserActivityFilters onFilterChange={handleFilterChange} />
        
        <div className="space-y-4">
            <UserActivityTable logs={logs} loading={loading} />
            
            {!loading && totalCount > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground border-t pt-4">
                    <span>
                        Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, totalCount)} of {totalCount} entries
                    </span>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setPage(p => Math.max(1, p-1))} 
                            disabled={page === 1 || loading}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                        </Button>
                        <span className="min-w-[3rem] text-center font-medium">
                            Page {page} of {totalPages}
                        </span>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setPage(p => Math.min(totalPages, p+1))} 
                            disabled={page >= totalPages || loading}
                        >
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </>
  );
};

export default AdminUserActivityPage;