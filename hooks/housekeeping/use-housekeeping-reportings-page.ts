"use client";

import React from "react";
import { RoomReportFetchParams } from "@/types/room-report";
import { useRoomReports } from "@/hooks/use-room-reports";

export function useHousekeepingReportingsPage() {
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

  return {
    roomReports: room_reports,
    isLoading,
    pagination,
    query,
    setQuery,
  };
}
