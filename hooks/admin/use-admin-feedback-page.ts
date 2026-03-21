"use client";

import React from "react";
import { useGuestFeedback } from "@/hooks/use-feedback";
import { FeedbackFetchParams } from "@/types/feedback";
import { columns, INITIAL_VISIBLE_COLUMNS } from "@/app/constants/feedback";

export function useAdminFeedbackPage() {
  const { guest_feedbacks, pagination, isLoading, fetchGuestFeedbacks } =
    useGuestFeedback();
  const [query, setQuery] = React.useState<FeedbackFetchParams>(
    {} as FeedbackFetchParams,
  );
  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<any>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  React.useEffect(() => {
    fetchGuestFeedbacks(query);
  }, [query]);

  return {
    guestFeedbacks: guest_feedbacks,
    pagination,
    query,
    setQuery,
    selectedKeys,
    setSelectedKeys,
    visibleColumns,
    setVisibleColumns,
    headerColumns,
    isLoading,
  };
}
