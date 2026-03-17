"use client";

import React from "react";
import { RoomReportFetchParams } from "@/types/room-report";
import { useRoomReports } from "@/hooks/use-room-reports";
import { Pagination } from "@heroui/react";
import Loader from "@/app/(protected)/housekeeping/rooms/_components/loader";
import RoomReportsFilter from "@/components/room-reportings/room-report-filter";
import RoomReportCard from "@/components/room-reportings/room-report-card";
import Header from "@/components/room-reportings/header";

export default function HousekeepingRoomsReportPage() {
  const {
    room_reports = [],
    isLoading,
    pagination,
    fetchRoomReports,
  } = useRoomReports();

  const [query, setQuery] = React.useState<RoomReportFetchParams>({ page: 1 });

  React.useEffect(() => {
    fetchRoomReports(query);
  }, [query]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Header
          title="Housekeeping Room Reports"
          description="Track lost, damaged, and reported room items efficiently"
        />

        <RoomReportsFilter query={query} setQuery={setQuery} />
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Loader key={i} />
            ))}
          </div>
        ) : room_reports.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            No reports found
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {room_reports.map((report) => (
              <RoomReportCard key={report.id} report={report} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination?.total_pages && pagination.total_pages > 1 && (
          <div className="flex items-center justify-center pt-6">
            <Pagination
              showControls
              color="primary"
              page={query.page || 1}
              total={pagination.total_pages}
              variant="light"
              onChange={(page: number) => setQuery({ ...query, page })}
            />
          </div>
        )}
      </div>
    </main>
  );
}
