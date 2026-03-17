"use client";

import { useAdminAuthLogsPage } from "@/hooks/admin/use-admin-auth-logs-page";
import Header from "./_components/header";
import AuthLogsTable from "./_components/auth-logs-table";
import AuthLogDetailsModal from "./_components/auth-log-details-modal";

export default function AuthLogsPage() {
  const {
    columns,
    logs,
    isLoading,
    page,
    setPage,
    total,
    pages,
    selectedLog,
    setSelectedLog,
    isViewOpen,
    setIsViewOpen,
    query,
    setQuery,
  } = useAdminAuthLogsPage();

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded space-y-4">
      <Header query={query} setQuery={setQuery} setPage={setPage} />
      <AuthLogsTable
        columns={columns}
        logs={logs}
        isLoading={isLoading}
        total={total}
        page={page}
        setPage={setPage}
        pages={pages}
        onView={(log) => {
          setSelectedLog(log);
          setIsViewOpen(true);
        }}
      />
      <AuthLogDetailsModal
        log={selectedLog}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />
    </div>
  );
}
