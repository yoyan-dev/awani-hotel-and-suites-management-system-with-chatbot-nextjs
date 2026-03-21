"use client";
import Header from "./_components/header";
import FeedbackTable from "./_components/table/feedback-table";
import { useFrontOfficeFeedbackPage } from "@/hooks/front-office/use-front-office-feedback-page";

export default function FeedbackPage() {
  const tableState = useFrontOfficeFeedbackPage();

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded ">
      <Header />
      <FeedbackTable {...tableState} />
    </div>
  );
}
