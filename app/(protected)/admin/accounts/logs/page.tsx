"use client";

import { useAdminAuthLogsPage } from "@/hooks/admin/use-admin-auth-logs-page";
import Header from "./_components/header";
import AuthLogsTable from "./_components/table/auth-logs-table";
import AuthLogDetailsModal from "./_components/modals/auth-log-details-modal";

export default function AuthLogsPage() {
  const {
    columns,
    logs,
    pagination,
    isLoading,
    selectedLog,
    setSelectedLog,
    isViewOpen,
    setIsViewOpen,
    query,
    setQuery,
  } = useAdminAuthLogsPage();

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded space-y-4">
      <Header />
      <AuthLogsTable
        columns={columns}
        logs={logs}
        pagination={pagination}
        isLoading={isLoading}
        query={query}
        setQuery={setQuery}
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
