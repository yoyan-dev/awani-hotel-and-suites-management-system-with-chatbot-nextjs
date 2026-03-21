"use client";
import Header from "./_components/header";
import FeedbackTable from "./_components/table/feedback-table";
import { useAdminFeedbackPage } from "@/hooks/admin/use-admin-feedback-page";

export default function FeedbackPage() {
  const tableState = useAdminFeedbackPage();

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded ">
      <Header />
      <FeedbackTable {...tableState} />
    </div>
  );
}
