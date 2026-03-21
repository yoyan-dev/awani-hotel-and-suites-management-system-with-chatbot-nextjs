"use client";

import React from "react";
import { useRooms } from "@/hooks/use-rooms";
import { FetchRoomsParams } from "@/types/room";

export function useHousekeepingRoomsPage() {
  const {
    rooms,
    isLoading,
    pagination,
    analytics,
    fetchRooms,
    fetchAnalytics,
  } = useRooms();
  const [query, setQuery] = React.useState<FetchRoomsParams>({});

  React.useEffect(() => {
    fetchRooms(query);
  }, [query]);

  React.useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleUpdateStatus = (
    roomId?: string,
    status?: string,
    remarks?: string,
  ) => {
    console.log("Update room:", roomId, status, remarks);
  };

  return {
    rooms,
    isLoading,
    pagination,
    analytics,
    query,
    setQuery,
    handleUpdateStatus,
  };
}
