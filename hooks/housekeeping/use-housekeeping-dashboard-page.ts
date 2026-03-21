"use client";

import React from "react";
import { useHousekeeping } from "@/hooks/use-housekeeping";
import type { RoomListResponse, TodayOperations } from "@/types/housekeeping";

type UseHousekeepingDashboardPageOptions = {
  initialRoomList: RoomListResponse;
  initialTodayOperations: TodayOperations;
  initialError: string | null;
};

export function useHousekeepingDashboardPage({
  initialRoomList,
  initialTodayOperations,
  initialError,
}: UseHousekeepingDashboardPageOptions) {
  const {
    roomList,
    todayOperations,
    summary,
    isLoading,
    error,
    fetchRoomList,
    fetchTodayOperations,
    clearError,
  } = useHousekeeping();

  const [hasFetchedClientData, setHasFetchedClientData] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchRoomList({}), fetchTodayOperations({})]);
      setHasFetchedClientData(true);
    };

    void loadData();
  }, [fetchRoomList, fetchTodayOperations]);

  const handleRefresh = async () => {
    await Promise.all([fetchRoomList({}), fetchTodayOperations({})]);
    setHasFetchedClientData(true);
  };

  const displayRoomList = React.useMemo(
    () =>
      hasFetchedClientData
        ? roomList
        : {
            data: initialRoomList.rooms,
            pagination: {
              ...roomList.pagination,
              ...initialRoomList.pagination,
              has_next:
                initialRoomList.pagination.page <
                initialRoomList.pagination.total_pages,
              has_prev: initialRoomList.pagination.page > 1,
            },
          },
    [hasFetchedClientData, roomList, initialRoomList],
  );

  const displaySummary = hasFetchedClientData ? summary : initialRoomList.summary;
  const displayTodayOperations = hasFetchedClientData
    ? todayOperations
    : initialTodayOperations;
  const displayError = error || (!hasFetchedClientData ? initialError : null);

  return {
    displayRoomList,
    displaySummary,
    displayTodayOperations,
    displayError,
    isLoading,
    clearError,
    handleRefresh,
  };
}
