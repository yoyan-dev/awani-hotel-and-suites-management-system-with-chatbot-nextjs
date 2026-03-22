"use client";

import React, { useDeferredValue } from "react";
import { useAuthLogs } from "@/hooks/use-auth-logs";
import { authLogColumns } from "@/utils/admin/auth-log-columns";
import { AuthLog, AuthLogFetchParams } from "@/types/auth-log";

export function useAdminAuthLogsPage() {
  const { logs, pagination, isLoading, fetchAuthLogs } = useAuthLogs();
  const [selectedLog, setSelectedLog] = React.useState<AuthLog | null>(null);
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [query, setQuery] = React.useState<AuthLogFetchParams>({
    page: 1,
    query: "",
  });
  const deferredQuery = useDeferredValue(query);

  React.useEffect(() => {
    fetchAuthLogs({
      ...deferredQuery,
      page: deferredQuery.page ?? 1,
      query: deferredQuery.query?.trim() ?? "",
    });
  }, [deferredQuery]);

  return {
    columns: authLogColumns,
    logs,
    pagination,
    isLoading,
    selectedLog,
    setSelectedLog,
    isViewOpen,
    setIsViewOpen,
    query,
    setQuery,
  };
}
