"use client";

import React from "react";
import { authLogColumns } from "@/utils/admin/auth-log-columns";
import { AuthLog, AuthLogApiResponse } from "@/types/auth-log";

export function useAdminAuthLogsPage() {
  const [logs, setLogs] = React.useState<AuthLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [selectedLog, setSelectedLog] = React.useState<AuthLog | null>(null);
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const limit = 20;

  const pages = Math.max(Math.ceil(total / limit), 1);

  React.useEffect(() => {
    let isMounted = true;

    async function loadLogs() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (query.trim()) {
          params.set("q", query.trim());
        }
        const res = await fetch(`/api/auth-logs?${params.toString()}`);
        const json = (await res.json()) as AuthLogApiResponse;
        if (!isMounted) return;
        if (json.success && json.data) {
          setLogs(json.data.items);
          setTotal(json.data.total);
        } else {
          setLogs([]);
          setTotal(0);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load auth logs:", error);
        setLogs([]);
        setTotal(0);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadLogs();
    return () => {
      isMounted = false;
    };
  }, [page, query]);

  return {
    columns: authLogColumns,
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
  };
}
