"use client";
import Header from "./_components/header";
import React from "react";
import { useGuestFeedback } from "@/hooks/use-feedback";
import { FeedbackFetchParams } from "@/types/feedback";
import FeedbackTable from "./_components/table/feedback-table";
import { columns, INITIAL_VISIBLE_COLUMNS } from "@/app/constants/feedback";

export default function FeedbackPage() {
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

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded ">
      <Header />
      <FeedbackTable
        guestFeedbacks={guest_feedbacks}
        pagination={pagination}
        query={query}
        setQuery={setQuery}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        headerColumns={headerColumns}
        isLoading={isLoading}
      />
    </div>
  );
}
