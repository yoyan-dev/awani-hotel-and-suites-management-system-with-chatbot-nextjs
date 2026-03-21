"use client";

import React from "react";
import { useRoomTypes } from "@/hooks/use-room-types";

export function useGuestHomePage() {
  const { room_types, isLoading, fetchRoomTypes } = useRoomTypes();

  React.useEffect(() => {
    fetchRoomTypes({});
  }, []);

  return {
    roomTypes: room_types,
    isLoading,
  };
}
