import React from "react";
import { Pagination } from "@heroui/react";
import { AuthLogFetchParams, AuthLogPagination } from "@/types/auth-log";

interface AuthLogsTableBottomContentProps {
  pagination: AuthLogPagination;
  query: AuthLogFetchParams;
  setQuery: React.Dispatch<React.SetStateAction<AuthLogFetchParams>>;
}

export default function AuthLogsTableBottomContent({
  pagination,
  query,
  setQuery,
}: AuthLogsTableBottomContentProps) {
  return (
    <div className="flex items-center justify-between px-2 py-2">
      <Pagination
        showControls
        color="primary"
        page={query.page ?? 1}
        total={pagination.total_pages}
        variant="light"
        onChange={(page) => setQuery({ ...query, page })}
      />
      <span className="text-small text-default-400">
        {pagination.total} activity logs
      </span>
    </div>
  );
}
