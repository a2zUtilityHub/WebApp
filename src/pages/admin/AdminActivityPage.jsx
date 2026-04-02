import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import AuditLogFilters from '@/components/admin/audit/AuditLogFilters';
import AuditLogTable from '@/components/admin/audit/AuditLogTable';
import ExportAuditLogsButton from '@/components/admin/audit/ExportAuditLogsButton';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw } from 'lucide-react';
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious
  } from '@/components/ui/pagination';

const AdminActivityPage = () => {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const limit = 20;
  
  const { logs, total, loading, fetchAuditLogs } = useAuditLogs();

  useEffect(() => {
    fetchAuditLogs(filters, page, limit);
  }, [filters, page, limit, fetchAuditLogs]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  };

  const handleRefresh = () => {
    fetchAuditLogs(filters, page, limit);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Helmet><title>Activity Log - Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-primary/10 rounded-full">
                <Activity className="h-6 w-6 text-primary" />
             </div>
             <div>
                <h1 className="text-2xl font-bold">Activity Log</h1>
                <p className="text-sm text-muted-foreground">Monitor system changes and administrative actions.</p>
             </div>
          </div>
          <div className="flex gap-2">
             <ExportAuditLogsButton filters={filters} />
             <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={loading} title="Refresh">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
             </Button>
          </div>
        </div>

        <AuditLogFilters onFilterChange={handleFilterChange} />

        <AuditLogTable logs={logs} loading={loading} />

        {/* Pagination */}
        {totalPages > 1 && (
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <span className="px-4 text-sm text-muted-foreground">
                            Page {page} of {totalPages} ({total} entries)
                        </span>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext 
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        )}
      </div>
    </>
  );
};

export default AdminActivityPage;